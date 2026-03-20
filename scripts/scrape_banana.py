"""BananaPrompts.org scraper - UTF-8 safe"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import requests, json, re, time, hashlib, sqlite3
from bs4 import BeautifulSoup
from pathlib import Path
from urllib.parse import urljoin

BASE    = "https://bananaprompts.org"
R2_BASE = "pub-37a08b330da1467d853b8f9635b847b4.r2.dev"
HEADERS = {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124"}
DB_PATH = r"D:\Projeler\SCX-Studio-Pro\prisma\scx_studio.db"
IMG_DIR = Path(r"D:\Projeler\SCX-Studio-Pro\public\downloads")
IMG_DIR.mkdir(parents=True, exist_ok=True)

PAGES = [
    ("/prompts-gallery",                 "Gallery"),
    ("/nano-banana-pro-prompts",         "NanaBananaPro"),
    ("/nano-banana-pro-curated-prompts", "Curated"),
    ("/vip-prompts",                     "VIP"),
    ("/trend-prompts",                   "Trend"),
]

sess = requests.Session()
sess.headers.update(HEADERS)

conn = sqlite3.connect(DB_PATH)
cur  = conn.cursor()
cur.execute("SELECT originalPrompt FROM PromptTemplate")
seen = {hashlib.md5(r[0].encode()).hexdigest() for r in cur.fetchall()}
print(f"Mevcut DB: {len(seen)} prompt")

def phash(t): return hashlib.md5(t.strip().encode()).hexdigest()

def clean(text):
    for p in ["nano banana pro prompts:","vip prompts:","prompts:"]:
        if text.lower().startswith(p):
            text = text[len(p):].strip()
    return text.strip()

def fetch(url, n=3):
    for i in range(n):
        try:
            r = sess.get(url, timeout=25)
            if r.status_code == 200: return r.text
        except Exception as e:
            print(f"  Hata {i+1}: {e}"); time.sleep(2)
    return ""

def parse(html, coll):
    soup = BeautifulSoup(html, "html.parser")
    found = {}
    # img alt = prompt
    for img in soup.find_all("img", src=True):
        src = img.get("src","")
        alt = img.get("alt","")
        if R2_BASE not in src and "bananaprompts.org/images" not in src: continue
        prompt = clean(alt)
        if len(prompt) < 40: continue
        img_url = src if src.startswith("http") else urljoin(BASE, src)
        h = phash(prompt)
        if h not in found:
            found[h] = {"prompt": prompt, "image_url": img_url, "collection": coll}
    # __NEXT_DATA__
    nd = soup.find("script", id="__NEXT_DATA__")
    if nd:
        try:
            data = json.loads(nd.string)
            def walk(obj, d=0):
                if d>14: return
                if isinstance(obj, dict):
                    for k in ("prompt","promptText","text","content"):
                        v = obj.get(k,"")
                        if v and len(str(v))>50:
                            img = obj.get("image") or obj.get("imageUrl") or obj.get("image_url") or ""
                            ptext = clean(str(v))
                            h = phash(ptext)
                            if h not in found:
                                found[h] = {"prompt":ptext,"image_url":img,"collection":coll}
                    for val in obj.values(): walk(val, d+1)
                elif isinstance(obj, list):
                    for item in obj: walk(item, d+1)
            walk(data)
        except: pass
    return list(found.values())

def dl_img(url):
    if not url or not url.startswith("http"): return None
    fname = url.split("/")[-1].split("?")[0]
    if not fname or "." not in fname: return None
    ext = fname.rsplit(".",1)[-1].lower()
    if ext not in ("jpg","jpeg","png","webp","gif"): return None
    local = IMG_DIR / fname
    if local.exists(): return f"/downloads/{fname}"
    try:
        r = sess.get(url, timeout=15)
        if r.status_code==200 and len(r.content)>500:
            local.write_bytes(r.content)
            return f"/downloads/{fname}"
    except: pass
    return None

all_new = []
for path, coll in PAGES:
    url = BASE+path
    print(f"\n[{coll}] {url}")
    html = fetch(url)
    if not html: print("  -> Atlandı"); continue
    items = parse(html, coll)
    # pagination
    soup2 = BeautifulSoup(html,"html.parser")
    for a in soup2.find_all("a",href=True):
        href = a["href"]
        if "page=" in href or "/page/" in href:
            ep = urljoin(url, href)
            time.sleep(1)
            eh = fetch(ep)
            if eh: items.extend(parse(eh, coll))
    new = 0
    for item in items:
        h = phash(item["prompt"])
        if h in seen: continue
        seen.add(h); all_new.append(item); new += 1
    print(f"  -> {len(items)} bulundu, {new} yeni")
    time.sleep(1.5)

print(f"\nToplam {len(all_new)} yeni prompt")
ok = err = 0
for i, item in enumerate(all_new, 1):
    try:
        p = item["prompt"]; img_url = item.get("image_url",""); coll = item["collection"]
        tmpl = p; defs = {"SUBJECT":"a person","OUTFIT":"original outfit","POSE":"natural pose","BACKGROUND":"original background"}
        for s in ["a man","a woman","a person","the person","young man","young woman"]:
            if s.lower() in tmpl.lower():
                tmpl = re.sub(re.escape(s),"[SUBJECT]",tmpl,flags=re.IGNORECASE,count=1)
                defs["SUBJECT"]=s; break
        if "[SUBJECT]" not in tmpl: tmpl = "[SUBJECT], "+tmpl
        lp = dl_img(img_url) if img_url else None
        cur.execute("INSERT INTO PromptTemplate (collection,originalPrompt,template,defaults,explanation,imageUrl,localPath,isRefined,isNSFW,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,1,0,datetime('now'),datetime('now'))",
            (coll,p,tmpl,json.dumps(defs),p[:120]+"...",img_url or None,lp))
        ok += 1
        if i%25==0: conn.commit(); print(f"  {i}/{len(all_new)}...")
    except Exception as e: err += 1
conn.commit(); conn.close()
c2 = sqlite3.connect(DB_PATH).cursor()
c2.execute("SELECT COUNT(*) FROM PromptTemplate")
total = c2.fetchone()[0]
print(f"\nTAMAM: {ok} eklendi, {err} hata. DB toplam: {total}")

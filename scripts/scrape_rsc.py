"""
BananaPrompts - RSC Payload + Server Action Interceptor
text/x-component yanıtlarını yakala, tüm prompt data'yı parse et.
"""
import sys, io, json, re, hashlib, sqlite3, time
from pathlib import Path
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from playwright.sync_api import sync_playwright

DB_PATH = r"D:\Projeler\SCX-Studio-Pro\prisma\scx_studio.db"
IMG_DIR = Path(r"D:\Projeler\SCX-Studio-Pro\public\downloads")
IMG_DIR.mkdir(parents=True, exist_ok=True)

import requests as reqlib
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124"}

conn = sqlite3.connect(DB_PATH)
cur  = conn.cursor()
cur.execute("SELECT originalPrompt FROM PromptTemplate")
seen = {hashlib.md5(r[0].encode()).hexdigest() for r in cur.fetchall()}
print(f"DB mevcut: {len(seen)} prompt")

def phash(t): return hashlib.md5(t.strip().encode()).hexdigest()
def clean(text):
    for p in ["nano banana pro prompts:","vip prompts:","trend prompts:","prompts:"]:
        if text.lower().startswith(p): text = text[len(p):].strip()
    return text.strip()

def download_img(url):
    if not url or not url.startswith("http"): return None
    fname = url.split("/")[-1].split("?")[0]
    if not fname or "." not in fname: return None
    ext = fname.rsplit(".",1)[-1].lower()
    if ext not in ("jpg","jpeg","png","webp","gif"): return None
    local = IMG_DIR / fname
    if local.exists(): return f"/downloads/{fname}"
    try:
        r = reqlib.get(url, headers=HEADERS, timeout=20)
        if r.status_code==200 and len(r.content)>500:
            local.write_bytes(r.content); return f"/downloads/{fname}"
    except: pass
    return None

def parse_rsc_payload(text):
    """RSC text/x-component formatından prompt+image verisi cıkar."""
    results = {}
    # Prompt alanları
    for m in re.finditer(r'"prompt"\s*:\s*"((?:[^"\\]|\\.){30,3000})"', text):
        p = m.group(1).replace("\\n","\n").replace('\\"','"').replace("\\\\","\\").replace("\\/","/")
        h = phash(p)
        if h not in results: results[h] = {"prompt": p, "image_url": ""}

    # imageUrl alanları  
    for m in re.finditer(r'"(?:imageUrl|image_url|imageSrc|src)"\s*:\s*"(https://pub-[^"]+\.(?:webp|jpg|jpeg|png))"', text):
        img = m.group(1)
        # Bu img'ye en yakin promptu bul
        pos = m.start()
        # 2000 karakter geriye bak
        lookback = text[max(0, pos-2000):pos]
        pm = list(re.finditer(r'"prompt"\s*:\s*"((?:[^"\\]|\\.){30,}?)"', lookback))
        if pm:
            p = pm[-1].group(1).replace("\\n","\n").replace('\\"','"').replace("\\\\","\\")
            h = phash(p)
            if h in results: results[h]["image_url"] = img

    return list(results.values())

all_captures = {}  # hash -> item

PAGES = [
    ("https://bananaprompts.org/prompts-gallery",                 "Gallery"),
    ("https://bananaprompts.org/nano-banana-pro-prompts",         "NanaBananaPro"),
    ("https://bananaprompts.org/nano-banana-pro-curated-prompts", "Curated"),
    ("https://bananaprompts.org/vip-prompts",                     "VIP"),
    ("https://bananaprompts.org/trend-prompts",                   "Trend"),
]

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, args=["--no-sandbox","--disable-blink-features=AutomationControlled"])
    ctx = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        viewport={"width":1920,"height":1080}, locale="en-US",
        extra_http_headers={"Accept-Language":"en-US,en;q=0.9"}
    )
    page = ctx.new_page()
    page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined}); window.chrome={runtime:{}};")

    rsc_bodies = {}  # url -> body

    def on_response(response):
        url = response.url
        ct = response.headers.get("content-type","")
        if "text/x-component" in ct and len(url) < 200:
            try:
                body = response.text()
                if len(body) > 200:
                    rsc_bodies[url] = body
            except: pass

    page.on("response", on_response)

    for page_url, coll in PAGES:
        print(f"\n=== {coll}: {page_url} ===")
        rsc_bodies.clear()

        try:
            page.goto(page_url, wait_until="networkidle", timeout=30000)
        except:
            try: page.goto(page_url, wait_until="domcontentloaded", timeout=20000)
            except: print("  ATLANDII"); continue

        page.wait_for_timeout(2000)

        # RSC navigasyon isteklerini de tetikle
        rsc_key = str(int(time.time() * 1000) % 100000)
        try:
            resp = page.request.get(f"{page_url}?_rsc={rsc_key}", headers={"Accept":"text/x-component","Next-Router-State-Tree":"..."})
            if resp.status == 200: rsc_bodies[f"{page_url}_rsc"] = resp.text()
        except: pass

        # İçerik scroll
        for _ in range(20):
            page.evaluate("window.scrollBy(0, 800)")
            page.wait_for_timeout(400)

        # Load More butonunu bul ve tıkla (tekrar tekrar)
        clicked = 0
        for attempt in range(30):
            btns = page.query_selector_all("button")
            load_btn = None
            for btn in btns:
                try:
                    txt = (btn.inner_text() or "").lower()
                    if any(x in txt for x in ["load more","show more","see more","more prompts","load","next"]):
                        load_btn = btn; break
                except: pass
            if load_btn:
                try:
                    load_btn.scroll_into_view_if_needed()
                    load_btn.click()
                    page.wait_for_timeout(2000)
                    clicked += 1
                    print(f"  Load More #{clicked} tıklandı")
                except: break
            else:
                break

        # Tüm img'leri topla (sayfadaki son durum)
        imgs = page.query_selector_all("img")
        img_items = {}
        for img in imgs:
            try:
                src = img.get_attribute("src") or ""
                alt = img.get_attribute("alt") or ""
                if "r2.dev" not in src: continue
                p = clean(alt)
                if len(p) < 30: continue
                h = phash(p)
                img_items[h] = {"prompt": p, "image_url": src, "collection": coll}
            except: pass
        print(f"  DOM'dan: {len(img_items)} item")

        # RSC body'lerinden parse et
        rsc_count = 0
        for url, body in rsc_bodies.items():
            parsed = parse_rsc_payload(body)
            for item in parsed:
                h = phash(item["prompt"])
                if h not in img_items:
                    img_items[h] = {**item, "collection": coll}
                    rsc_count += 1
        print(f"  RSC'den: {rsc_count} ek item ({len(rsc_bodies)} RSC dosyası)")

        # Global seen ile filtrele
        new = 0
        for h, item in img_items.items():
            if h not in seen:
                seen.add(h)
                all_captures[h] = item
                new += 1
        print(f"  YENI: {new}")

    browser.close()

all_new = list(all_captures.values())
print(f"\nToplam {len(all_new)} yeni benzersiz prompt DB'ye yazılıyor...")

import re as re_mod
ok = err = 0
for i, item in enumerate(all_new, 1):
    try:
        p = item["prompt"]; img_url = item.get("image_url",""); coll = item["collection"]
        tmpl = p
        defs = {"SUBJECT":"a person","OUTFIT":"original outfit","POSE":"natural pose","BACKGROUND":"original background"}
        for s in ["a man","a woman","a person","the person","young man","young woman"]:
            if s.lower() in tmpl.lower():
                tmpl = re_mod.sub(re_mod.escape(s),"[SUBJECT]",tmpl,flags=re_mod.IGNORECASE,count=1)
                defs["SUBJECT"]=s; break
        if "[SUBJECT]" not in tmpl: tmpl = "[SUBJECT], " + tmpl
        lp = download_img(img_url)
        cur.execute("INSERT INTO PromptTemplate (collection,originalPrompt,template,defaults,explanation,imageUrl,localPath,isRefined,isNSFW,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,1,0,datetime('now'),datetime('now'))",
            (coll,p,tmpl,json.dumps(defs),p[:120]+"...",img_url or None,lp))
        ok+=1
        if i%25==0: conn.commit(); print(f"  {i}/{len(all_new)}...")
    except Exception as e: err+=1; print(f"  ERR: {e}")

conn.commit(); conn.close()
c2=sqlite3.connect(DB_PATH).cursor(); c2.execute("SELECT COUNT(*) FROM PromptTemplate")
print(f"\nTAMAM: +{ok} eklendi, {err} hata. DB TOPLAM: {c2.fetchone()[0]}")

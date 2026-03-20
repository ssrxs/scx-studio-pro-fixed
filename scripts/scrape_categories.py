"""
BananaPrompts - Category Filter Scraper
Her kategori/filtre butonuna tıklar, yüklenen promptları çeker.
"""
import sys,io,json,re,hashlib,sqlite3,time
from pathlib import Path
sys.stdout=io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8',errors='replace')
from playwright.sync_api import sync_playwright

DB_PATH = r"D:\Projeler\SCX-Studio-Pro\prisma\scx_studio.db"
IMG_DIR = Path(r"D:\Projeler\SCX-Studio-Pro\public\downloads")
IMG_DIR.mkdir(parents=True,exist_ok=True)
import requests as rlib

conn=sqlite3.connect(DB_PATH); cur=conn.cursor()
cur.execute("SELECT originalPrompt FROM PromptTemplate")
seen={hashlib.md5(r[0].encode()).hexdigest() for r in cur.fetchall()}
print(f"DB mevcut: {len(seen)}")
def phash(t): return hashlib.md5(t.strip().encode()).hexdigest()
def clean(t):
    for p in ["nano banana pro prompts:","vip prompts:","trend prompts:","prompts:"]:
        if t.lower().startswith(p): t=t[len(p):].strip()
    return t.strip()
def dl(url):
    if not url or not url.startswith("http"): return None
    f=url.split("/")[-1].split("?")[0]
    if not f or "." not in f: return None
    e=f.rsplit(".",1)[-1].lower()
    if e not in ("jpg","jpeg","png","webp","gif"): return None
    lp=IMG_DIR/f
    if lp.exists(): return f"/downloads/{f}"
    try:
        r=rlib.get(url,headers={"User-Agent":"Mozilla/5.0"},timeout=20)
        if r.status_code==200 and len(r.content)>500: lp.write_bytes(r.content); return f"/downloads/{f}"
    except: pass
    return None

def get_items(page, coll):
    items={}
    for img in page.query_selector_all("img"):
        try:
            src=img.get_attribute("src") or ""
            alt=img.get_attribute("alt") or ""
            if "r2.dev" not in src: continue
            p=clean(alt)
            if len(p)<30: continue
            h=phash(p)
            if h not in items: items[h]={"prompt":p,"image_url":src,"collection":coll}
        except: pass
    return items

all_new={}

CATEGORY_PAGES=[
    ("https://bananaprompts.org/prompts-gallery","Gallery"),
    ("https://bananaprompts.org/nano-banana-pro-prompts","NanaBananaPro"),
    ("https://bananaprompts.org/nano-banana-pro-curated-prompts","Curated"),
    ("https://bananaprompts.org/vip-prompts","VIP"),
    ("https://bananaprompts.org/trend-prompts","Trend"),
]

with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,args=["--no-sandbox","--disable-blink-features=AutomationControlled"])
    ctx=browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
        viewport={"width":1920,"height":1080},locale="en-US"
    )
    page=ctx.new_page()
    page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined});window.chrome={runtime:{}};")

    for url,coll in CATEGORY_PAGES:
        print(f"\n[{coll}] {url}")
        try: page.goto(url,wait_until="networkidle",timeout=30000)
        except:
            try: page.goto(url,wait_until="domcontentloaded",timeout=20000)
            except: print("  ATLANDI"); continue
        page.wait_for_timeout(3000)

        # Kategori/filtre butonlarını bul
        filter_btns = []
        for sel in ["button","a[href*='filter']","a[href*='category']","[role='tab']","[data-filter]","label"]:
            els = page.query_selector_all(sel)
            for el in els:
                try:
                    txt=(el.inner_text() or "").strip()
                    if 2<len(txt)<50 and not any(x in txt.lower() for x in ["cookie","accept","close","menu","login","sign","pricing","blog"]):
                        filter_btns.append((sel,txt))
                except: pass
        print(f"  {len(filter_btns)} potansiyel filtre bulundu")

        # Önce mevcut görüntüleri al
        items=get_items(page,coll)
        print(f"  Başlangıç: {len(items)} item")

        # Her filtre/kategori butonuna tıkla
        unique_btns = list({t:s for s,t in filter_btns[:50]}.items())
        clicked_count=0
        for btn_text, btn_sel in unique_btns[:30]:
            try:
                btn=page.query_selector(f"{btn_sel}:text('{btn_text}')")
                if not btn: continue
                btn.click()
                page.wait_for_timeout(2000)
                new_items=get_items(page,coll)
                added=len(new_items)-len(items)
                if added>0:
                    items.update(new_items)
                    print(f"    '{btn_text}' -> +{added} (toplam: {len(items)})")
                clicked_count+=1
            except: pass

        # Scroll
        for _ in range(10):
            page.evaluate("window.scrollTo(0,document.body.scrollHeight)")
            page.wait_for_timeout(800)
        items.update(get_items(page,coll))

        new=0
        for h,item in items.items():
            if h not in seen: seen.add(h); all_new[h]=item; new+=1
        print(f"  YENI: {new} (toplam item: {len(items)})")

    browser.close()

print(f"\nToplam {len(all_new)} yeni prompt yazılıyor...")
import re as rem
ok=err=0
for i,(h,item) in enumerate(all_new.items(),1):
    try:
        p=item["prompt"]; img_url=item.get("image_url",""); coll=item["collection"]
        tmpl=p
        defs={"SUBJECT":"a person","OUTFIT":"original outfit","POSE":"natural pose","BACKGROUND":"original background"}
        for s in ["a man","a woman","a person","the person","young man","young woman"]:
            if s.lower() in tmpl.lower():
                tmpl=rem.sub(rem.escape(s),"[SUBJECT]",tmpl,flags=rem.IGNORECASE,count=1)
                defs["SUBJECT"]=s; break
        if "[SUBJECT]" not in tmpl: tmpl="[SUBJECT], "+tmpl
        lp=dl(img_url)
        cur.execute("INSERT INTO PromptTemplate (collection,originalPrompt,template,defaults,explanation,imageUrl,localPath,isRefined,isNSFW,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,1,0,datetime('now'),datetime('now'))",
            (coll,p,tmpl,json.dumps(defs),p[:120]+"...",img_url or None,lp))
        ok+=1
        if i%25==0: conn.commit(); print(f"  {i}/{len(all_new)}...")
    except Exception as e: err+=1
conn.commit(); conn.close()
c2=sqlite3.connect(DB_PATH).cursor(); c2.execute("SELECT COUNT(*) FROM PromptTemplate")
print(f"\nTAMAM: +{ok} eklendi, {err} hata. DB TOPLAM: {c2.fetchone()[0]}")

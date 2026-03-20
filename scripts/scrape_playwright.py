"""
BananaPrompts.org — Playwright Browser Scraper
Sayfaları tarayıcıyla tam render eder, tüm JS yüklenen içerikleri çeker.
"""
import sys, io, json, re, hashlib, sqlite3, time, os
from pathlib import Path
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

DB_PATH = r"D:\Projeler\SCX-Studio-Pro\prisma\scx_studio.db"
IMG_DIR = Path(r"D:\Projeler\SCX-Studio-Pro\public\downloads")
IMG_DIR.mkdir(parents=True, exist_ok=True)

PAGES_TO_SCRAPE = [
    ("https://bananaprompts.org/prompts-gallery",                 "Gallery"),
    ("https://bananaprompts.org/nano-banana-pro-prompts",         "NanaBananaPro"),
    ("https://bananaprompts.org/nano-banana-pro-curated-prompts", "Curated"),
    ("https://bananaprompts.org/vip-prompts",                     "VIP"),
    ("https://bananaprompts.org/trend-prompts",                   "Trend"),
]

# --- DB: mevcut hash'leri yukle ---
conn = sqlite3.connect(DB_PATH)
cur  = conn.cursor()
cur.execute("SELECT originalPrompt FROM PromptTemplate")
seen = {hashlib.md5(r[0].encode()).hexdigest() for r in cur.fetchall()}
print(f"DB mevcut: {len(seen)} prompt")

def phash(t): return hashlib.md5(t.strip().encode()).hexdigest()

def clean(text):
    for p in ["nano banana pro prompts:", "vip prompts:", "trend prompts:", "prompts:"]:
        if text.lower().startswith(p):
            text = text[len(p):].strip()
    return text.strip()

import requests as req_lib
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124"}

def download_image(url):
    if not url or not url.startswith("http"): return None
    fname = url.split("/")[-1].split("?")[0]
    if not fname or "." not in fname: return None
    ext = fname.rsplit(".", 1)[-1].lower()
    if ext not in ("jpg","jpeg","png","webp","gif","avif"): return None
    local = IMG_DIR / fname
    if local.exists(): return f"/downloads/{fname}"
    try:
        r = req_lib.get(url, headers=HEADERS, timeout=20)
        if r.status_code == 200 and len(r.content) > 500:
            local.write_bytes(r.content)
            return f"/downloads/{fname}"
    except: pass
    return None

def extract_from_page(page, collection):
    """Playwright page'den tum prompt+gorsel ciflerini cek."""
    items = {}

    # 1) img[alt] = prompt (ana yontem - site bunu kullanıyor)
    imgs = page.query_selector_all("img[src*='r2.dev'], img[src*='bananaprompts']")
    for img in imgs:
        try:
            src = img.get_attribute("src") or ""
            alt = img.get_attribute("alt") or ""
            if not src: continue
            prompt = clean(alt)
            if len(prompt) < 30: continue
            h = phash(prompt)
            if h not in items:
                items[h] = {"prompt": prompt, "image_url": src, "collection": collection}
        except: pass

    # 2) data-prompt veya data-text attribute'lari
    for el in page.query_selector_all("[data-prompt], [data-text]"):
        try:
            p = el.get_attribute("data-prompt") or el.get_attribute("data-text") or ""
            if len(p) < 30: continue
            # En yakin img bul
            parent = el.evaluate_handle("el => el.closest('div, article, section, li')")
            img_el = parent.as_element().query_selector("img") if parent.as_element() else None
            img_url = img_el.get_attribute("src") if img_el else ""
            h = phash(p)
            if h not in items:
                items[h] = {"prompt": clean(p), "image_url": img_url or "", "collection": collection}
        except: pass

    # 3) JSON-LD veya window.__data
    scripts = page.query_selector_all("script")
    for sc in scripts:
        try:
            content = sc.inner_text()
            if not content or len(content) < 50: continue
            # Prompt array'leri
            found = re.findall(r'"prompt"\s*:\s*"((?:[^"\\]|\\.){40,2000})"', content)
            imgs_found = re.findall(r'"(?:imageUrl|image_url|img|src)"\s*:\s*"(https?://[^"]+)"', content)
            for i, p in enumerate(found):
                p = p.replace("\\n", "\n").replace('\\"', '"').replace("\\\\", "\\")
                h = phash(p)
                if h not in items:
                    items[h] = {"prompt": p, "image_url": imgs_found[i] if i < len(imgs_found) else "", "collection": collection}
        except: pass

    return list(items.values())

all_new = []

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, args=["--no-sandbox", "--disable-blink-features=AutomationControlled"])
    ctx = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
        viewport={"width": 1920, "height": 1080},
        locale="en-US",
    )
    page = ctx.new_page()
    # Bot tespitini engelle
    page.add_init_script("""
        Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
        window.chrome = {runtime: {}};
    """)

    for url, coll in PAGES_TO_SCRAPE:
        print(f"\n[{coll}] {url}")
        try:
            page.goto(url, wait_until="networkidle", timeout=30000)
        except PWTimeout:
            print("  Timeout - domcontentloaded ile devam")
            try: page.goto(url, wait_until="domcontentloaded", timeout=20000)
            except: print("  Atlandı"); continue

        # Sayfanın tamamen yüklenmesi için bekle
        page.wait_for_timeout(3000)

        # Scroll yaparak lazy-load içerikleri tetikle
        print("  Scroll yapılıyor...")
        prev_count = 0
        for scroll_round in range(15):  # Max 15 scroll
            # Aşağı scroll
            page.evaluate("window.scrollBy(0, window.innerHeight * 2)")
            page.wait_for_timeout(1500)

            # Yeni içerik yüklendi mi?
            imgs = page.query_selector_all("img[src*='r2.dev']")
            count = len(imgs)
            if count > prev_count:
                print(f"    Scroll {scroll_round+1}: {count} gorsel")
                prev_count = count
            else:
                # "Load more" butonu var mı?
                load_more = page.query_selector("button:text('Load More'), button:text('Show More'), [data-testid='load-more'], .load-more")
                if load_more:
                    print(f"    'Load More' butonu tıklanıyor...")
                    load_more.click()
                    page.wait_for_timeout(2000)
                else:
                    print(f"    Scroll bitti, toplam: {count} gorsel")
                    break

        # İçerikleri çek
        items = extract_from_page(page, coll)
        print(f"  {len(items)} kayıt bulundu")

        new_count = 0
        for item in items:
            h = phash(item["prompt"])
            if h in seen: continue
            seen.add(h)
            all_new.append(item)
            new_count += 1
        print(f"  {new_count} yeni benzersiz prompt")

    browser.close()

print(f"\nToplam {len(all_new)} yeni prompt import edilecek")

# DB'ye yaz
import re as re_mod
ok = err = 0
for i, item in enumerate(all_new, 1):
    try:
        p = item["prompt"]; img_url = item.get("image_url",""); coll = item["collection"]
        tmpl = p
        defs = {"SUBJECT":"a person","OUTFIT":"original outfit","POSE":"natural pose","BACKGROUND":"original background"}
        for s in ["a man","a woman","a person","the person","young man","young woman","the subject"]:
            if s.lower() in tmpl.lower():
                tmpl = re_mod.sub(re_mod.escape(s), "[SUBJECT]", tmpl, flags=re_mod.IGNORECASE, count=1)
                defs["SUBJECT"] = s; break
        if "[SUBJECT]" not in tmpl: tmpl = "[SUBJECT], " + tmpl

        lp = download_image(img_url) if img_url else None

        cur.execute("""INSERT INTO PromptTemplate
            (collection, originalPrompt, template, defaults, explanation, imageUrl, localPath, isRefined, isNSFW, createdAt, updatedAt)
            VALUES (?,?,?,?,?,?,?,1,0,datetime('now'),datetime('now'))""",
            (coll, p, tmpl, json.dumps(defs), p[:120]+"...", img_url or None, lp))

        ok += 1
        if i % 25 == 0:
            conn.commit()
            print(f"  {i}/{len(all_new)} yazildi...")
    except Exception as e:
        err += 1

conn.commit(); conn.close()
c2 = sqlite3.connect(DB_PATH).cursor()
c2.execute("SELECT COUNT(*) FROM PromptTemplate")
total = c2.fetchone()[0]
print(f"\nTAMAM: +{ok} eklendi, {err} hata. DB toplam: {total}")

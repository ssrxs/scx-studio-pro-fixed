"""
BananaPrompts Network Interceptor
Tarayıcı içindeki XHR/Fetch isteklerini dinler, API endpoint'i yakalar.
"""
import sys, io, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from playwright.sync_api import sync_playwright

URLS_TO_CHECK = [
    "https://bananaprompts.org/prompts-gallery",
    "https://bananaprompts.org/nano-banana-pro-prompts",
]

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, args=["--no-sandbox"])
    ctx = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124",
        viewport={"width":1920,"height":1080},
    )
    page = ctx.new_page()
    page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined})")

    captured = []

    def handle_request(request):
        url = request.url
        method = request.method
        # API gibi görünen istekler
        if any(x in url for x in ['/api/', 'supabase', 'firebase', 'graphql', 'query', 'prompts', 'fetch']):
            if url != "https://bananaprompts.org/prompts-gallery":
                post_data = ""
                try: post_data = request.post_data or ""
                except: pass
                captured.append({"method": method, "url": url, "body": post_data[:200]})
                print(f"  [REQ {method}] {url[:100]}")

    def handle_response(response):
        url = response.url
        status = response.status
        ct = response.headers.get("content-type","")
        if "json" in ct or "text/x-component" in ct:
            if any(x in url for x in ['/api/', 'supabase', 'graphql', 'prompts', '_next/data']):
                try:
                    body = response.body()
                    print(f"  [RESP {status}] {url[:100]} | {ct[:40]} | {len(body)} bytes")
                    if len(body) < 50000:
                        txt = body.decode('utf-8', errors='replace')
                        print(f"    PREVIEW: {txt[:300]}")
                except: pass

    page.on("request", handle_request)
    page.on("response", handle_response)

    for url in URLS_TO_CHECK:
        print(f"\n=== {url} ===")
        captured.clear()
        try:
            page.goto(url, wait_until="networkidle", timeout=25000)
        except:
            try: page.goto(url, wait_until="domcontentloaded", timeout=15000)
            except: continue
        page.wait_for_timeout(3000)
        # Scroll
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(2000)

    browser.close()

print("\nTum yakalanan istekler:")
for c in captured:
    print(f"  {c['method']} {c['url']}")
    if c['body']: print(f"    BODY: {c['body']}")

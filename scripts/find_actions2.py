import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import requests, re, json

H = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124"}
BASE = "https://bananaprompts.org"

# Bilinen chunk URL'leri (onceki analiz)
CHUNKS = [
    "/_next/static/chunks/app/%5Blocale%5D/nano-banana-pro-prompts/page-0a72c518b8cd9c89.js",
    "/_next/static/chunks/app/%5Blocale%5D/prompts-gallery/page-0a72c518b8cd9c89.js",
    "/_next/static/chunks/2452-81bd41551ac78e2c.js",
    "/_next/static/chunks/1955-a8576a92170e92b4.js",
    "/_next/static/chunks/7552-30c27bc887a70db2.js",
    "/_next/static/chunks/3622-115acd96e815b2ce.js",
    "/_next/static/chunks/9179-38f24d7d55a7fbdd.js",
    "/_next/static/chunks/main-app-627e334d2e3daa8d.js",
]

# Prompts gallery sayfasinin chunk'larini da al
r = requests.get(BASE + "/prompts-gallery", headers=H, timeout=20)
gallery_chunks = re.findall(r'"(/_next/static/chunks/[^"]+\.js)"', r.text)
all_chunks = list(set(CHUNKS + gallery_chunks))

print(f"Toplam {len(all_chunks)} chunk incelenecek")

all_server_refs = {}

for chunk_path in all_chunks:
    url = BASE + chunk_path
    try:
        rc = requests.get(url, headers=H, timeout=15)
        if rc.status_code != 200:
            continue
        text = rc.text
        # createServerReference calls
        refs = re.findall(r'createServerReference\("([a-f0-9]{40})"[^,]*,[^,]*,[^,]*,[^"]*"([^"]+)"', text)
        if refs:
            for r_hash, fn_name in refs:
                all_server_refs[r_hash] = fn_name
                print(f"  FOUND: {fn_name} -> {r_hash}")
    except Exception as e:
        pass

print(f"\nToplam {len(all_server_refs)} server action bulundu:")
for h, name in all_server_refs.items():
    print(f"  {name}: {h}")

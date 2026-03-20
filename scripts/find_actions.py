import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import requests, re, json

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124"}

# ── 1. Tum sayfa JS dosyalarini tara, tum server action hash'lerini bul ───────
pages = [
    ("https://bananaprompts.org/prompts-gallery", "/prompts-gallery"),
    ("https://bananaprompts.org/nano-banana-pro-prompts", "/nano-banana-pro-prompts"),
    ("https://bananaprompts.org/vip-prompts", "/vip-prompts"),
    ("https://bananaprompts.org/trend-prompts", "/trend-prompts"),
]

all_hashes = {}
all_r2 = {}

for page_url, path in pages:
    r = requests.get(page_url, headers=headers, timeout=20)
    # JS chunk'larini bul
    scripts = re.findall(r'"(/_next/static/chunks/[^"]+\.js)"', r.text)
    # R2 gorselleri al
    r2_imgs = re.findall(r'https://pub-[a-z0-9]+\.r2\.dev/[^\s"\'<>]+\.(?:webp|jpg|jpeg|png)', r.text)
    all_r2[path] = r2_imgs
    print(f"\n[{path}] {len(scripts)} chunk, {len(r2_imgs)} R2 gorsel")
    
    # Her chunk'i tara
    for sc in scripts:
        if any(x in sc for x in ['page-', 'layout-', str(abs(hash(path)))[:4]]):
            js_url = "https://bananaprompts.org" + sc
            try:
                rj = requests.get(js_url, headers=headers, timeout=15)
                # Server action hash'leri: 40 karakter hex
                hashes = re.findall(r'"(40[a-f0-9]{38})"', rj.text)
                # Fonksiyon isimleri
                fn_names = re.findall(r'"(get[A-Z][a-zA-Z]+Prompts?[^"]*)"', rj.text)
                if hashes:
                    for h in hashes:
                        all_hashes[h] = {"page": path, "chunk": sc}
                    print(f"  {sc.split('/')[-1]}: {len(hashes)} hash, fns={fn_names[:3]}")
            except:
                pass

print("\n\nTum action hash'leri:")
for h, info in all_hashes.items():
    print(f"  {h} <- {info['page']}")

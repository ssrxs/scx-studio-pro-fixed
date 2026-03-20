import sys, io, requests, re, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
H = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124",
     "Accept": "text/html,application/xhtml+xml,*/*", "Accept-Language": "en-US,en;q=0.9"}
BASE = "https://bananaprompts.org"

# Tum sayfalarin JS'lerinden hash ve fonksiyon isimlerini cek
PAGE_CHUNKS = {
    "/nano-banana-pro-prompts":         "page-0a72c518b8cd9c89.js",
    "/prompts-gallery":                 None,
    "/vip-prompts":                     None,
    "/trend-prompts":                   None,
    "/nano-banana-pro-curated-prompts": None,
}

actions = {}

for path, known_chunk in PAGE_CHUNKS.items():
    page = requests.get(BASE + path, headers=H, timeout=20)
    chunks = re.findall(r'"(/_next/static/chunks/[^"]+\.js)"', page.text)
    if known_chunk:
        targets = [c for c in chunks if known_chunk in c]
    else:
        targets = [c for c in chunks if "page-" in c and "locale" in c]
    targets = (targets or chunks[-5:])  # fallback: son 5 chunk
    
    print(f"\n[{path}] Hedef chunk'lar: {[t.split('/')[-1] for t in targets]}")
    
    for chunk in targets:
        url = BASE + chunk
        rc = requests.get(url, headers=H, timeout=15)
        # Duzeltilmis pattern: createServerReference)("hash"
        refs = re.findall(r'createServerReference\)\("([a-f0-9]{40})"[^,]*,[^,]*,[^,]*,[^"]*"([^"]+)"', rc.text)
        for h, fn in refs:
            actions[h] = {"fn": fn, "page": path, "chunk": chunk.split("/")[-1]}
            print(f"  ACTION: {fn} = {h[:16]}...")

print(f"\n{'='*60}")
print(f"Bulunan {len(actions)} server action:")
for h, info in actions.items():
    print(f"  {info['fn']:40s} {h}")

# Hash'leri kaydet
with open("D:/Projeler/SCX-Studio-Pro/scripts/actions.json", "w") as f:
    json.dump(actions, f, indent=2)

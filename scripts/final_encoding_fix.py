import os

# Specific patterns reported by the user and discovered in logs
fixes = {
    "fotoÄŸraflarÄ±": "fotoğrafları",
    "iÃ§in": "için",
    "fÃ¼tÃ¼ristik": "fütüristik",
    "DoÄŸa": "Doğa",
    "TÃ¼mÃ¼": "Tümü",
    "KÃ¼ratÃ¶rlÃ¼": "Küratörlü",
    "LÃ¼ks": "Lüks",
    "GÃ¶rsel": "Görsel",
    "Ä°ndir": "İndir",
    "Ä°ÅŸleniyor": "İşleniyor",
    "YÃ¼z": "Yüz",
    "RÃ¼ya": "Rüya"
}

def repair_file(path):
    try:
        with open(path, 'rb') as f:
            raw = f.read()
        
        # Try decoding as utf-8 first
        try:
            content = raw.decode('utf-8')
        except:
            content = raw.decode('latin-1') # Fallback if messed up
            
        new_content = content
        for bad, good in fixes.items():
            new_content = new_content.replace(bad, good)
            
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Repaired: {path}")
    except Exception as e:
        print(f"Failed: {path} - {e}")

root = r'D:\Projeler\SCX-Studio-Pro'
for r, d, files in os.walk(root):
    if any(x in r for x in ['node_modules', '.next', '.git']): continue
    for f in files:
        if f.endswith(('.ts', '.tsx', '.json', '.md')):
            repair_file(os.path.join(r, f))

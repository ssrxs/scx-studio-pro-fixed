import sys, io, requests, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
H = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124"}
url = "https://bananaprompts.org/_next/static/chunks/app/%5Blocale%5D/nano-banana-pro-prompts/page-0a72c518b8cd9c89.js"
r = requests.get(url, headers=H, timeout=20)
print("Status:", r.status_code, "Size:", len(r.text))
matches = re.findall(r'createServerReference\("([a-f0-9]{40})"', r.text)
print("Server refs:", matches)
idx = r.text.find("createServerReference")
print("Context:", r.text[idx:idx+200] if idx>-1 else "NOT FOUND")

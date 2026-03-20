import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import requests, re, json

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124"}
r = requests.get("https://bananaprompts.org/nano-banana-pro-prompts", headers=headers)

# Next.js build ID
build_ids = re.findall(r'"buildId":"([^"]+)"', r.text)
print("buildId:", build_ids[:3])

# Try to find API routes
api_calls = re.findall(r'fetch\(["\']([^"\']+)["\']', r.text)
print("fetch calls:", api_calls[:10])

# Find data chunk paths
chunks = re.findall(r'"/_next/static/chunks/([^"]+\.js)"', r.text)
print("JS chunks:", chunks[:5])

# Find any /api/ patterns
apis = re.findall(r'["\'](/api/[^"\'?]+)', r.text)
print("API patterns:", list(set(apis))[:10])

# Find supabase or similar
if "supabase" in r.text.lower():
    supa = re.findall(r'https://[a-z0-9]+\.supabase\.co[^"\']*', r.text)
    print("Supabase:", supa[:3])

# R2 image patterns to understand structure
r2 = re.findall(r'r2\.dev/([^"\']+\.(?:webp|jpg|png))', r.text)
print(f"\nR2 images found: {len(r2)}")
print("Sample R2 paths:", r2[:5])

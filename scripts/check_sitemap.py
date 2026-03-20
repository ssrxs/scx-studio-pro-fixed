import sys,io,requests,re,json,time
sys.stdout=io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8',errors='replace')
H={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124"}

# 1. Sitemap kontrolü
for sitemap_url in ["https://bananaprompts.org/sitemap.xml","https://bananaprompts.org/sitemap_index.xml","https://bananaprompts.org/sitemap-0.xml","https://bananaprompts.org/robots.txt"]:
    r=requests.get(sitemap_url,headers=H,timeout=10)
    print(f"{sitemap_url} -> {r.status_code}")
    if r.status_code==200:
        print(r.text[:800])
        print("---")

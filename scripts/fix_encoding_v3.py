import os

replacements = {
    "Ã¼": "ü", "Ã¶": "ö", "ÄŸ": "ğ", "Ä±": "ı", "ÅŸ": "ş", "Ã§": "ç",
    "Ãœ": "Ü", "Ã–": "Ö", "Ä": "Ğ", "Ä°": "İ", "Å": "Ş", "Ã‡": "Ç",
    "Ä±": "ı", "ÄŸ": "ğ", "Ã¼": "ü", "ÅŸ": "ş", "Ã¶": "ö", "Ã§": "ç",
    "Ä°": "İ", "Ä": "Ğ", "Ãœ": "Ü", "Å": "Ş", "Ã–": "Ö", "Ã‡": "Ç",
    "Ã§": "ç", "ÄŸ": "ğ", "Ä±": "ı", "Ã¶": "ö", "ÅŸ": "ş", "Ã¼": "ü"
}

def fix_file(file_path):
    try:
        with open(file_path, 'rb') as f:
            content = f.read().decode('utf-8', errors='ignore')
        
        new_content = content
        for bad, good in replacements.items():
            new_content = new_content.replace(bad, good)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed: {file_path}")
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")

root_dir = r'D:\Projeler\SCX-Studio-Pro'
for root, dirs, files in os.walk(root_dir):
    if 'node_modules' in dirs:
        dirs.remove('node_modules')
    if '.next' in dirs:
        dirs.remove('.next')
    for file in files:
        if file.endswith(('.ts', '.tsx', '.md', '.json', '.js', '.jsx')):
            fix_file(os.path.join(root, file))

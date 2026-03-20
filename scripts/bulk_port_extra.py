import os
import subprocess
import shutil

ECC_SKILLS_DIR = r'D:\Projeler\everything-claude-code\skills'
GEMINI_SKILLS_WS_DIR = r'D:\Projeler\SCX-Studio-Pro\gemini-skills'
SKILL_CREATOR_DIR = r'C:\Users\yusuf\AppData\Roaming\npm\node_modules\@google\gemini-cli\node_modules\@google\gemini-cli-core\dist\src\skills\builtin\skill-creator'
INIT_SCRIPT = os.path.join(SKILL_CREATOR_DIR, 'scripts', 'init_skill.cjs')
PACKAGE_SCRIPT = os.path.join(SKILL_CREATOR_DIR, 'scripts', 'package_skill.cjs')

SKILLS_TO_PORT = [
    'fal-ai-media', 'video-editing', 'videodb', 'liquid-glass-design', 
    'deep-research', 'market-research', 'iterative-retrieval', 'search-first', 
    'continuous-learning-v2', 'autonomous-loops', 'agentic-engineering'
]

def port_skill(skill_name):
    print(f'--- Porting {skill_name} ---')
    src_skill_md = os.path.join(ECC_SKILLS_DIR, skill_name, 'SKILL.md')
    dest_skill_dir = os.path.join(GEMINI_SKILLS_WS_DIR, f'ecc-{skill_name}')
    if not os.path.exists(src_skill_md): return
    subprocess.run(['node', INIT_SCRIPT, f'ecc-{skill_name}', '--path', GEMINI_SKILLS_WS_DIR], check=True)
    with open(src_skill_md, 'r', encoding='utf-8') as f: content = f.read()
    dest_skill_md_path = os.path.join(dest_skill_dir, 'SKILL.md')
    for d in ['scripts', 'references', 'assets']:
        path = os.path.join(dest_skill_dir, d)
        if os.path.exists(path): shutil.rmtree(path)
    with open(dest_skill_md_path, 'w', encoding='utf-8') as f: f.write(content)
    subprocess.run(['node', PACKAGE_SCRIPT, dest_skill_dir, GEMINI_SKILLS_WS_DIR], check=True)

if __name__ == '__main__':
    for skill in SKILLS_TO_PORT:
        try: port_skill(skill)
        except Exception as e: print(f'Error: {e}')

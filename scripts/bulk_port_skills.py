
import os
import subprocess
import shutil
import yaml

# Path to the ECC kit and Gemini tools
ECC_SKILLS_DIR = r"D:\Projeler\everything-claude-code\skills"
GEMINI_SKILLS_WS_DIR = r"D:\Projeler\SCX-Studio-Pro\gemini-skills"
SKILL_CREATOR_DIR = r"C:\Users\yusuf\AppData\Roaming\npm\node_modules\@google\gemini-cli\node_modules\@google\gemini-cli-core\dist\src\skills\builtin\skill-creator"
INIT_SCRIPT = os.path.join(SKILL_CREATOR_DIR, "scripts", "init_skill.cjs")
PACKAGE_SCRIPT = os.path.join(SKILL_CREATOR_DIR, "scripts", "package_skill.cjs")

# Skills to port
SKILLS_TO_PORT = [
    "api-design",
    "frontend-patterns",
    "backend-patterns",
    "security-review",
    "nextjs-turbopack",
    "prompt-optimizer",
    "mcp-server-patterns",
    "verification-loop",
    "ai-regression-testing",
    "documentation-lookup"
]

def port_skill(skill_name):
    print(f"--- Porting {skill_name} ---")
    
    # Paths
    src_skill_md = os.path.join(ECC_SKILLS_DIR, skill_name, "SKILL.md")
    dest_skill_dir = os.path.join(GEMINI_SKILLS_WS_DIR, f"ecc-{skill_name}")
    
    if not os.path.exists(src_skill_md):
        print(f"Skipping {skill_name}: Source SKILL.md not found.")
        return

    # 1. Initialize Gemini Skill
    subprocess.run(["node", INIT_SCRIPT, f"ecc-{skill_name}", "--path", GEMINI_SKILLS_WS_DIR], check=True)
    
    # 2. Read and Convert ECC SKILL.md
    with open(src_skill_md, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Basic conversion (ECC uses slightly different frontmatter, Gemini needs strictly name/description)
    # Most ECC skills have name/description in frontmatter, so we just clean up.
    
    dest_skill_md_path = os.path.join(dest_skill_dir, "SKILL.md")
    
    # Remove TODO directories created by init_skill to pass validation
    for d in ["scripts", "references", "assets"]:
        path = os.path.join(dest_skill_dir, d)
        if os.path.exists(path):
            shutil.rmtree(path)

    # Write the content
    with open(dest_skill_md_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    # 3. Package
    pkg_cmd = ["node", PACKAGE_SCRIPT, dest_skill_dir, GEMINI_SKILLS_WS_DIR]
    subprocess.run(pkg_cmd, check=True)
    
    # 4. Install (User scope)
    skill_file = os.path.join(GEMINI_SKILLS_WS_DIR, f"ecc-{skill_name}.skill")
    install_cmd = ["gemini", "skills", "install", skill_file, "--scope", "user"]
    # We skip interactive prompt by piping 'y' if needed, but 'gemini' CLI usually handles it if we explain.
    # Note: Subprocess run might hang on 'Do you want to continue? [Y/n]:'
    # For now, we'll just prepare the files and let the user know, or use 'echo y |'
    
    print(f"Successfully prepared: {skill_file}")

if __name__ == "__main__":
    if not os.path.exists(GEMINI_SKILLS_WS_DIR):
        os.makedirs(GEMINI_SKILLS_WS_DIR)
        
    for skill in SKILLS_TO_PORT:
        try:
            port_skill(skill)
        except Exception as e:
            print(f"Error porting {skill}: {e}")

print("\n--- ALL SKILLS PREPARED ---")
print("Run the following command to install all of them (requires 'y' for each):")
print("Get-ChildItem D:\\Projeler\\SCX-Studio-Pro\\gemini-skills\\*.skill | ForEach-Object { gemini skills install $_.FullName --scope user }")

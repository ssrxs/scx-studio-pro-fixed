import os
import glob

def parse_notebook_files(directory):
    print(f"--- Notebook Analysis for: {directory} ---")
    files = glob.glob(os.path.join(directory, "**/*.md"), recursive=True)
    files += glob.glob(os.path.join(directory, "**/*.txt"), recursive=True)
    
    summary = []
    for f in files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            # Basic summarization logic (simulate agent reasoning)
            summary.append({
                "file": os.path.basename(f),
                "chars": len(content),
                "key_terms": content[:100].replace('\n', ' ') # Just for summary overview
            })
            
    return summary

if __name__ == "__main__":
    # Example for current workspace docs
    docs_dir = r"D:\Projeler\SCX-Studio-Pro\docs"
    if os.path.exists(docs_dir):
        report = parse_notebook_files(docs_dir)
        print(f"Found {len(report)} files. Analysis complete.")
        for item in report:
            print(f"- {item['file']} ({item['chars']} chars)")
    else:
        print("Docs directory not found.")

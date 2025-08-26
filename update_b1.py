import os
import re
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate




INDEX_FILE = "scripts/b1.js"
DIR = "bhajans/b1"

def load_index():
    """Extract JS array from scripts/b1.js as Python list of dicts."""
    with open(INDEX_FILE, encoding="utf-8") as f:
        content = f.read()

    # Extract array content between [ and ]
    match = re.search(r"var b1\s*=\s*(\[[\s\S]*?\]);", content)
    if not match:
        raise ValueError("Could not parse b1.js")

    array_text = match.group(1)

    # Convert JS object-like to Python-friendly dicts
    array_text = array_text.replace("'", '"')
    array_text = re.sub(r"(\w+):", r'"\1":', array_text)  # add quotes to keys

    import json5
    entries = json5.loads(array_text)

    return entries, content

def save_index(entries, original_content):
    """Save back JS file with updated entries."""
    import json
    array_text = json.dumps(entries, ensure_ascii=False, indent=4)

    # Convert JSON to JS style (remove quotes from keys)
    array_text = re.sub(r'"(\w+)":', r'\1:', array_text)

    new_content = re.sub(
        r"var b1\s*=\s*\[[\s\S]*?\];",
        f"var b1 = {array_text};",
        original_content
    )

    with open(INDEX_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)

def get_first_line(filepath):
    with open(filepath, encoding="utf-8") as f:
        return f.readline().strip()

def transliterate_text(hindi_text):
    raw = transliterate(hindi_text, sanscript.DEVANAGARI, sanscript.ITRANS).lower()

    # Nasal corrections
    # velars (k, g) → ng
    raw = re.sub(r"m([kg])", r"ng\1", raw)

    # palatals (ch, j) → n
    raw = re.sub(r"m([cj])", r"n\1", raw)

    # dentals/retroflex (t, d) → n
    raw = re.sub(r"m([td])", r"n\1", raw)
    return raw

def main():
    entries, original_content = load_index()
    existing_ids = {e["id"] for e in entries}

    for filename in sorted(os.listdir(DIR)):
        if filename.endswith(".txt"):
            file_id = os.path.splitext(filename)[0]
            if file_id not in existing_ids:
                hin_line = get_first_line(os.path.join(DIR, filename))
                eng_line = transliterate_text(hin_line)
                entries.append({
                    "eng": eng_line,
                    "hin": hin_line,
                    "dir": "b1",
                    "id": file_id,
                    "bk": "",
                    "pg": ""
                })
                print(f"✅ Added entry for {filename}")

    save_index(entries, original_content)

if __name__ == "__main__":
    main()

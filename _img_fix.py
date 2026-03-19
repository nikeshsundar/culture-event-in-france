import json
import re
import unicodedata
from pathlib import Path

p = Path('src/data/events.json')
items = json.loads(p.read_text(encoding='utf-8-sig'))

def slug(s: str) -> str:
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode('ascii')
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", '-', s).strip('-')
    return s or 'france'

for e in items:
    city = slug(str(e.get('city', 'france')))
    category = slug(str(e.get('category', 'culture')))
    season = slug(str(e.get('season', 'travel')))
    # loremflickr returns real photos and lock keeps stable image per event
    e['image'] = f"https://loremflickr.com/1600/900/france,{city},{category},{season}?lock={e.get('id', 0)}"

p.write_text(json.dumps(items, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Updated {len(items)} event images to stable real-photo URLs')

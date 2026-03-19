import json
import urllib.parse
from pathlib import Path

p = Path('src/data/events.json')
data = json.loads(p.read_text(encoding='utf-8-sig'))

candidates = ['cp1252', 'latin1']

def try_fix_once(s: str) -> str:
    for enc in candidates:
        try:
            fixed = s.encode(enc).decode('utf-8')
            # Keep only if it looks improved
            if fixed != s and (fixed.count('Ã') + fixed.count('â') + fixed.count('Å')) < (s.count('Ã') + s.count('â') + s.count('Å')):
                return fixed
        except Exception:
            continue
    return s

def fix_text(s: str) -> str:
    t = s
    for _ in range(3):
        nt = try_fix_once(t)
        if nt == t:
            break
        t = nt
    return t

def walk(v):
    if isinstance(v, dict):
        return {k: walk(fix_text(val) if isinstance(val, str) else val) for k, val in v.items()}
    if isinstance(v, list):
        return [walk(i) for i in v]
    if isinstance(v, str):
        return fix_text(v)
    return v

fixed = walk(data)
for event in fixed:
    terms = [event.get('name', ''), event.get('city', ''), 'France', event.get('category', ''), event.get('season', '')]
    query = ' '.join(t for t in terms if t).strip()
    encoded = urllib.parse.quote_plus(query)
    event['image'] = f"https://source.unsplash.com/1600x900/?{encoded}&sig={event.get('id', 0)}"

p.write_text(json.dumps(fixed, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f"Cleaned text and refreshed image links for {len(fixed)} events")

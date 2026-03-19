import json
import re
import unicodedata
from pathlib import Path

p = Path('src/data/events.json')
data = json.loads(p.read_text(encoding='utf-8-sig'))

BAD = ['Ã', 'â', 'Å', 'Â', '�']

def score(s: str) -> int:
    return sum(s.count(ch) for ch in BAD)

def repair_once(s: str) -> str:
    best = s
    best_score = score(s)
    for enc in ('cp1252', 'latin1'):
        try:
            cand = s.encode(enc).decode('utf-8')
            cand_score = score(cand)
            if cand_score < best_score:
                best = cand
                best_score = cand_score
        except Exception:
            pass
    return best

def fix_text(s: str) -> str:
    t = s
    for _ in range(4):
        nt = repair_once(t)
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

def slug(s: str) -> str:
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode('ascii')
    s = s.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s or 'event'

fixed = walk(data)
for e in fixed:
    seed = slug(f"{e.get('id','')}-{e.get('name','')}-{e.get('city','')}")
    e['image'] = f"https://picsum.photos/seed/{seed}/1600/900"

p.write_text(json.dumps(fixed, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f"Final repair done for {len(fixed)} events")

import json

with open('src/data/planets.json', 'r') as f:
    data = json.load(f)

# Pool of 24 beautiful actual space/planet imagery IDs from Unsplash
unsplash_ids = [
    "1614730321146-b6fa6a46bcb4", # Earth/Greenish
    "1614728263952-84ea75646736", # Mars/Red
    "1462331940025-496dfbfc7564", # Nebula/Purple
    "1451187580459-43490279c0fa", # Deep space blue
    "1610296669228-602fa0e27d67", # Golden/Sun
    "1543722530-d2c3119eb4fc",    # Blue glow ring
    "1596324121712-5ebcd48671cc", # Dark void
    "1537420327963-4acdf26330ce", # Deep cyan
    "1504333633858-a82f8011c750", # Volcanic glowing
    "1543722530-d2c3119eb4fc",    # Ice/Blue
    "1516331165147-38e4a90099ab", # Aurora space
    "1614730321146-b6fa6a46bcb4", 
    "1501862700950-18382cb91421", # Star cluster
    "1464802686167-b939a6910659", # Orange deep dive
    "1502481851512-e9e2529bfbf9", # Andromeda swirl
    "1454789476662-53eb23ba5907", # Purple galaxy
    "1465101162946-4377e57745c3", # White dwarf
    "1446776811953-b23d57bd21aa", # Supernova core
    "1462331940025-496dfbfc7564", 
    "1445905595283-214c480cad43", # Blue giant
    "1534447677768-be436bb09401", # Ringed beauty
    "1519750157634-b6d493a0cecc", 
    "1419242902214-272b3f66ed7a", # Dark moon
    "1436891620584-47fd0e565afb"  # Abstract galaxy
]

for i, p in enumerate(data['planets']):
    # Safely assign image or default if we run out
    img_id = unsplash_ids[i] if i < len(unsplash_ids) else unsplash_ids[0]
    p['image'] = f"https://images.unsplash.com/photo-{img_id}?q=80&w=1000&auto=format&fit=crop"

with open('src/data/planets.json', 'w') as f:
    json.dump(data, f, indent=2)

import json
import random

with open('src/data/planets.json', 'r') as f:
    data = json.load(f)

# Data pools
species = ['Humans', 'Zorgons', 'Silicon-Synths', 'Plasma Entities', 'Arachnoids']
time_ratios = ['1 day here = 3 days on Earth', '1 day here = 7 Earth Years', 'Time flows normally (1:1)', '1 hour here = 2 Earth days', 'Time is dilated 0.4x']
reviews_pool = [
    'The methane lakes were exquisite. 5 stars.',
    'Barely survived the gravity crush. Never again.',
    'Perfect vacation spot for silicon based lifeforms.',
    'Absolutely mind-bending views of the nebula.',
    'Hostile locals. Got shot at. 1 star.',
    'Deep space isolation at its finest. Highly recommend.',
    'Too much radiation for my carbon skin. Great if you wear a lead suit.',
    'A majestic world. Traced the ice canyons all day.'
]

def hash_str(s):
    return sum(ord(c) for c in s)

for i, p in enumerate(data['planets']):
    # Seed random for consistency based on planet id
    random.seed(hash_str(p['id']))
    
    # Planet Risk Index
    rad = random.randint(10, 95)
    grav = random.randint(10, 95)
    storm = random.randint(10, 95)
    hostile = random.randint(10, 95)
    overall_risk = int((rad+grav+storm+hostile)/4)
    
    p['risks'] = {
        'Radiation': rad,
        'Gravity': grav,
        'Storms': storm,
        'Alien Hostility': hostile,
        'Overall': overall_risk
    }
    
    # Compatibility
    spec1, spec2 = random.sample(species, 2)
    p['compatibility'] = {
        spec1: random.randint(10, 40),
        spec2: random.randint(70, 99)
    }
    
    # Time Dilation
    p['timeDilation'] = random.choice(time_ratios)
    
    # Lore
    p['lore'] = f"Discovered in the early {random.randint(2100, 2300)}s, {p['name']} remains one of the most enigmatic locations in the {p['galaxy']} sector. Deep scans point towards ancient ruins buried beneath the surface, heavily guarded by the planet's intense native climate."
    
    # Reviews
    num_revs = random.randint(1, 3)
    revs = []
    for _ in range(num_revs):
        revs.append({
            'user': random.choice(['Zorblax', 'Cmdr. Shepard', 'Kael', 'Xylar-9', 'Anonymous']),
            'species': random.choice(species),
            'rating': random.randint(1, 5),
            'comment': random.choice(reviews_pool)
        })
    p['communityReviews'] = revs

with open('src/data/planets.json', 'w') as f:
    json.dump(data, f, indent=2)

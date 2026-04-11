import json
import os
import urllib.request

secure_images = [
    "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/0/00/Crab_Nebula.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/6/68/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/54/Europa-moon.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/90/Titan_in_true_color.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/e/ef/Pluto_in_True_Color_-_High-Res.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/7/76/Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29_%28cropped%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/b/b1/NGC7293_%282004%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/1/14/Ring_Nebula_%28M57%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/db/Messier51_sRGB.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/5e/M104_ngc4594_Sombrero_Galaxy_hi-res.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/a/ab/Carina_Nebula_by_Webb_Telescope_%28high_res%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/9e/Stephans_Quintet_Webb_%28cropped%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/d7/Hubble_Ultra_Deep_Field_part_d.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tarantula_Nebula_TRAPPIST_color.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/6/68/Horsehead_Nebula-1.jpg"
]

public_dir = os.path.join('public', 'planets')
os.makedirs(public_dir, exist_ok=True)

with open('src/data/planets.json', 'r') as f:
    data = json.load(f)

req_headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

for i, p in enumerate(data['planets']):
    img_url = secure_images[i] if i < len(secure_images) else secure_images[0]
    local_filename = f"{p['id']}.jpg"
    local_path = os.path.join(public_dir, local_filename)
    
    # Download the image if it doesn't exist
    if not os.path.exists(local_path):
        try:
            req = urllib.request.Request(img_url, headers=req_headers)
            with urllib.request.urlopen(req) as response, open(local_path, 'wb') as out_file:
                out_file.write(response.read())
            print(f"Downloaded {local_filename}")
        except Exception as e:
            print(f"Failed to download {img_url}: {e}")
    
    p['image'] = f"/planets/{local_filename}"

with open('src/data/planets.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Finished updating JSON with local paths!")

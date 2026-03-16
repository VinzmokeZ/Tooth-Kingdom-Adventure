from PIL import Image
import os

files = [
    "src/assets/brushing_basics.png",
    "src/assets/chapter6.png"
]

for f in files:
    if os.path.exists(f):
        with Image.open(f) as img:
            print(f"{f}: {img.width}x{img.height}")
    else:
        print(f"{f}: Not Found")

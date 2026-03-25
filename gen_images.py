import os
from PIL import Image, ImageFilter, ImageDraw

dir_path = r'C:\Users\Vinz\Downloads\Internship Project - 1\Product Design and Development\Playstore Images'

def add_corners(im, rad):
    circle = Image.new('L', (rad * 2, rad * 2), 0)
    draw = ImageDraw.Draw(circle)
    draw.ellipse((0, 0, rad * 2 - 1, rad * 2 - 1), fill=255)
    alpha = Image.new('L', im.size, 255)
    w, h = im.size
    alpha.paste(circle.crop((0, 0, rad, rad)), (0, 0))
    alpha.paste(circle.crop((0, rad, rad, rad * 2)), (0, h - rad))
    alpha.paste(circle.crop((rad, 0, rad * 2, rad)), (w - rad, 0))
    alpha.paste(circle.crop((rad, rad, rad * 2, rad * 2)), (w - rad, h - rad))
    im.putalpha(alpha)
    return im

for i in range(1, 6):
    sample_path = os.path.join(dir_path, f'sample{i}.png')
    input_path = os.path.join(dir_path, str(i))
    out_path = os.path.join(dir_path, f'output_{i}.png')
    
    print(f"Processing {i}...")
    
    if not os.path.exists(sample_path) or not os.path.exists(input_path):
        print(f"Missing files for {i}")
        continue
        
    sample = Image.open(sample_path)
    target_size = sample.size
    
    img = Image.open(input_path).convert("RGBA")
    
    bg_ratio = max(target_size[0] / img.width, target_size[1] / img.height)
    bg_size = (int(img.width * bg_ratio), int(img.height * bg_ratio))
    bg = img.resize(bg_size, Image.Resampling.LANCZOS)
    
    left = (bg.width - target_size[0]) / 2
    top = (bg.height - target_size[1]) / 2
    right = (bg.width + target_size[0]) / 2
    bottom = (bg.height + target_size[1]) / 2
    bg = bg.crop((left, top, right, bottom))
    
    bg = bg.filter(ImageFilter.GaussianBlur(radius=50))
    
    padding_y = target_size[1] * 0.15
    fg_height = target_size[1] - 2 * padding_y
    fg_ratio = fg_height / img.height
    fg_width = img.width * fg_ratio
    
    fg = img.resize((int(fg_width), int(fg_height)), Image.Resampling.LANCZOS)
    
    fg = add_corners(fg, int(fg.width * 0.05))
    
    x = int((target_size[0] - fg.width) / 2)
    y = int((target_size[1] - fg.height) / 2)
    
    bg.paste(fg, (x, y), fg)
    bg.convert("RGB").save(out_path)
    print(f"Saved {out_path}")

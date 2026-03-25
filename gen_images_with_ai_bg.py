import os
from PIL import Image, ImageFilter, ImageDraw

# Input paths
playstore_dir = r'C:\Users\Vinz\Downloads\Internship Project - 1\Product Design and Development\Playstore Images'
bg_paths = [
    r'C:\Users\Vinz\.gemini\antigravity\brain\7be8293c-b219-4a3e-b72d-e57be1f070cb\bg_1_1774426597711.png',
    r'C:\Users\Vinz\.gemini\antigravity\brain\7be8293c-b219-4a3e-b72d-e57be1f070cb\bg_2_1774426618317.png',
    r'C:\Users\Vinz\.gemini\antigravity\brain\7be8293c-b219-4a3e-b72d-e57be1f070cb\bg_3_1774426639012.png',
    r'C:\Users\Vinz\.gemini\antigravity\brain\7be8293c-b219-4a3e-b72d-e57be1f070cb\bg_4_1774426660502.png',
    r'C:\Users\Vinz\.gemini\antigravity\brain\7be8293c-b219-4a3e-b72d-e57be1f070cb\bg_5_1774426680459.png'
]

# Character sides: 1=Left, 2=Right, 3=Left, 4=Right, 5=Left
# If character is on Left, screen goes to Right
screen_positions = ['right', 'left', 'right', 'left', 'right']

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

def add_shadow(im, shadow_color=(0,0,0,150), blur_radius=20, offset=(0,10)):
    shadow = Image.new('RGBA', (im.width + blur_radius * 4, im.height + blur_radius * 4), (0,0,0,0))
    shadow_draw = ImageDraw.Draw(shadow)
    
    rect_x1 = blur_radius * 2 + offset[0]
    rect_y1 = blur_radius * 2 + offset[1]
    rect_x2 = rect_x1 + im.width
    rect_y2 = rect_y1 + im.height
    
    shadow_draw.rectangle([rect_x1, rect_y1, rect_x2, rect_y2], fill=shadow_color)
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur_radius))
    
    final_img = Image.new('RGBA', shadow.size, (0,0,0,0))
    final_img.paste(shadow, (0,0), shadow)
    
    final_img.paste(im, (blur_radius * 2, blur_radius * 2), im)
    return final_img

target_size = (1920, 1080)

for i in range(1, 6):
    print(f"Processing image {i}...")
    bg_path = bg_paths[i-1]
    input_path = os.path.join(playstore_dir, str(i))
    out_path = os.path.join(playstore_dir, f'final_playstore_{i}.png')
    
    if not os.path.exists(bg_path) or not os.path.exists(input_path):
        print(f"Missing {bg_path} or {input_path}")
        continue
        
    # Process BG
    bg = Image.open(bg_path).convert("RGBA")
    
    # Scale BG to fill 1920x1080
    bg_ratio = max(target_size[0] / bg.width, target_size[1] / bg.height)
    bg_size_new = (int(bg.width * bg_ratio), int(bg.height * bg_ratio))
    bg = bg.resize(bg_size_new, Image.Resampling.LANCZOS)
    
    # Crop center
    left = (bg.width - target_size[0]) // 2
    top = (bg.height - target_size[1]) // 2
    bg = bg.crop((left, top, left + target_size[0], top + target_size[1]))
    
    # Process FG screen
    img = Image.open(input_path).convert("RGBA")
    
    # Screen height should be 85% of target height
    padding_y = target_size[1] * 0.075
    fg_height = target_size[1] - 2 * padding_y
    fg_ratio = fg_height / img.height
    fg_width = img.width * fg_ratio
    
    fg = img.resize((int(fg_width), int(fg_height)), Image.Resampling.LANCZOS)
    
    # Add corners and shadow
    fg = add_corners(fg, int(fg.width * 0.05))
    fg_with_shadow = add_shadow(fg, blur_radius=30, offset=(0, 20))
    
    # Position fg
    pos = screen_positions[i-1]
    y = int((target_size[1] - fg_with_shadow.height) / 2)
    
    # Leave 10% margin on the edge
    margin_x = target_size[0] * 0.05
    if pos == 'right':
        x = int(target_size[0] - fg_with_shadow.width - margin_x)
    else:
        x = int(margin_x)
        
    bg.paste(fg_with_shadow, (x, y), fg_with_shadow)
    bg.convert("RGB").save(out_path)
    print(f"Saved {out_path}")

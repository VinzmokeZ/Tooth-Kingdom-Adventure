import os
from PIL import Image, ImageFilter, ImageDraw, ImageFont

# Input paths
playstore_dir = r'C:\Users\Vinz\Downloads\Internship Project - 1\Product Design and Development\Playstore Images'
bg_paths = [
    r'C:\Users\Vinz\.gemini\antigravity\brain\7be8293c-b219-4a3e-b72d-e57be1f070cb\bg_home_1774427157325.png',
    r'C:\Users\Vinz\.gemini\antigravity\brain\7be8293c-b219-4a3e-b72d-e57be1f070cb\bg_hero_1774427177739.png',
    r'C:\Users\Vinz\.gemini\antigravity\brain\7be8293c-b219-4a3e-b72d-e57be1f070cb\bg_chapters_1774427200308.png',
    r'C:\Users\Vinz\.gemini\antigravity\brain\7be8293c-b219-4a3e-b72d-e57be1f070cb\bg_game_1774427220107.png',
    r'C:\Users\Vinz\.gemini\antigravity\brain\7be8293c-b219-4a3e-b72d-e57be1f070cb\bg_tanu_1774427237026.png'
]

screens = [
    {"text": "YOUR TOOTH KINGDOM", "pos": "right"},
    {"text": "CHOOSE YOUR HERO", "pos": "left"},
    {"text": "EXPLORE CHAPTERS", "pos": "right"},
    {"text": "PLAY MINI-GAMES", "pos": "left"},
    {"text": "MEET TANU!", "pos": "right"}
]

font_path = r"C:\Windows\Fonts\impact.ttf"

def add_sticker_border(im, border_width=10, rad=25):
    # Add rounded corners and white sticker border
    w, h = im.size
    
    # Rounded corners mask
    circle = Image.new('L', (rad * 2, rad * 2), 0)
    draw = ImageDraw.Draw(circle)
    draw.ellipse((0, 0, rad * 2 - 1, rad * 2 - 1), fill=255)
    
    alpha = Image.new('L', im.size, 255)
    alpha.paste(circle.crop((0, 0, rad, rad)), (0, 0))
    alpha.paste(circle.crop((0, rad, rad, rad * 2)), (0, h - rad))
    alpha.paste(circle.crop((rad, 0, rad * 2, rad)), (w - rad, 0))
    alpha.paste(circle.crop((rad, rad, rad * 2, rad * 2)), (w - rad, h - rad))
    im.putalpha(alpha)
    
    # Outer white border (larger radius)
    outer_rad = rad + border_width
    outer_w, outer_h = w + border_width*2, h + border_width*2
    bordered = Image.new('RGBA', (outer_w, outer_h), (0,0,0,0))
    
    b_circle = Image.new('L', (outer_rad * 2, outer_rad * 2), 0)
    b_draw = ImageDraw.Draw(b_circle)
    b_draw.ellipse((0, 0, outer_rad * 2 - 1, outer_rad * 2 - 1), fill=255)
    b_alpha = Image.new('L', (outer_w, outer_h), 255)
    b_alpha.paste(b_circle.crop((0, 0, outer_rad, outer_rad)), (0, 0))
    b_alpha.paste(b_circle.crop((0, outer_rad, outer_rad, outer_rad * 2)), (0, outer_h - outer_rad))
    b_alpha.paste(b_circle.crop((outer_rad, 0, outer_rad * 2, outer_rad)), (outer_w - outer_rad, 0))
    b_alpha.paste(b_circle.crop((outer_rad, outer_rad, outer_rad * 2, outer_rad * 2)), (outer_w - outer_rad, outer_h - outer_rad))
    
    white_bg = Image.new('RGBA', (outer_w, outer_h), (255,255,255,255))
    white_bg.putalpha(b_alpha)
    
    # Paste image into white bg
    white_bg.paste(im, (border_width, border_width), im)
    return white_bg

def add_shadow(im, shadow_color=(0,0,0,100), blur_radius=15, offset=(0,10)):
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

def draw_cool_text(draw, text, pos_x, pos_y, font, fill_color=(255, 255, 255), outline_color=(155, 39, 176), stroke_width=6):
    # Shadow text
    shadow_offset = 6
    shadow_color = (74, 20, 140, 200) # dark purple
    draw.text((pos_x+shadow_offset, pos_y+shadow_offset), text, font=font, fill=shadow_color, stroke_width=stroke_width, stroke_fill=shadow_color)
    # Outline & Text
    draw.text((pos_x, pos_y), text, font=font, fill=fill_color, stroke_width=stroke_width, stroke_fill=outline_color)

# 1280x720 handles 1024x1024 generated input without much pixelation. Less upscale.
target_size = (1280, 720)

for i in range(1, 6):
    print(f"Processing image {i}...")
    bg_path = bg_paths[i-1]
    input_path = os.path.join(playstore_dir, str(i))
    out_path = os.path.join(playstore_dir, f'chibi_playstore_{i}.png')
    
    if not os.path.exists(bg_path) or not os.path.exists(input_path):
        print(f"Missing {bg_path} or {input_path}")
        continue
        
    bg = Image.open(bg_path).convert("RGBA")
    
    # Scale BG to fill 1280x720
    bg_ratio = max(target_size[0] / bg.width, target_size[1] / bg.height)
    bg_size_new = (int(bg.width * bg_ratio), int(bg.height * bg_ratio))
    bg = bg.resize(bg_size_new, Image.Resampling.LANCZOS)
    
    # Crop center
    left = (bg.width - target_size[0]) // 2
    top = (bg.height - target_size[1]) // 2
    bg = bg.crop((left, top, left + target_size[0], top + target_size[1]))
    
    # Very slight sharpen to negate blur from resizing
    bg = bg.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
    
    # Process FG screen
    img = Image.open(input_path).convert("RGBA")
    
    # Screen height 75% of target height (so there is room for text)
    padding_y = target_size[1] * 0.125
    fg_height = target_size[1] - 2 * padding_y
    fg_ratio = fg_height / img.height
    fg_width = img.width * fg_ratio
    
    fg = img.resize((int(fg_width), int(fg_height)), Image.Resampling.LANCZOS)
    
    # Apply sticker border and shadow
    fg_bordered = add_sticker_border(fg, border_width=10, rad=25)
    fg_with_shadow = add_shadow(fg_bordered, blur_radius=15, offset=(0, 15))
    
    # Info for this screen
    info = screens[i-1]
    pos = info['pos']
    text = info['text']
    
    # Setup coordinates
    margin_x = target_size[0] * 0.08
    
    if pos == 'right':
        screen_x = int(target_size[0] - fg_with_shadow.width - margin_x)
    else:
        screen_x = int(margin_x)
        
    screen_y = int(target_size[1] * 0.18) # lower it a bit for text at top
    
    # Paste screen
    bg.paste(fg_with_shadow, (screen_x, screen_y), fg_with_shadow)
    
    # Draw Text
    draw = ImageDraw.Draw(bg)
    font_size = 55
    font = ImageFont.truetype(font_path, font_size)
    text_bbox = draw.textbbox((0,0), text, font=font)
    text_w = text_bbox[2] - text_bbox[0]
    
    # Center text above the screen
    text_x = screen_x + (fg_with_shadow.width - text_w) // 2
    text_y = int(target_size[1] * 0.05)
    
    draw_cool_text(draw, text, text_x, text_y, font, fill_color=(255, 255, 255), outline_color=(155, 39, 176), stroke_width=6)
    
    bg.convert("RGB").save(out_path)
    print(f"Saved {out_path}")

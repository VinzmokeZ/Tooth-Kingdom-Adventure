import os
import sys

# Try to import gTTS, if not installed, tell the user how to get it
try:
    from gtts import gTTS
except ImportError:
    print("\n[!] You need the 'gtts' library. Running: pip install gTTS")
    os.system(sys.executable + " -m pip install gTTS")
    from gtts import gTTS

# Define Tanu's Voice Lines
voice_lines = {
    "hello.mp3": "Hello there! I'm Guide Tanu, your Royal Guide to the Tooth Kingdom! I'm here to help you keep your smile shining like a Diamond!",
    "brush_guide.mp3": "Master the circular motion! Brush in small, gentle circles for two whole minutes. It's like a royal dance for your teeth!",
    "pain_help.mp3": "A royal toothache! Make sure to tell your parents right away so they can call the Tooth Kingdom dentist for a check-up!",
    "sugar_bugs.mp3": "Those sneaky Sugar Bugs love sweet treats! Always give your teeth a good royal brushing after eating candy!"
}

# Where to save them
save_path = "../../public/sounds/tanu"

# Create folder if it somehow doesn't exist
if not os.path.exists(save_path):
    os.makedirs(save_path)

print(f"--- Generating Tanu's Voices in {save_path} ---")

for filename, text in voice_lines.items():
    full_path = os.path.join(save_path, filename)
    print(f"Generating {filename}...")
    
    # Generate the speech (English UK for a royal feel)
    tts = gTTS(text=text, lang='en', tld='co.uk')
    tts.save(full_path)

print("\n[✅] Success! All voices generated. Now run your Android Sync!")

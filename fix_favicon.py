from PIL import Image
import os

img = Image.open('app/favicon.ico').convert('RGBA')
img = img.resize((64, 64), Image.Resampling.LANCZOS)
data = img.getdata()
new_data = []

for item in data:
    avg = (item[0] + item[1] + item[2]) / 3
    if avg < 100: # dark pixels -> transparent
        new_data.append((0, 0, 0, 0))
    else: # bright pixels -> Cyan
        # Use the brightness as the alpha channel for smooth anti-aliasing
        new_data.append((6, 182, 212, int(avg)))

img.putdata(new_data)
img.save('app/favicon.ico', format='ICO')
img.save('public/fevico.ico', format='ICO')

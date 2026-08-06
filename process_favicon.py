from PIL import Image
import os

img_path = 'public/cyber-core.png'
if not os.path.exists(img_path):
    img_path = 'public/fevico.ico'

img = Image.open(img_path).convert('RGBA')
data = img.getdata()
new_data = []

for item in data:
    avg = (item[0] + item[1] + item[2]) / 3
    if avg > 200: # Make white background transparent
        new_data.append((255, 255, 255, 0))
    else: # Make black lines Cyan (6, 182, 212)
        new_data.append((6, 182, 212, item[3]))

img.putdata(new_data)
# Create a 64x64 icon
img_resized = img.resize((64, 64), Image.Resampling.LANCZOS)
img_resized.save('app/favicon.ico', format='ICO')
img_resized.save('public/fevico.ico', format='ICO')
print('Favicon generated successfully!')

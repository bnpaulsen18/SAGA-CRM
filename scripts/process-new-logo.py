from PIL import Image
import numpy as np

# Load the new logo
img = Image.open('public/SAGA_Logo_new.png').convert('RGBA')
data = np.array(img)

# Get RGB channels
r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]

# Remove WHITE/LIGHT backgrounds
# Target pixels that are very light (close to white)
is_light = (r > 240) & (g > 240) & (b > 240)

# Make light background transparent
a[is_light] = 0

# Also remove light gray backgrounds
light_gray = (r > 220) & (g > 220) & (b > 220)
a[light_gray] = 0

# Apply the alpha channel
data[:, :, 3] = a

# Create new image with transparency
result = Image.fromarray(data, 'RGBA')

# Save the transparent version
result.save('public/SAGA_Logo_clean.png', 'PNG')

print("Clean transparent logo created: public/SAGA_Logo_clean.png")
print(f"Original size: {img.size}")

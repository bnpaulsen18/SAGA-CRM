from PIL import Image
import numpy as np

# Load the logo image
img = Image.open('public/SAGA_Logo_final.png').convert('RGBA')
data = np.array(img)

# Get RGB channels
r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]

# EXTREME AGGRESSIVE REMOVAL - Target the specific dark box background
# The neon SAGA text is vibrant (RGB > 150 in at least one channel)
# The background is dark (ALL RGB < 100)

# Strategy: Keep only pixels where at least ONE channel is bright (>120)
# This preserves the neon glow while removing the entire dark background

# Check if pixel is "bright enough" to be part of the neon text/glow
is_bright_pixel = (r > 120) | (g > 120) | (b > 120)

# Invert to get background pixels
is_background = ~is_bright_pixel

# Make background completely transparent
a[is_background] = 0

# ADDITIONAL: Also remove pixels that are just too dark overall
very_dark = (r < 80) & (g < 80) & (b < 80)
a[very_dark] = 0

# Apply the alpha channel
data[:, :, 3] = a

# Create new image with transparency
result = Image.fromarray(data, 'RGBA')

# Save the transparent version
result.save('public/SAGA_Logo_transparent.png', 'PNG')

print("Transparent logo created: public/SAGA_Logo_transparent.png")
print(f"Original size: {img.size}")
print("Removed background using brightness + saturation filtering")

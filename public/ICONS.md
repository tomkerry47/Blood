# PWA Icons

The app needs PNG icons for the Progressive Web App functionality. The `icon.svg` file is included as a starting point.

## Creating PNG Icons

You need to create two PNG files from the SVG:

1. **icon-192.png** - 192x192 pixels
2. **icon-512.png** - 512x512 pixels

### Option 1: Online Converter
1. Go to https://cloudconvert.com/svg-to-png
2. Upload `public/icon.svg`
3. Set output size to 192x192
4. Download as `icon-192.png`
5. Repeat for 512x512 and save as `icon-512.png`
6. Place both files in the `public/` directory

### Option 2: Using ImageMagick (if installed)
```bash
# Install ImageMagick first (macOS)
brew install imagemagick

# Convert SVG to PNG
convert -background none -resize 192x192 public/icon.svg public/icon-192.png
convert -background none -resize 512x512 public/icon.svg public/icon-512.png
```

### Option 3: Using Figma/Sketch/Adobe Illustrator
1. Open `public/icon.svg` in your design tool
2. Export as PNG at 192x192px → save as `icon-192.png`
3. Export as PNG at 512x512px → save as `icon-512.png`
4. Place both in the `public/` directory

### Option 4: Customize the Icon
Feel free to create your own icon design! Just make sure:
- It's square (same width and height)
- It looks good at small sizes (192px)
- It represents the app (health/medical theme)
- You create both 192x192 and 512x512 versions

## Temporary Solution

Until you create the PNG icons, the app will still work, but:
- iOS won't show a custom icon when added to home screen
- Android won't display the icon properly in the app drawer
- The PWA install prompt will use a generic icon

The app will function perfectly fine without these icons, but they make it look more professional!

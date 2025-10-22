# 📦 Chrome Extension Installation

## Prerequisites

- Google Chrome Browser (Version 88+)
- File System Access API Support (Chrome 86+)

## Installation

1. **Enable Chrome Developer Mode**

   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)

2. **Load Extension**

   - Click "Load unpacked extension"
   - Select the `src/` folder (not the root folder!)
   - The extension should now appear in the list

3. **Setup Extension**
   - Click on the extension icon in the Chrome toolbar
   - Click on "⚙️ Settings"
   - Choose a target folder for screenshots
   - Confirm folder permission

## Usage

1. **Start Capture**

   - Click on the extension icon
   - Click on "🚀 Start Capture"
   - The extension now monitors DOM changes

2. **Automatic Screenshots**

   - Screenshots are automatically created on visible changes
   - Each screenshot gets a unique UUID4
   - PNG + JSON files are saved in the chosen folder

3. **Stop Capture**
   - Click on the extension icon
   - Click on "⏹️ Stop Capture"

## File Formats

- **PNG**: Viewport screenshot
- **JSON**: Metadata with URL, timestamp, visible text and HTML

## Troubleshooting

- **"No target folder chosen"**: First choose a folder in settings
- **File System Access API error**: Make sure Chrome is up to date
- **No screenshots**: Check if the tab is active and visible changes are present

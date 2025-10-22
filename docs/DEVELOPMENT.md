# 🛠️ Development Guide

## Project Structure

```
facebook_screenshots/
├── src/                    # Chrome Extension (main folder)
│   ├── manifest.json      # Extension Manifest V3
│   ├── popup.html         # Popup Interface
│   ├── popup.js           # Popup JavaScript
│   ├── options.html       # Settings page
│   ├── options.js         # Settings logic
│   ├── background.js      # Service Worker
│   └── content.js         # Content Script
├── README.md              # Project description
|-- docs/
│   ├── INSTALLATION.md        # Installation guide
│   ├── DEVELOPMENT.md        # This file
│   ├── QUICK_START.md
├── package.json           # NPM configuration
└── .gitignore             # Git Ignore
```

## Development

### Local Development

1. **Load Extension**

   ```bash
   # Open Chrome
   chrome://extensions/

   # Enable "Developer mode"
   # Click "Load unpacked extension"
   # Select the `src/` folder
   ```

2. **Test Changes**
   - Changes in `src/` are automatically detected
   - Click "Reload" in the extension list
   - Test the functionality

### Debugging

- **Popup**: Right-click on extension icon → "Inspect popup"
- **Background Script**: Extension page → "Service Worker" → "Inspect"
- **Content Script**: Tab → F12 → Console
- **Options**: Options page → F12 → Console

### Build & Package

```bash
# Package extension as ZIP
npm run package

# Clean extension
npm run clean
```

## Technical Details

### Manifest V3 Features

- **Service Worker**: `background.js` runs as Service Worker
- **File System Access API**: For folder selection and file storage
- **Content Scripts**: Automatic injection into all tabs
- **Storage API**: For settings and status

### Permissions

```json
{
  "permissions": ["activeTab", "scripting", "storage", "downloads", "tabs"],
  "host_permissions": ["<all_urls>"]
}
```

### API Usage

- **chrome.tabs.captureVisibleTab()**: Screenshot creation
- **chrome.storage.local**: Save settings
- **chrome.scripting.executeScript()**: Content Script activation
- **File System Access API**: Folder selection and file storage

## Code Structure

### Background Script (`background.js`)

- Message handler for popup communication
- Screenshot capture and file storage
- Content Script activation/deactivation

### Content Script (`content.js`)

- DOM change detection (MutationObserver)
- Scroll/Resize event handling
- Visibility checking
- Text/HTML extraction

### Popup (`popup.html/js`)

- Start/Stop interface
- Status display
- Settings link

### Options (`options.html/js`)

- Folder selection with File System Access API
- Directory handle storage
- User-friendly UI

## Testing

### Function Tests

1. **Test folder selection**

   - Open options page
   - Select folder
   - Confirm permission

2. **Test screenshot capture**

   - Start capture
   - Simulate DOM changes (Scroll, Resize, Content changes)
   - Check screenshots in chosen folder

3. **Check metadata**
   - Open JSON files
   - Verify data completeness
   - Validate UUID4 format

### Browser Compatibility

- **Chrome 88+**: Full support
- **File System Access API**: Chrome 86+
- **Manifest V3**: Chrome 88+

## Deployment

### Chrome Web Store (Optional)

1. **Package extension**

   ```bash
   npm run package
   ```

2. **Chrome Web Store Developer Dashboard**
   - Upload ZIP file
   - Fill in metadata
   - Go through review process

### Local Distribution

- Share `src/` folder
- Include installation guide
- README.md for users

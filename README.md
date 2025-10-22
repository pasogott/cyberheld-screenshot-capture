# 📸 DOM Change Screenshot Capture

A Chrome Extension that automatically creates screenshots when visible DOM changes occur.

## 🎯 Goal

For **visible changes** in the **active tab**, automatically:

1. **Screenshot** as **PNG**
2. **Metadata** as **JSON**
   Both files share the same **UUID4 basename** (e.g. `b7b6f3d2-… .png` / `.json`)
   and are written **directly to a user-selected folder**.

## 📁 Project Structure

```
facebook_screenshots/
├── src/                    # Chrome Extension files
│   ├── manifest.json      # Extension Manifest
│   ├── popup.html         # Popup Interface
│   ├── popup.js           # Popup Logic
│   ├── options.html       # Settings page
│   ├── options.js         # Settings logic
│   ├── background.js      # Service Worker
│   └── content.js         # Content Script
├── README.md              # This file
├── INSTALLATION.md        # Installation guide
├── package.json           # Project configuration
└── .gitignore             # Git Ignore
```

---

## Framework

- Browser: **Google Chrome**, Manifest **V3**
- Scope: **active tab only**
- Storage: **no backend, no DB** – only **files** in the chosen folder
- Trigger: visible DOM change (Scroll/Resize/Mutation) with debounce

---

## Folder Selection & Writing (important)

### Approach A (recommended, without Save-As dialogs)

- In the **Options page**: Button **"Choose target folder"**.
- Via **File System Access API**: `showDirectoryPicker()`.
- Result: permanently store `FileSystemDirectoryHandle` (IndexedDB/`chrome.storage`) and
  obtain **write permission** via `requestPermission({ mode: "readwrite" })`.
- During capture: via the handle `createWritable()` → **create PNG/JSON directly in folder** (no prompts).

> Note: The user must choose/authorize this folder **once**.

### Fallback B (if A is not possible)

- `chrome.downloads.download()` with `filename: "<subfolder>/<uuid>.png"`/`.json` in Chrome download folder.
- Set `saveAs: false` (no dialogs). Subfolder relative to standard download directory.

---

## Filenames & Formats

- **UUID v4** per capture, e.g. `b7b6f3d2-7b30-4d7e-9f0b-2f9e0a1f4a11`
- Files:
  - `b7b6f3d2-….png` (Viewport screenshot)
  - `b7b6f3d2-….json` (Metadata)
- PNG (lossless); JSON UTF-8.

---

## JSON Content

```json
{
  "id": "UUID4",
  "timestamp_utc": "2025-10-22T12:34:56.789Z",
  "url": "https://example.com/path",
  "viewport": { "width": 1366, "height": 768, "devicePixelRatio": 2 },
  "scroll": { "x": 0, "y": 1240 },
  "image_filename": "UUID4.png",
  "text_visible": "… complete visible text …",
  "html_visible": "<!-- complete HTML fragment of all currently visible elements, without <script> -->"
}
```

## Definitions

- text_visible: consolidated visible text in viewport (in display order).
- html_visible: complete visible page content as HTML fragment (all visible elements, scripts removed).

## Detection Logic (visible change)

- Events: scroll, resize, MutationObserver (attributes, childList, characterData)
- Visibility: Only consider elements whose getClientRects() intersect the viewport and are not:
- display: none, visibility: hidden, opacity: 0
- Debounce / Rate-Limit: DEBOUNCE_MS = 500 ms, max. 1 capture/second

## Process (High Level) 1. Start in popup ("Start Capture") 2. Content Script activates observer & (optional) light scroll damping 3. On visible change (and debounce fulfilled):

- Background: chrome.tabs.captureVisibleTab({format:"png"}) → PNG
- Content Script: extract text_visible + html_visible
- Generate UUID4; save PNG + JSON under this name in chosen folder 4. Stop in popup ("Stop Capture") → remove listeners/observers

## Permissions (Manifest excerpt)

```json
{
  "permissions": ["activeTab", "scripting", "storage", "downloads", "tabs"],
  "host_permissions": ["<all_urls>"],
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "background.js" },
  "options_page": "options.html"
}
```

File System Access API requires a user click in options.html (Button "Choose folder").

## Success Criteria

- Each capture creates two files in target folder: UUID4.png & UUID4.json
- JSON contains UTC time, URL, visible text and visible HTML fragment
- Runs without dialogs after one-time folder authorization

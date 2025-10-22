# 📸 DOM Change Screenshot Capture

Eine Chrome Extension, die automatisch Screenshots bei sichtbaren DOM-Änderungen erstellt.

## 🎯 Ziel

Bei **sichtbaren Änderungen** im **aktiven Tab** automatisch:

1. **Screenshot** als **PNG**
2. **Metadaten** als **JSON**
   Beide Dateien teilen sich denselben **UUID4-Basenamen** (z. B. `b7b6f3d2-… .png` / `.json`)
   und werden **direkt in einen vom Nutzer gewählten Ordner** geschrieben.

## 📁 Projektstruktur

```
facebook_screenshots/
├── src/                    # Chrome Extension Dateien
│   ├── manifest.json      # Extension Manifest
│   ├── popup.html         # Popup Interface
│   ├── popup.js           # Popup Logik
│   ├── options.html       # Einstellungsseite
│   ├── options.js         # Einstellungslogik
│   ├── background.js      # Service Worker
│   └── content.js         # Content Script
├── README.md              # Diese Datei
├── INSTALLATION.md        # Installationsanleitung
├── package.json           # Projekt-Konfiguration
└── .gitignore             # Git Ignore
```

---

## Rahmen

- Browser: **Google Chrome**, Manifest **V3**
- Geltung: **nur aktiver Tab**
- Speicher: **kein Backend, keine DB** – nur **Dateien** im gewählten Ordner
- Auslöser: sichtbare DOM-Änderung (Scroll/Resize/Mutation) mit Debounce

---

## Ordnerwahl & Schreiben (wichtig)

### Vorgehen A (empfohlen, ohne Save-As-Dialoge)

- In der **Options-Seite**: Button **„Zielordner wählen“**.
- Per **File System Access API**: `showDirectoryPicker()`.
- Ergebnis: `FileSystemDirectoryHandle` dauerhaft speichern (IndexedDB/`chrome.storage`) und
  **Schreibberechtigung** via `requestPermission({ mode: "readwrite" })` einholen.
- Beim Capture: über den Handle `createWritable()` → **PNG/JSON direkt im Ordner anlegen** (keine Prompts).

> Hinweis: Der Nutzer muss diesen Ordner **einmalig** wählen/autorieren.

### Fallback B (wenn A nicht möglich)

- `chrome.downloads.download()` mit `filename: "<unterordner>/<uuid>.png"`/`.json` im Chrome-Download-Ordner.
- Setze `saveAs: false` (keine Dialoge). Unterordner relativ zum Standard-Download-Verzeichnis.

---

## Dateinamen & Formate

- **UUID v4** pro Capture, z. B. `b7b6f3d2-7b30-4d7e-9f0b-2f9e0a1f4a11`
- Dateien:
  - `b7b6f3d2-….png` (Viewport-Screenshot)
  - `b7b6f3d2-….json` (Metadaten)
- PNG (verlustfrei); JSON UTF-8.

---

## JSON-Inhalt

```json
{
  "id": "UUID4",
  "timestamp_utc": "2025-10-22T12:34:56.789Z",
  "url": "https://example.com/path",
  "viewport": { "width": 1366, "height": 768, "devicePixelRatio": 2 },
  "scroll": { "x": 0, "y": 1240 },
  "image_filename": "UUID4.png",
  "text_visible": "… kompletter sichtbarer Text …",
  "html_visible": "<!-- vollständiges HTML-Fragment aller aktuell sichtbaren Elemente, ohne <script> -->"
}
```

## Definitionen

- text_visible: zusammengefasster sichtbarer Text im Viewport (in Anzeige-Reihenfolge).
- html_visible: kompletter sichtbarer Page-Content als HTML-Fragment (alle sichtbaren Elemente, Skripte entfernt).

## Erkennungslogik (sichtbare Änderung)

- Events: scroll, resize, MutationObserver (attributes, childList, characterData)
- Sichtbarkeit: Nur Elemente berücksichtigen, deren getClientRects() den Viewport schneiden und nicht:
- display: none, visibility: hidden, opacity: 0
- Debounce / Rate-Limit: DEBOUNCE_MS = 500 ms, max. 1 Capture/Sekunde

## Ablauf (High Level) 1. Start im Popup („Start Capture“) 2. Content Script aktiviert Observer & (optional) leichte Scroll-Dämpfung 3. Bei sichtbarer Änderung (und Debounce erfüllt):

- Hintergrund: chrome.tabs.captureVisibleTab({format:"png"}) → PNG
- Content Script: text_visible + html_visible extrahieren
- UUID4 generieren; PNG + JSON unter diesem Namen in gewähltem Ordner speichern 4. Stop im Popup („Stop Capture“) → Listener/Observer aus

## Berechtigungen (Manifest-Auszug)

```json
{
  "permissions": ["activeTab", "scripting", "storage", "downloads", "tabs"],
  "host_permissions": ["<all_urls>"],
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "background.js" },
  "options_page": "options.html"
}
```

File System Access API erfordert einen User-Klick in options.html (Button „Ordner wählen“).

## Erfolgskriterien

- Jedes Capture erzeugt zwei Dateien im Zielordner: UUID4.png & UUID4.json
- JSON enthält UTC-Zeit, URL, sichtbaren Text und sichtbares HTML-Fragment
- Läuft ohne Dialoge nach einmaliger Ordnerfreigabe

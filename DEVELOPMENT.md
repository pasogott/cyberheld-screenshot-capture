# 🛠️ Development Guide

## Projektstruktur

```
facebook_screenshots/
├── src/                    # Chrome Extension (Hauptordner)
│   ├── manifest.json      # Extension Manifest V3
│   ├── popup.html         # Popup Interface
│   ├── popup.js           # Popup JavaScript
│   ├── options.html       # Einstellungsseite
│   ├── options.js         # Einstellungslogik
│   ├── background.js      # Service Worker
│   └── content.js         # Content Script
├── README.md              # Projektbeschreibung
├── INSTALLATION.md        # Installationsanleitung
├── DEVELOPMENT.md        # Diese Datei
├── package.json           # NPM Konfiguration
└── .gitignore             # Git Ignore
```

## Entwicklung

### Lokale Entwicklung

1. **Extension laden**

   ```bash
   # Öffne Chrome
   chrome://extensions/

   # Aktiviere "Entwicklermodus"
   # Klicke "Entpackte Erweiterung laden"
   # Wähle den `src/` Ordner aus
   ```

2. **Änderungen testen**
   - Änderungen in `src/` werden automatisch erkannt
   - Klicke "Aktualisieren" in der Extension-Liste
   - Teste die Funktionalität

### Debugging

- **Popup**: Rechtsklick auf Extension-Icon → "Popup untersuchen"
- **Background Script**: Extension-Seite → "Service Worker" → "Untersuchen"
- **Content Script**: Tab → F12 → Console
- **Options**: Options-Seite → F12 → Console

### Build & Package

```bash
# Extension als ZIP verpacken
npm run package

# Extension bereinigen
npm run clean
```

## Technische Details

### Manifest V3 Features

- **Service Worker**: `background.js` läuft als Service Worker
- **File System Access API**: Für Ordnerwahl und Datei-Speicherung
- **Content Scripts**: Automatische Injektion in alle Tabs
- **Storage API**: Für Einstellungen und Status

### Berechtigungen

```json
{
  "permissions": ["activeTab", "scripting", "storage", "downloads", "tabs"],
  "host_permissions": ["<all_urls>"]
}
```

### API Verwendung

- **chrome.tabs.captureVisibleTab()**: Screenshot-Erstellung
- **chrome.storage.local**: Einstellungen speichern
- **chrome.scripting.executeScript()**: Content Script Aktivierung
- **File System Access API**: Ordnerwahl und Datei-Speicherung

## Code-Struktur

### Background Script (`background.js`)

- Message Handler für Popup-Kommunikation
- Screenshot-Capture und Datei-Speicherung
- Content Script Aktivierung/Deaktivierung

### Content Script (`content.js`)

- DOM-Änderungs-Erkennung (MutationObserver)
- Scroll/Resize Event Handling
- Sichtbarkeits-Prüfung
- Text/HTML-Extraktion

### Popup (`popup.html/js`)

- Start/Stop Interface
- Status-Anzeige
- Einstellungen-Link

### Options (`options.html/js`)

- Ordnerwahl mit File System Access API
- Directory Handle Speicherung
- Benutzerfreundliche UI

## Testing

### Funktionstests

1. **Ordnerwahl testen**

   - Options-Seite öffnen
   - Ordner auswählen
   - Berechtigung bestätigen

2. **Screenshot-Capture testen**

   - Capture starten
   - DOM-Änderungen simulieren (Scroll, Resize, Content-Änderungen)
   - Screenshots im gewählten Ordner prüfen

3. **Metadaten prüfen**
   - JSON-Dateien öffnen
   - Vollständigkeit der Daten prüfen
   - UUID4-Format validieren

### Browser-Kompatibilität

- **Chrome 88+**: Vollständige Unterstützung
- **File System Access API**: Chrome 86+
- **Manifest V3**: Chrome 88+

## Deployment

### Chrome Web Store (Optional)

1. **Extension packen**

   ```bash
   npm run package
   ```

2. **Chrome Web Store Developer Dashboard**
   - ZIP-Datei hochladen
   - Metadaten ausfüllen
   - Review-Prozess durchlaufen

### Lokale Verteilung

- `src/` Ordner teilen
- Installationsanleitung beifügen
- README.md für Benutzer

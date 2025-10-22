# 📦 Installation der Chrome Extension

## Voraussetzungen

- Google Chrome Browser (Version 88+)
- File System Access API Support (Chrome 86+)

## Installation

1. **Chrome Developer Mode aktivieren**

   - Öffne `chrome://extensions/`
   - Aktiviere "Entwicklermodus" (oben rechts)

2. **Extension laden**

   - Klicke auf "Entpackte Erweiterung laden"
   - Wähle den Ordner `src/` aus (nicht den Root-Ordner!)
   - Die Extension sollte jetzt in der Liste erscheinen

3. **Extension einrichten**
   - Klicke auf das Extension-Icon in der Chrome-Toolbar
   - Klicke auf "⚙️ Einstellungen"
   - Wähle einen Zielordner für Screenshots aus
   - Bestätige die Ordnerberechtigung

## Verwendung

1. **Capture starten**

   - Klicke auf das Extension-Icon
   - Klicke auf "🚀 Capture starten"
   - Die Extension überwacht jetzt DOM-Änderungen

2. **Automatische Screenshots**

   - Bei sichtbaren Änderungen werden automatisch Screenshots erstellt
   - Jeder Screenshot erhält eine eindeutige UUID4
   - PNG + JSON Dateien werden im gewählten Ordner gespeichert

3. **Capture stoppen**
   - Klicke auf das Extension-Icon
   - Klicke auf "⏹️ Capture stoppen"

## Dateiformate

- **PNG**: Screenshot des Viewports
- **JSON**: Metadaten mit URL, Zeitstempel, sichtbarem Text und HTML

## Troubleshooting

- **"Kein Zielordner gewählt"**: Wähle zuerst einen Ordner in den Einstellungen
- **File System Access API Fehler**: Stelle sicher, dass Chrome aktuell ist
- **Keine Screenshots**: Prüfe ob der Tab aktiv ist und sichtbare Änderungen vorliegen

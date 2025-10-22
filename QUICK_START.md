# ⚡ Quick Start Guide

## 🚀 Extension mit einem Befehl erstellen

### Option 1: NPM Scripts (Empfohlen)

```bash
# Extension erstellen und installieren
npm run quick-start

# Oder einzeln:
npm run setup      # Extension-ZIP erstellen
npm run install   # Chrome öffnen und installieren
```

### Option 2: Direkte Scripts

```bash
# Extension erstellen
./scripts/setup.sh

# Chrome öffnen und installieren
./scripts/install.sh
```

### Option 3: Manuelle Befehle

```bash
# Extension-ZIP erstellen
npm run create-extension

# Chrome Extensions öffnen
npm run install-chrome
```

## 📋 Verfügbare Befehle

| Befehl                     | Beschreibung                                             |
| -------------------------- | -------------------------------------------------------- |
| `npm run quick-start`      | **Alles in einem** - Extension erstellen + Chrome öffnen |
| `npm run setup`            | Extension-ZIP erstellen und validieren                   |
| `npm run install`          | Chrome Extensions öffnen                                 |
| `npm run create-extension` | Nur Extension-ZIP erstellen                              |
| `npm run clean`            | Extension-ZIP löschen                                    |
| `npm run dev`              | Entwicklungsmodus (manuell laden)                        |

## 🎯 Schnellstart

```bash
# 1. Extension erstellen
npm run setup

# 2. Chrome öffnen und installieren
npm run install

# 3. In Chrome:
#    - Entwicklermodus aktivieren
#    - "Entpackte Erweiterung laden"
#    - src/ Ordner auswählen
```

## 🔧 Entwicklung

```bash
# Entwicklungsmodus
npm run dev

# Dann in Chrome:
# 1. chrome://extensions/ öffnen
# 2. Entwicklermodus aktivieren
# 3. "Entpackte Erweiterung laden"
# 4. src/ Ordner auswählen
# 5. Bei Änderungen: "Aktualisieren" klicken
```

## 📦 Distribution

```bash
# Extension für Verteilung erstellen
npm run create-extension

# Ergebnis: extension.zip
# Kann an andere Benutzer verteilt werden
```

## 🛠️ Troubleshooting

### "Permission denied" Fehler

```bash
chmod +x scripts/*.sh
```

### "src/ Ordner nicht gefunden"

```bash
# Stelle sicher, dass du im Projekt-Root bist
pwd
ls -la src/
```

### Chrome öffnet nicht

```bash
# Manuell öffnen
open -a "Google Chrome" chrome://extensions/
```

## ✅ Erfolg

Nach erfolgreicher Installation:

1. **Extension-Icon** in Chrome-Toolbar sichtbar
2. **Popup öffnet** sich beim Klick
3. **Einstellungen** funktionieren
4. **Screenshots** werden erstellt

🎉 **Extension ist bereit zur Verwendung!**

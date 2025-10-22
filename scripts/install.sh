#!/bin/bash

# 📦 Chrome Extension Installer
# Automatische Installation der Extension

echo "📦 Chrome Extension Installer gestartet..."

# Prüfe ob Chrome installiert ist
if ! command -v google-chrome &> /dev/null && ! command -v chromium &> /dev/null; then
    echo "❌ Chrome/Chromium nicht gefunden!"
    echo "💡 Installiere Chrome oder Chromium zuerst"
    exit 1
fi

# Prüfe ob src/ Ordner existiert
if [ ! -d "src" ]; then
    echo "❌ src/ Ordner nicht gefunden!"
    echo "💡 Stelle sicher, dass du im Projekt-Root bist"
    exit 1
fi

echo "🔍 Prüfe Extension-Dateien..."
required_files=("src/manifest.json" "src/popup.html" "src/popup.js" "src/options.html" "src/options.js" "src/background.js" "src/content.js")

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Fehlende Datei: $file"
        exit 1
    fi
done

echo "✅ Alle Extension-Dateien gefunden!"

# Öffne Chrome Extensions Seite
echo "🌐 Öffne Chrome Extensions..."
if command -v google-chrome &> /dev/null; then
    google-chrome --new-window chrome://extensions/ &
elif command -v chromium &> /dev/null; then
    chromium --new-window chrome://extensions/ &
fi

echo ""
echo "📋 Manuelle Schritte:"
echo "1. Aktiviere 'Entwicklermodus' (oben rechts)"
echo "2. Klicke 'Entpackte Erweiterung laden'"
echo "3. Wähle den 'src/' Ordner aus"
echo "4. Extension sollte in der Liste erscheinen"
echo ""
echo "🎉 Extension ist bereit zur Verwendung!"

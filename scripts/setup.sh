#!/bin/bash

# 🚀 Chrome Extension Setup Script
# Erstellt die komplette Extension-Struktur

echo "🚀 Chrome Extension Setup gestartet..."

# Prüfe ob src/ Ordner existiert
if [ ! -d "src" ]; then
    echo "❌ src/ Ordner nicht gefunden!"
    echo "💡 Stelle sicher, dass du im Projekt-Root bist"
    exit 1
fi

# Prüfe ob alle erforderlichen Dateien vorhanden sind
required_files=("src/manifest.json" "src/popup.html" "src/popup.js" "src/options.html" "src/options.js" "src/background.js" "src/content.js")

echo "🔍 Prüfe Extension-Dateien..."
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Fehlende Datei: $file"
        exit 1
    fi
done

echo "✅ Alle Extension-Dateien gefunden!"

# Erstelle Extension-ZIP
echo "📦 Erstelle Extension-ZIP..."
if [ -f "extension.zip" ]; then
    rm extension.zip
fi

zip -r extension.zip src/ -x "*.DS_Store" "*.git*"

if [ $? -eq 0 ]; then
    echo "✅ Extension erfolgreich erstellt: extension.zip"
    echo ""
    echo "📋 Nächste Schritte:"
    echo "1. Öffne Chrome: chrome://extensions/"
    echo "2. Aktiviere 'Entwicklermodus'"
    echo "3. Klicke 'Entpackte Erweiterung laden'"
    echo "4. Wähle den 'src/' Ordner aus"
    echo ""
    echo "🎉 Extension ist bereit zur Verwendung!"
else
    echo "❌ Fehler beim Erstellen der Extension"
    exit 1
fi

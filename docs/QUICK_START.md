# ⚡ Quick Start Guide

## 🚀 Create Extension with One Command

### Option 1: NPM Scripts (Recommended)

```bash
# Create and install extension
npm run quick-start

# Or individually:
npm run setup      # Create extension ZIP
npm run install   # Open Chrome and install
```

### Option 2: Direct Scripts

```bash
# Create extension
./scripts/setup.sh

# Open Chrome and install
./scripts/install.sh
```

### Option 3: Manual Commands

```bash
# Create extension ZIP
npm run create-extension

# Open Chrome Extensions
npm run install-chrome
```

## 📋 Available Commands

| Command                    | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| `npm run quick-start`      | **Everything in one** - Create extension + Open Chrome |
| `npm run setup`            | Create extension ZIP and validate                      |
| `npm run install`          | Open Chrome Extensions                                 |
| `npm run create-extension` | Only create extension ZIP                              |
| `npm run clean`            | Delete extension ZIP                                   |
| `npm run dev`              | Development mode (manual loading)                      |

## 🎯 Quick Start

```bash
# 1. Create extension
npm run setup

# 2. Open Chrome and install
npm run install

# 3. In Chrome:
#    - Enable developer mode
#    - "Load unpacked extension"
#    - Select src/ folder
```

## 🔧 Development

```bash
# Development mode
npm run dev

# Then in Chrome:
# 1. Open chrome://extensions/
# 2. Enable developer mode
# 3. "Load unpacked extension"
# 4. Select src/ folder
# 5. On changes: Click "Reload"
```

## 📦 Distribution

```bash
# Create extension for distribution
npm run create-extension

# Result: extension.zip
# Can be distributed to other users
```

## 🛠️ Troubleshooting

### "Permission denied" Error

```bash
chmod +x scripts/*.sh
```

### "src/ folder not found"

```bash
# Make sure you're in the project root
pwd
ls -la src/
```

### Chrome doesn't open

```bash
# Open manually
open -a "Google Chrome" chrome://extensions/
```

## ✅ Success

After successful installation:

1. **Extension icon** visible in Chrome toolbar
2. **Popup opens** when clicked
3. **Settings** work
4. **Screenshots** are created

🎉 **Extension is ready to use!**

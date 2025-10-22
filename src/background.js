// Background Script für Chrome Extension
let isCapturing = false;
let directoryHandle = null;

// Message Handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "startCapture":
      startCapture();
      break;
    case "stopCapture":
      stopCapture();
      break;
    case "captureScreenshot":
      captureScreenshot(message.data);
      break;
  }
});

// Extension Startup
chrome.runtime.onStartup.addListener(async () => {
  await loadSettings();
});

chrome.runtime.onInstalled.addListener(async () => {
  await loadSettings();
});

async function loadSettings() {
  try {
    const result = await chrome.storage.local.get([
      "isCapturing",
      "directoryHandle",
    ]);
    isCapturing = result.isCapturing || false;
    directoryHandle = result.directoryHandle || null;
  } catch (error) {
    console.error("Fehler beim Laden der Einstellungen:", error);
  }
}

async function startCapture() {
  try {
    console.log("🚀 Starte Capture...");

    // Lösche vorherige Fehler
    await chrome.storage.local.remove(["error"]);

    // Prüfe ob Ordner gewählt wurde
    const result = await chrome.storage.local.get(["hasDirectory"]);
    if (!result.hasDirectory) {
      console.error("❌ Kein Zielordner gewählt");
      await chrome.storage.local.set({ error: "Kein Zielordner gewählt" });
      return;
    }

    console.log("✅ Zielordner gefunden");

    // Aktiviere Content Script
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab) {
      console.log(`📱 Aktiviere Content Script für Tab: ${tab.url}`);
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: activateContentScript,
      });
    } else {
      console.error("❌ Kein aktiver Tab gefunden");
    }

    isCapturing = true;
    await chrome.storage.local.set({
      isCapturing: true,
      error: null,
    });

    console.log("✅ Capture gestartet");
    // Benachrichtige Popup
    chrome.runtime.sendMessage({ type: "statusUpdate" });
  } catch (error) {
    console.error("❌ Fehler beim Starten des Captures:", error);
    await chrome.storage.local.set({
      error: `Fehler beim Starten: ${error.message}`,
    });
  }
}

async function stopCapture() {
  try {
    // Lösche vorherige Fehler
    await chrome.storage.local.remove(["error"]);

    // Deaktiviere Content Script
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: deactivateContentScript,
      });
    }

    isCapturing = false;
    await chrome.storage.local.set({
      isCapturing: false,
      error: null,
    });

    // Benachrichtige Popup
    chrome.runtime.sendMessage({ type: "statusUpdate" });
  } catch (error) {
    console.error("Fehler beim Stoppen des Captures:", error);
    await chrome.storage.local.set({
      error: `Fehler beim Stoppen: ${error.message}`,
    });
  }
}

async function captureScreenshot(data) {
  try {
    if (!isCapturing) return;

    console.log("📸 Screenshot-Capture gestartet...");

    // Generiere UUID4
    const uuid = generateUUID();
    console.log(`🆔 UUID generiert: ${uuid}`);

    // Screenshot erstellen
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab) {
      console.error("❌ Kein aktiver Tab gefunden");
      return;
    }

    console.log(`📱 Screenshot für Tab: ${tab.url}`);
    const screenshot = await chrome.tabs.captureVisibleTab({
      format: "png",
    });

    // Konvertiere Data URL zu Blob
    const response = await fetch(screenshot);
    const blob = await response.blob();
    console.log(`📦 Blob erstellt: ${blob.size} bytes`);

    // Lade Directory Handle
    const result = await chrome.storage.local.get(["directoryHandle"]);
    if (!result.directoryHandle) {
      throw new Error("Kein Directory Handle verfügbar");
    }

    console.log("📁 Directory Handle gefunden, speichere Dateien...");

    // Speichere PNG
    const pngFile = await result.directoryHandle.getFileHandle(`${uuid}.png`, {
      create: true,
    });
    const pngWritable = await pngFile.createWritable();
    await pngWritable.write(blob);
    await pngWritable.close();
    console.log(`✅ PNG gespeichert: ${uuid}.png`);

    // Erstelle JSON Metadaten
    const metadata = {
      id: uuid,
      timestamp_utc: new Date().toISOString(),
      url: tab.url,
      viewport: {
        width: data.viewport.width,
        height: data.viewport.height,
        devicePixelRatio: data.viewport.devicePixelRatio,
      },
      scroll: {
        x: data.scroll.x,
        y: data.scroll.y,
      },
      image_filename: `${uuid}.png`,
      text_visible: data.text_visible,
      html_visible: data.html_visible,
    };

    // Speichere JSON
    const jsonFile = await result.directoryHandle.getFileHandle(
      `${uuid}.json`,
      { create: true }
    );
    const jsonWritable = await jsonFile.createWritable();
    await jsonWritable.write(JSON.stringify(metadata, null, 2));
    await jsonWritable.close();
    console.log(`✅ JSON gespeichert: ${uuid}.json`);

    console.log(`🎉 Screenshot erfolgreich gespeichert: ${uuid}`);
  } catch (error) {
    console.error("❌ Fehler beim Speichern des Screenshots:", error);
    // Speichere Fehler für Popup
    await chrome.storage.local.set({
      error: `Screenshot-Fehler: ${error.message}`,
    });
  }
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Content Script Aktivierung/Deaktivierung
function activateContentScript() {
  window.dispatchEvent(new CustomEvent("activateScreenshotCapture"));
}

function deactivateContentScript() {
  window.dispatchEvent(new CustomEvent("deactivateScreenshotCapture"));
}

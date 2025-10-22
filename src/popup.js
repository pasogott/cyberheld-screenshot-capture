// Popup Script für Chrome Extension
document.addEventListener("DOMContentLoaded", async () => {
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const optionsBtn = document.getElementById("optionsBtn");
  const resetBtn = document.getElementById("resetBtn");
  const status = document.getElementById("status");

  // Status prüfen
  await updateStatus();

  // Event Listeners
  startBtn.addEventListener("click", startCapture);
  stopBtn.addEventListener("click", stopCapture);
  optionsBtn.addEventListener("click", openOptions);
  resetBtn.addEventListener("click", resetExtension);

  // Status Updates von Background Script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "statusUpdate") {
      updateStatus();
    }
  });

  async function updateStatus() {
    try {
      const result = await chrome.storage.local.get([
        "isCapturing",
        "hasDirectory",
        "error",
      ]);

      if (result.error) {
        status.textContent = `Fehler: ${result.error}`;
        status.className = "status error";
        startBtn.style.display = "none";
        stopBtn.style.display = "none";
        resetBtn.style.display = "block";
        return;
      }

      if (!result.hasDirectory) {
        status.textContent = "Bitte wähle zuerst einen Zielordner";
        status.className = "status inactive";
        startBtn.style.display = "none";
        stopBtn.style.display = "none";
        resetBtn.style.display = "none";
        return;
      }

      if (result.isCapturing) {
        status.textContent = "✅ Capture aktiv";
        status.className = "status active";
        startBtn.style.display = "none";
        stopBtn.style.display = "block";
        resetBtn.style.display = "none";
      } else {
        status.textContent = "Bereit zum Starten";
        status.className = "status inactive";
        startBtn.style.display = "block";
        stopBtn.style.display = "none";
        resetBtn.style.display = "none";
      }
    } catch (error) {
      status.textContent = `Fehler: ${error.message}`;
      status.className = "status error";
      startBtn.style.display = "none";
      stopBtn.style.display = "none";
      resetBtn.style.display = "block";
    }
  }

  async function startCapture() {
    try {
      // Prüfe ob Ordner gewählt wurde
      const result = await chrome.storage.local.get(["hasDirectory"]);
      if (!result.hasDirectory) {
        status.textContent = "Bitte wähle zuerst einen Zielordner";
        status.className = "status error";
        return;
      }

      // Starte Capture
      await chrome.runtime.sendMessage({ type: "startCapture" });
      await updateStatus();
    } catch (error) {
      status.textContent = `Fehler beim Starten: ${error.message}`;
      status.className = "status error";
    }
  }

  async function stopCapture() {
    try {
      await chrome.runtime.sendMessage({ type: "stopCapture" });
      await updateStatus();
    } catch (error) {
      status.textContent = `Fehler beim Stoppen: ${error.message}`;
      status.className = "status error";
    }
  }

  function openOptions() {
    try {
      chrome.runtime.openOptionsPage();
    } catch (error) {
      // Fallback: Öffne Options-Seite direkt
      chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
    }
  }

  async function resetExtension() {
    try {
      // Bestätigung
      if (
        !confirm(
          "Möchtest du die Extension wirklich zurücksetzen? Alle Einstellungen gehen verloren."
        )
      ) {
        return;
      }

      // Alle Daten löschen
      await chrome.storage.local.clear();

      // Status zurücksetzen
      status.textContent = "Extension zurückgesetzt";
      status.className = "status success";
      startBtn.style.display = "none";
      stopBtn.style.display = "none";
      resetBtn.style.display = "none";

      // Nach 2 Sekunden Status aktualisieren
      setTimeout(async () => {
        await updateStatus();
      }, 2000);
    } catch (error) {
      status.textContent = `Fehler beim Zurücksetzen: ${error.message}`;
      status.className = "status error";
    }
  }
});

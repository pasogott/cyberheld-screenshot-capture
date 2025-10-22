// Options Script für Chrome Extension
document.addEventListener("DOMContentLoaded", async () => {
  const selectDirectoryBtn = document.getElementById("selectDirectoryBtn");
  const directorySection = document.getElementById("directorySection");
  const directoryInfo = document.getElementById("directoryInfo");
  const directoryPath = document.getElementById("directoryPath");
  const status = document.getElementById("status");

  // Lade aktuellen Status
  await loadDirectoryStatus();

  // Event Listener
  selectDirectoryBtn.addEventListener("click", selectDirectory);

  async function loadDirectoryStatus() {
    try {
      const result = await chrome.storage.local.get([
        "directoryHandle",
        "directoryName",
      ]);

      if (result.directoryHandle) {
        showDirectorySelected(result.directoryName || "Unbekannter Ordner");
      } else {
        showDirectoryNotSelected();
      }
    } catch (error) {
      showError(`Fehler beim Laden: ${error.message}`);
    }
  }

  async function selectDirectory() {
    try {
      // Prüfe File System Access API Support
      if (!("showDirectoryPicker" in window)) {
        throw new Error(
          "File System Access API wird von diesem Browser nicht unterstützt"
        );
      }

      // Öffne Directory Picker
      const directoryHandle = await window.showDirectoryPicker({
        mode: "readwrite",
        startIn: "documents",
      });

      // Speichere Directory Handle
      await chrome.storage.local.set({
        directoryHandle: directoryHandle,
        directoryName: directoryHandle.name,
        hasDirectory: true,
      });

      showDirectorySelected(directoryHandle.name);
      showSuccess("Ordner erfolgreich ausgewählt!");
    } catch (error) {
      if (error.name === "AbortError") {
        // User hat Dialog abgebrochen
        return;
      }
      showError(`Fehler beim Auswählen des Ordners: ${error.message}`);
    }
  }

  function showDirectorySelected(name) {
    directorySection.classList.add("has-directory");
    directoryPath.textContent = name;
    directoryInfo.style.display = "block";
    selectDirectoryBtn.textContent = "📁 Anderen Ordner wählen";
  }

  function showDirectoryNotSelected() {
    directorySection.classList.remove("has-directory");
    directoryInfo.style.display = "none";
    selectDirectoryBtn.textContent = "📁 Ordner wählen";
  }

  function showSuccess(message) {
    status.textContent = message;
    status.className = "status success";
    status.style.display = "block";
    setTimeout(() => {
      status.style.display = "none";
    }, 3000);
  }

  function showError(message) {
    status.textContent = message;
    status.className = "status error";
    status.style.display = "block";
    setTimeout(() => {
      status.style.display = "none";
    }, 5000);
  }
});

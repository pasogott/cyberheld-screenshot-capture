// Content Script für Chrome Extension
let isActive = false;
let debounceTimer = null;
let lastCaptureTime = 0;
const DEBOUNCE_MS = 500;
const MIN_CAPTURE_INTERVAL = 1000; // 1 Sekunde

console.log("🔧 Content Script geladen");

// Event Listeners für Aktivierung/Deaktivierung
window.addEventListener("activateScreenshotCapture", () => {
  console.log("🚀 Content Script aktiviert");
  isActive = true;
  startObserving();
});

window.addEventListener("deactivateScreenshotCapture", () => {
  console.log("⏹️ Content Script deaktiviert");
  isActive = false;
  stopObserving();
});

// DOM Observer
let observer = null;

function startObserving() {
  if (observer) return;

  console.log("👀 Starte DOM-Observer...");

  // MutationObserver für DOM-Änderungen
  observer = new MutationObserver((mutations) => {
    if (!isActive) return;

    // Prüfe ob sichtbare Änderungen vorliegen
    const hasVisibleChanges = mutations.some((mutation) => {
      return (
        hasVisibleElement(mutation.target) ||
        Array.from(mutation.addedNodes).some((node) =>
          hasVisibleElement(node)
        ) ||
        Array.from(mutation.removedNodes).some((node) =>
          hasVisibleElement(node)
        )
      );
    });

    if (hasVisibleChanges) {
      console.log("🔄 Sichtbare Änderungen erkannt");
      scheduleCapture();
    }
  });

  // Scroll und Resize Events mit Dämpfung
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });

  // Starte Observer
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"],
    characterData: true,
  });

  console.log("✅ DOM-Observer gestartet");
}

function stopObserving() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);

  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}

function handleScroll() {
  if (!isActive) return;
  console.log("📜 Scroll erkannt");
  scheduleCapture();
}

function handleResize() {
  if (!isActive) return;
  console.log("📏 Resize erkannt");
  scheduleCapture();
}

function scheduleCapture() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  console.log(`⏱️ Debounce Timer gestartet (${DEBOUNCE_MS}ms)`);
  debounceTimer = setTimeout(() => {
    performCapture();
  }, DEBOUNCE_MS);
}

async function performCapture() {
  if (!isActive) return;

  // Rate Limiting
  const now = Date.now();
  if (now - lastCaptureTime < MIN_CAPTURE_INTERVAL) {
    console.log("⏸️ Rate Limiting aktiv, überspringe Capture");
    return;
  }
  lastCaptureTime = now;

  console.log("📸 Starte Screenshot-Capture...");

  try {
    // Sammle Daten
    const data = await collectPageData();
    console.log("📊 Daten gesammelt:", {
      viewport: data.viewport,
      scroll: data.scroll,
      textLength: data.text_visible.length,
      htmlLength: data.html_visible.length,
    });

    // Sende an Background Script
    chrome.runtime.sendMessage({
      type: "captureScreenshot",
      data: data,
    });
    console.log("📤 Nachricht an Background Script gesendet");
  } catch (error) {
    console.error("❌ Fehler beim Sammeln der Daten:", error);
  }
}

async function collectPageData() {
  // Viewport Information
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
  };

  // Scroll Position
  const scroll = {
    x: window.scrollX,
    y: window.scrollY,
  };

  // Sichtbarer Text
  const textVisible = extractVisibleText();

  // Sichtbares HTML
  const htmlVisible = extractVisibleHTML();

  return {
    viewport,
    scroll,
    text_visible: textVisible,
    html_visible: htmlVisible,
  };
}

function extractVisibleText() {
  const visibleElements = getVisibleElements();
  const textParts = [];

  visibleElements.forEach((element) => {
    const text = element.textContent?.trim();
    if (text && text.length > 0) {
      textParts.push(text);
    }
  });

  return textParts.join(" ");
}

function extractVisibleHTML() {
  const visibleElements = getVisibleElements();
  const htmlParts = [];

  visibleElements.forEach((element) => {
    // Entferne Script-Tags und deren Inhalt
    const clone = element.cloneNode(true);
    const scripts = clone.querySelectorAll("script");
    scripts.forEach((script) => script.remove());

    const html = clone.outerHTML;
    if (html && html.length > 0) {
      htmlParts.push(html);
    }
  });

  return htmlParts.join("\n");
}

function getVisibleElements() {
  const allElements = document.querySelectorAll("*");
  const visibleElements = [];

  allElements.forEach((element) => {
    if (isElementVisible(element)) {
      visibleElements.push(element);
    }
  });

  return visibleElements;
}

function isElementVisible(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  // Prüfe CSS-Eigenschaften
  const style = window.getComputedStyle(element);
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.opacity === "0"
  ) {
    return false;
  }

  // Prüfe ob Element im Viewport ist
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  return (
    rect.top < viewportHeight &&
    rect.bottom > 0 &&
    rect.left < viewportWidth &&
    rect.right > 0
  );
}

function hasVisibleElement(node) {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  return (
    isElementVisible(node) ||
    Array.from(node.querySelectorAll("*")).some((child) =>
      isElementVisible(child)
    )
  );
}

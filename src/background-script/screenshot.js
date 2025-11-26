// background script

// Constants
let SCREENSHOT_CONFIG = {
    format: 'png',
};


export async function getCapturedImageUri(windowId, config = {}) {
    SCREENSHOT_CONFIG = { ...SCREENSHOT_CONFIG, ...config };
    const imageUri = await new Promise(resolve => {
        chrome.tabs.captureVisibleTab(windowId, { format: SCREENSHOT_CONFIG.format }, resolve);
    });
    return imageUri;
}




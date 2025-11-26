import { BACKGROUND_MESSAGES_TYPES, STORAGE_KEYS } from "@/utils/enums.js";
import { v4 as uuidv4 } from 'uuid';
import { prepareInfoData } from './file-data.js';

import { settings } from './storage-data.js';
import { handleProcessScreenshot } from './screenshot.js';

import { downloadImage, downloadImageInfo } from '@/utils/download.js';
import { updateExtensionBadgeOfThisTab } from '@/utils/clib.js';
import { getConfig } from "@/utils/storage.js";

let screenshotCount = 0;
let config = {}

getConfig().then(cnf => {
    config = cnf;
})

const isExtensionActive = () => {
    return settings[STORAGE_KEYS.IS_ACTIVE] || settings.isPageActive;
}

///////////////////////////////
// new system
let handler = null;

function initScrollSteps(percent, callback) {
    if (handler) return;

    const stepFraction = percent / 100;
    const lastStepByElement = new WeakMap();

    handler = function (event) {
        const el =
            event.target === document
                ? (document.scrollingElement || document.documentElement)
                : event.target;

        const scrollTop = el.scrollTop;
        const stepSize = window.innerHeight * stepFraction;
        const currentStep = Math.floor(scrollTop / stepSize);

        const lastStep = lastStepByElement.get(el) ?? -1;
        if (currentStep !== lastStep) {
            lastStepByElement.set(el, currentStep);
            callback({
                element: el,
                scrollTop,
                step: currentStep,
                percentPassed: currentStep * percent,
            });
        }
    };

    document.addEventListener("scroll", handler, { capture: true });
}

function removeScrollSteps() {
    if (!handler) return;
    document.removeEventListener("scroll", handler, { capture: true });
    handler = null;
}
///////////////////////////////


//scroll detection
export function initScrollDetection() {
    let scrollPercent = parseInt(settings[STORAGE_KEYS.SCROLL_PERCENT]);
    if (isExtensionActive()) {
        initScrollSteps(scrollPercent, onScrollHandler)
    } else {
        removeScrollSteps()
    }


}


async function onScrollHandler() {
    console.log('onScrollHandler - start');

    screenshotCount++;
    updateExtensionBadgeOfThisTab(screenshotCount);

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const uuid = uuidv4();
    const filename = `${uuid}.${config.format || "png"}`;
    const infoData = prepareInfoData(uuid, filename, timestamp);

    let data = await chrome.runtime.sendMessage({
        type: BACKGROUND_MESSAGES_TYPES.TAKE_SCREENSHOT,
        saveToStorage: settings[STORAGE_KEYS.IS_SAVE_TO_GALLERY],
        saveArgs: { uuid, timestamp, infoData },
        config
    });
    let imageUri = data.imageUri;
    imageUri = await handleProcessScreenshot(imageUri)

    if (settings[STORAGE_KEYS.IS_DOWNLOAD_AUTO]) {
        downloadImage(imageUri, filename);
        downloadImageInfo(infoData);
    }

}

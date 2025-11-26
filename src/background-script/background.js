import { getData, setData } from "@/utils/clib.js";
import { BACKGROUND_MESSAGES_TYPES, STORAGE_KEYS } from "@/utils/enums.js";
import { getCapturedImageUri } from "./screenshot.js";

console.log("from background script")



chrome.runtime.onInstalled.addListener(async details => {
    console.log('chrome.onInstalled');
    setData({ 'onInstalled': true })

    const obj = {
        installed: true,
        [STORAGE_KEYS.IS_ACTIVE]: false,
        [STORAGE_KEYS.TRIGGER_TYPE]: "scroll",
        [STORAGE_KEYS.SHOT_INTERVAL_SECONDS]: 3,
        [STORAGE_KEYS.SCROLL_PERCENT]: 50,
        [STORAGE_KEYS.FILE_TYPE]: "png",
        [STORAGE_KEYS.IS_DOWNLOAD_AUTO]: true,
        [STORAGE_KEYS.IS_SAVE_TO_GALLERY]: false,
        [STORAGE_KEYS.AUTO_DELETE_DURATION_IN_DAYS]: 7,
        // 
        "user_name": "",
        "isKeyboardShortcut": true,
        "fontsize": "16",
        "bg_color": "#FFFFFF",
        "text_color": "#000000",
        "filetype": "png",
        "show_name": true,
        "show_time": true,
        "show_url": true,

    }

    const data = await getData(Object.keys(obj))
    // Get all keys that need to be initialized
    const keysToInitialize = Object.keys(obj).filter(key => data[key] === undefined);

    // Create an object with only the keys that need to be initialized
    const objToInitialize = {};
    for (const key of keysToInitialize) {
        objToInitialize[key] = obj[key];
    }

    setData(objToInitialize)
});


// chrome.action.onClicked.addListener(function(e) {
//     chrome.tabs.create({ url: chrome.runtime.getURL("view/options/index.html") })
// });
// //////////////////////////////////////////////////////////////


async function handleCaptureAndSaveScreenshot(request, sendResponse) {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    // let config = {}// await getConfig()
    let config = request.config

    // config = await getConfig()
    console.log(config)

    let imageUri = await getCapturedImageUri(tab.windowId, config)

    // send msg to content script
    sendResponse({ imageUri })
}
//////////////////////////////////
function curTabId() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) resolve(tabs[0].id)
        });
    })
}



//listener
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('mgs-> ', request);
    if (request.type == 'currentTabId') {
        curTabId().then(sendResponse)
    }

    if (request.type == 'badgeUpdate') {
        chrome.action.setBadgeText({ text: request.value });
    }

    if (request.type == 'badgeUpdateOfThisTab') {
        chrome.action.setBadgeText({ text: request.value, tabId: sender.tab.id });
    }

    if (request.type == BACKGROUND_MESSAGES_TYPES.TAKE_SCREENSHOT) {
        handleCaptureAndSaveScreenshot(request, sendResponse)
        return true;
    }


    // return true from the event listener to indicate you wish to send a response asynchronously
    // (this will keep the message channel open to the other end until sendResponse is called).
    // return true;
});



////////////////
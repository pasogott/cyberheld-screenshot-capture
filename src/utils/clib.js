// import { data } from './test-data2.js';
// import { data as data2 } from './test-data.js';

export function updateExtensionBadge(text) {
    const value = String(text);
    chrome.runtime.sendMessage({ type: "badgeUpdate", value });
}
export function updateExtensionBadgeOfThisTab(text) {
    const value = String(text);
    chrome.runtime.sendMessage({ type: "badgeUpdateOfThisTab", value });
}

export function onDomReady(callback) {
    if (
        document.readyState === "complete" ||
        (document.readyState !== "loading" && !document.documentElement.doScroll)
    ) {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}

export async function sendMsgToActiveTab(msg) {
    try {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!activeTab.id) return;

        const messages = { ...msg, tabId: activeTab.id };
        return chrome.tabs.sendMessage(activeTab.id, messages);
    } catch (error) {
        console.error('Error in sendMsgToActiveTab:', error);
    }
}

// Promise-based version
export function waitTillDomReady() {
    return new Promise((resolve) => {
        if (
            document.readyState === "complete" ||
            (document.readyState !== "loading" && !document.documentElement.doScroll)
        ) {
            resolve();
        } else {
            document.addEventListener("DOMContentLoaded", resolve);
        }
    });
}


export async function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
export function sleepWithAbort(ms, signal) {
    return new Promise((resolve) => {
        if (signal.aborted) {
            return resolve();
        }

        const timeout = setTimeout(() => {
            signal.removeEventListener("abort", onAbort);
            resolve();
        }, ms);

        function onAbort() {
            clearTimeout(timeout);
            resolve();
        }

        signal.addEventListener("abort", onAbort);
    });
}


/**
 * Set data to chrome storage
 * @param {Object} data Object to store
 */
export async function setData(data) {
    try {
        await chrome.storage.local.set(data);
    } catch { return; }
}

/**
 * Get data from chrome storage
 * @param {string|string[]} keys string or array of strings of the keys to retrieve
 * @returns {Promise<any>} Promise that resolves to the value of the key(s) if found, or undefined if not
 */
export async function getData(keys) {
    try {
        const isTypeString = typeof (keys) === 'string';

        const store = await chrome.storage.local.get(keys)
        if (isTypeString)
            return store[keys];
        return store
    } catch { return; }
}

export function hi() {
    return 'hi';
}

export async function getChromeStorageTotalSizeInMBCached() {
    try {
        let storage = await getData('__storage') || {};
        let totalBytes = 0;
        for (const key in storage) {
            totalBytes += storage[key];
        }
        return parseInt(totalBytes / (1024 * 1024));
    } catch (e) {
        return '';
    }
}

export async function getChromeStorageTotalSizeInMB() {
    try {
        const items = await chrome.storage.local.get(null);
        const totalBytes = JSON.stringify(items).length * 2; // Approximate size in bytes
        return parseInt(totalBytes / (1024 * 1024)); // Convert bytes to MB
    } catch (e) {
        // console.log(e);
        return '';
    }
}

// chrome localstorage delete data by key
export async function deleteChromeStorageDataByKey(key) {
    try {
        let storage = await getData('__storage') || {};
        if (storage[key]) {
            delete storage[key];
            await chrome.storage.local.set({ __storage: storage });
        }
        await chrome.storage.local.remove(key);
    } catch (e) {
        console.log(e);
    }
}

export async function reloadChromeStorageCache() {
    try {
        const items = await chrome.storage.local.get(null);
        let storage = {};
        for (const key in items) {
            if (!key.startsWith('__')) {
                const value = items[key];
                storage[key] = JSON.stringify(value).length * 2;
            }
        }
        await chrome.storage.local.set({ __storage: storage });
    } catch (e) {
        console.log(e);
    }
}

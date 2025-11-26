import { ref, watch, nextTick } from 'vue'
import debounce from 'lodash/debounce'

/**
 * 
 * @param {string} key 
 * @param {any} defaultValue 
 * @param {function} onChange 
 * @returns {ref} 
 */
export function useInputStorageSync(key, { defaultValue = undefined, onChange } = {}) {
    const data = ref(defaultValue)
    let readyToUpdate = false;

    const saveToStorage = debounce(async (value) => {
        console.log('--useInputStorageSync', 'setting', key, value)
        await chrome.storage.local.set({ [key]: value });
    }, 1000, { leading: true, trailing: true });

    // Load initial value
    chrome.storage.local.get(key, async (result) => {
        data.value = result[key] === undefined ? result[key] ?? defaultValue : result[key];
        console.log('useInputStorageSync', 'got', key, result[key])
        await nextTick();
        readyToUpdate = true;
    })

    // for testing
    // nextTick(() => {
    //     readyToUpdate = true;
    // })

    watch(data, async () => {
        if (!readyToUpdate) return;
        await saveToStorage(data.value);
        if (onChange) onChange();
    })

    return data
}
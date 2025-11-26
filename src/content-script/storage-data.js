import { STORAGE_KEYS } from '@/utils/enums.js';

// Default extension settings
const DEFAULT_SETTINGS = {
  [STORAGE_KEYS.IS_ACTIVE]: false,
  [STORAGE_KEYS.TRIGGER_TYPE]: 'visibility',
  [STORAGE_KEYS.SHOT_INTERVAL_SECONDS]: 3,
  [STORAGE_KEYS.SCROLL_PERCENT]: 50,
  [STORAGE_KEYS.FILE_TYPE]: 'png',
  [STORAGE_KEYS.IS_DOWNLOAD_AUTO]: false,
  [STORAGE_KEYS.IS_SAVE_TO_GALLERY]: false,
};


// Export settings as a reactive object that can be imported by other modules
export let settings = {
  ...DEFAULT_SETTINGS,
  isPageActive: false,
};

// -------------------
//Settings
// -------------------
/**
 * Load settings from storage
 * 
 */
export async function loadSettings() {
  let keys = Object.keys(DEFAULT_SETTINGS);
  let res = await chrome.storage.local.get(keys);

  settings = { ...settings, ...res };
  console.log('setting loaded')
}

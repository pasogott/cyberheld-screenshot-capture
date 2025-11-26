import { emailRecords } from './email-extraction.js';
import { showToastOnDom } from './toast-notification.js';
import { copyToClipboard } from '../utils/export.js';

import { settings } from './storage-data.js';

export function init() {
  registerKeyboardShortcuts();
}

//register keyboard shortcuts
function registerKeyboardShortcuts() {
  window.addEventListener('keydown', keydownHandler);
}

function keydownHandler(e) {
  // Ctrl+Shift+1
  if (e.ctrlKey && e.shiftKey && e.code === 'Digit1') {
    console.log('Ctrl+Shift+1 pressed');
    handleShortcutCopyEmail();
  }
}

function handleShortcutCopyEmail() {
  if (!settings.isEnabled) {
    showToastOnDom('Extension is disabled');
    return;
  }

  if (!emailRecords.length) {
    showToastOnDom('No emails found on this page');
    return;
  }

  const text = emailRecords.map(emailRecord => emailRecord.email).join('\n');
  copyToClipboard(text);
  showToastOnDom(`Copied: ${emailRecords.length} emails`);
}

import * as Storage from './storage-data.js';

import { CONTENT_MESSAGES_TYPES, POPUP_MESSAGES_TYPES, BACKGROUND_MESSAGES_TYPES } from '../utils/enums.js';
import { onDomReady, sleep } from '@/utils/clib.js';
import { initScrollDetection } from './dom-change.js';

import { settings } from './storage-data.js';

//
console.log(`--from ${chrome.runtime.getManifest().name}, ${chrome.runtime.getManifest().version}`);
onDomReady(function () {
});

// Initialize the content script
initialize();


async function initialize() {
	try {
		// Load settings from storage first
		await Storage.loadSettings();

		// Initialize all modules in parallel
		await Promise.all([
			initializeModules(),
			setupMessageRouting()
		]);

	} catch (error) {
		console.error('Error initializing extension:', error);
	}
}

/**
 * Initialize all modules 
 */
async function initializeModules() {
	// Initialize each module 
	initScrollDetection();
}

async function reInitializeModules() {
	// Initialize each module 
	initScrollDetection();
}


/**
 * Setup message routing for communication between components
 */
async function setupMessageRouting() {
	// Map message types to their handlers
	const handlers = {
		[CONTENT_MESSAGES_TYPES.RELOAD_SETTINGS]: handleReloadSettings,
	};

	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		// try {
		// 	// Find and execute the appropriate handler
		// 	const handler = handlers[message.type];
		// 	if (!handler) return;

		// 	handler(message, sender, sendResponse);
		// 	return true;
		// } catch (error) {
		// 	console.error('Error handling message:', error);
		// }

		if (request.type == CONTENT_MESSAGES_TYPES.PAGE_ACTIVE_SET) {
			settings.isPageActive = request.value;
			reInitializeModules();
			return;
		}

		if (request.type == CONTENT_MESSAGES_TYPES.PAGE_ACTIVE_CHECK) {
			sendResponse({ value: settings.isPageActive });
			return;
		}

		if (request.type == CONTENT_MESSAGES_TYPES.RELOAD_SETTINGS) {
			console.log('Reloading settings')
			sleep(1000).then(async () => {
				await Storage.loadSettings();
				reInitializeModules();
			})
			return;
		}
	});
};



/**
 * Handle request to reload settings
 */
async function handleReloadSettings(message, sender, sendResponse) {
	await Storage.loadSettings();

}







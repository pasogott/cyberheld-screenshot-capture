export const CONTENT_MESSAGES_TYPES = {
    RELOAD_SETTINGS: 'reloadSettings',
    GET_EMAILS: 'getEmails',
    ADD_CURRENT_GSPR_PAGE: 'addCurrentGsprPage',
    SAVE_SELECTED_EMAILS: 'saveSelectedEmails',
    PAGE_ACTIVE_CHECK: 'pageActiveCheck',
    PAGE_ACTIVE_SET: 'pageActiveSet',
};

export const POPUP_MESSAGES_TYPES = {
}

export const BACKGROUND_MESSAGES_TYPES = {
    UPDATE_BADGE: 'updateBadge',
    TAKE_SCREENSHOT: 'takeScreenshot',

}

export const DASHBOARD_MESSAGES_TYPES = {
    CHECKING_AUTO_VISIT_RUNNING: 'checkingAutoVisitRunning',
    AUTO_VISIT_EMAILS: 'autoVisitEmails',
}

export const STORAGE_KEYS = {
    // Screenshot automation settings
    IS_ACTIVE: 'is_active',
    TRIGGER_TYPE: 'trigger_type', //["visibility","scroll"]
    SHOT_INTERVAL_SECONDS: 'shot_interval_seconds',
    SCROLL_PERCENT: 'scroll_percent',
    FILE_TYPE: 'filetype', // ["png","jpg"]
    IS_DOWNLOAD_AUTO: 'is_download_auto',
    IS_SAVE_TO_GALLERY: 'is_save_to_gallery',
    AUTO_DELETE_DURATION_IN_DAYS: 'auto_delete_duration_in_days',
    // 
    USER_NAME: 'user_name',
    IS_KEYBOARD_SHORTCUT: 'isKeyboardShortcut',
    FONT_SIZE: 'fontsize',
    BG_COLOR: 'bg_color',
    TEXT_COLOR: 'text_color',
    SHOW_NAME: 'show_name',
    SHOW_TIME: 'show_time',
    SHOW_URL: 'show_url',
};


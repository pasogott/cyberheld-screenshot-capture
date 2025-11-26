export async function getConfig() {
    let res = await chrome.storage.local.get(['user_name', 'isKeyboardShortcut', 'fontsize', 'bg_color', 'text_color', 'filetype', 'show_name', 'show_time', 'show_url'])
    let config = {
        username: res.user_name,
        format: res.filetype,
        fontSize: res.fontsize,
        textColor: res.text_color,
        backgroundColor: res.bg_color,
        showName: res.show_name,
        showTime: res.show_time,
        showUrl: res.show_url,
    }
    if (config.fontSize) {
        config.fontSize = parseInt(config.fontSize)
    }
    return config
}
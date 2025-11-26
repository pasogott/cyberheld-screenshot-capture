import { getConfig } from "@/utils/storage.js";

// Global configuration for styling and layout
let SCREENSHOT_CONFIG = {
    username: '',
    format: 'png',
    fontSize: 16,
    margin: 20,
    lineSpacing: 6,
    textColor: 'black',
    backgroundColor: 'white',
    fontFamily: 'monospace',
    filename: 'screenshot_with_info',
    showName: true,
    showTime: true,
    showUrl: true,
};

// load config
getConfig().then(config => {
    SCREENSHOT_CONFIG = { ...SCREENSHOT_CONFIG, ...config }
})


/**
 * Splits text into multiple lines to fit within a max width.
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {string} text - The text to split.
 * @param {number} maxWidth - The maximum width for a line of text.
 * @returns {string[]} An array of strings, each representing a line of text.
 */
function splitTextByWidth(ctx, text, maxWidth) {
    const lines = [];
    let start = 0;
    while (start < text.length) {
        let end = text.length;
        while (ctx.measureText(text.slice(start, end)).width > maxWidth) {
            end--;
        }
        if (end === start) {
            // Failsafe: force break to avoid infinite loop
            end = start + 1;
        }
        lines.push(text.slice(start, end));
        start = end;
    }
    return lines;
}

/**
 * Creates and prepares a canvas with the screenshot.
 * @param {HTMLImageElement} img - The screenshot image.
 * @param {number} dpr - The device pixel ratio.
 * @param {number} extraHeight - The extra height needed for the text.
 * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}} The canvas and its 2D context.
 */
function setupCanvas(img, dpr, extraHeight) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width * dpr;
    canvas.height = img.height * dpr + extraHeight;
    canvas.style.width = `${img.width}px`;
    canvas.style.height = `${img.height + extraHeight / dpr}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { canvas, ctx };
}

/**
 * Draws the text and metadata onto the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {HTMLImageElement} img - The screenshot image.
 * @param {string[]} fullTextLines - The URL, split into lines.
 */
function drawTextAndMetadata(ctx, img, fullTextLines) {
    const { textColor, backgroundColor, margin, fontSize, fontFamily, lineSpacing } = SCREENSHOT_CONFIG;
    const lineHeight = fontSize + lineSpacing;
    const textBgHeight = lineHeight * (fullTextLines.length + 1);

    // Draw text background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, img.height, img.width, textBgHeight);

    // Prepare for text drawing
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px ${fontFamily}`;

    // Draw fullTextLines
    fullTextLines.forEach((line, i) => {
        ctx.fillText(line, margin, img.height + lineHeight * (i + 1));
    });
}


// ////////////
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function processScreenshot2(screenshotUrl) {
    const img = await loadImage(screenshotUrl);

    const { fontSize, fontFamily, margin, lineSpacing } = SCREENSHOT_CONFIG;
    const dpr = window.devicePixelRatio || 1;
    const lineHeight = fontSize + lineSpacing;

    const name = `Name: ${SCREENSHOT_CONFIG.username || ""}`;
    const timestamp = `Time (UTC): ${new Date().toISOString()}`;
    const urlText = `URL: ${window.location.href}`;

    const fullText = [];
    if (SCREENSHOT_CONFIG.showName) fullText.push(name);
    if (SCREENSHOT_CONFIG.showTime) fullText.push(timestamp);
    if (SCREENSHOT_CONFIG.showUrl) fullText.push(urlText);

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.font = `${fontSize * dpr}px ${fontFamily}`;
    const maxTextWidth = img.width * dpr - margin * 2;

    const fullTextLines = [];
    for (const line of fullText) {
        const lines = splitTextByWidth(tempCtx, line, maxTextWidth);
        fullTextLines.push(...lines);
    }

    const extraHeight = lineHeight * dpr * (fullTextLines.length + 1);

    const { canvas, ctx } = setupCanvas(img, dpr, extraHeight);

    // Draw screenshot image
    ctx.drawImage(img, 0, 0, img.width, img.height);

    drawTextAndMetadata(ctx, img, fullTextLines);

    // saveCanvasAsImage(canvas);

    // don't save here, just return the canvas
    return canvas;
}

// usage example:
// const canvas = await processScreenshot('https://example.com/screenshot.png');


export async function handleProcessScreenshot(imageUri, config = {}) {
    SCREENSHOT_CONFIG = { ...SCREENSHOT_CONFIG, ...config };

    let canvas = await processScreenshot2(imageUri);
    const imageURI = canvas.toDataURL(`image/${SCREENSHOT_CONFIG.format}`);

    return imageURI
}
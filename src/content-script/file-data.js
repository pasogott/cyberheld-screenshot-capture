// prepare json data

export function prepareInfoData(uuid, filename, timestamp) {
    const viewportContent = getViewportContent();
    const scroll = {
        x: window.scrollX,
        y: window.scrollY
    }
    const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
    }
    return {
        uuid,
        image_filename: filename,
        timestamp,
        domain: window.location.hostname,
        url: window.location.href,
        viewport,
        scroll,
        visibleText: viewportContent.text,
        visibleHTML: viewportContent.html
    }


}

function getViewportContent(element = document.body) {
    let visibleText = '';

    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.bottom > 0 &&
            rect.right > 0 &&
            rect.top < window.innerHeight &&
            rect.left < window.innerWidth;
    }

    function isVisible(el) {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            isInViewport(el);
    }

    function traverse(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.trim() !== '' && isVisible(node.parentElement)) {
                visibleText += node.textContent.trim() + ' ';
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (isVisible(node)) {
                node.childNodes.forEach(traverse);
            }
        }
    }

    function cloneVisible(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.trim() !== '' && isVisible(node.parentElement)) {
                return document.createTextNode(node.textContent);
            }
            return null;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (!isVisible(node)) return null;

            const clone = node.cloneNode(false);
            node.childNodes.forEach(child => {
                const childClone = cloneVisible(child);
                if (childClone) clone.appendChild(childClone);
            });
            return clone;
        }
        return null;
    }

    traverse(element);
    const visibleClone = cloneVisible(element);
    const visibleHTML = visibleClone ? visibleClone.outerHTML : '';

    return {
        text: visibleText.trim(),
        html: visibleHTML
    };
}

// Usage:
// const viewportContent = getViewportContent();
// console.log(viewportContent.text);
// console.log(viewportContent.html);

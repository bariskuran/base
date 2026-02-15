import { DEFAULT_REM_SETTINGS } from "../../../constants/DEFAULT_REM_SETTINGS";

let __initialFontStyleInjected = false;

function getViewportWidth() {
    const docEl = document.documentElement;
    return Math.round(window.innerWidth || docEl.clientWidth || 0);
}

function pickHtmlFontSizePx(width, remSettings) {
    let picked = null;

    for (let i = 0; i < remSettings.length; i++) {
        const [min, max, value] = remSettings[i];
        if (width >= min && width <= max) picked = value;
    }

    if (picked) return picked;
    const firstMin = remSettings[0]?.[0];
    const firstVal = remSettings[0]?.[2];
    const lastVal = remSettings[remSettings.length - 1]?.[2];

    if (typeof firstMin === "number" && width < firstMin) return firstVal || "1px";
    return lastVal || "1px";
}

export function injectInitialRemAndBodyFontStyle(remSettings = DEFAULT_REM_SETTINGS) {
    if (__initialFontStyleInjected) return;
    if (typeof document === "undefined") return;

    const width = getViewportWidth();
    const htmlFontSize = pickHtmlFontSizePx(width, remSettings);

    const style = document.createElement("style");
    style.setAttribute("data-initial-rem-style", "1");
    style.textContent = `
    html { font-size: ${htmlFontSize}; }
    body { font-size: 14rem; }
  `;

    document.head.appendChild(style);
    __initialFontStyleInjected = true;
}

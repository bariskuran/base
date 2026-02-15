import { colorConverter } from "../colorConverter";

export const colorTinter = (hex = "#f00", percent = 100) => {
    let [r, g, b] = colorConverter(hex).rgbArray;

    percent = Math.min(100, Math.max(0, percent));
    percent = 100 - percent;

    r = Math.round(r + (255 - r) * (percent / 100));
    g = Math.round(g + (255 - g) * (percent / 100));
    b = Math.round(b + (255 - b) * (percent / 100));

    const newHex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");

    return `#${newHex}`;
};

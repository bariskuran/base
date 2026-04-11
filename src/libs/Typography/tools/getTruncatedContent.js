const toPlainText = (content) => {
    if (content == null) return "";
    if (typeof content === "string" || typeof content === "number") return String(content);
    return null;
};

const getLineHeightPx = (computedStyle, fallbackFontSize = 16) => {
    const raw = computedStyle.lineHeight;

    if (!raw || raw === "normal") {
        return fallbackFontSize * 1.2;
    }

    if (raw.endsWith("px")) {
        return parseFloat(raw);
    }

    const parsed = parseFloat(raw);
    if (!Number.isNaN(parsed)) {
        return parsed * fallbackFontSize;
    }

    return fallbackFontSize * 1.2;
};

const getAvailableWidth = (sourceEl) => {
    if (!sourceEl) return 0;

    const parent = sourceEl.parentElement;
    const sourceRect = sourceEl.getBoundingClientRect();

    // Öncelik parent constraint
    if (parent) {
        const parentStyle = window.getComputedStyle(parent);
        const parentRect = parent.getBoundingClientRect();

        const paddingLeft = parseFloat(parentStyle.paddingLeft) || 0;
        const paddingRight = parseFloat(parentStyle.paddingRight) || 0;

        const parentContentWidth = parentRect.width - paddingLeft - paddingRight;

        if (parentContentWidth > 0) {
            return Math.floor(parentContentWidth);
        }
    }

    // fallback
    return Math.floor(sourceRect.width);
};

const applyMeasurementStyles = (el, sourceStyle, widthPx, clamp) => {
    Object.assign(el.style, {
        position: "absolute",
        left: "-999999px",
        top: "0",
        zIndex: "-1",
        pointerEvents: "none",
        visibility: "hidden",
        boxSizing: "border-box",

        width: `${widthPx}px`,
        minWidth: `${widthPx}px`,
        maxWidth: `${widthPx}px`,

        margin: "0",
        padding: "0",
        border: "0",

        font: sourceStyle.font,
        fontFamily: sourceStyle.fontFamily,
        fontSize: sourceStyle.fontSize,
        fontWeight: sourceStyle.fontWeight,
        fontStyle: sourceStyle.fontStyle,
        letterSpacing: sourceStyle.letterSpacing,
        lineHeight: sourceStyle.lineHeight,
        textTransform: sourceStyle.textTransform,
        textIndent: sourceStyle.textIndent,

        whiteSpace: clamp > 1 ? "normal" : "nowrap",
        wordBreak: sourceStyle.wordBreak,
        overflowWrap: sourceStyle.overflowWrap,

        display: "block",
        overflow: "hidden",
    });
};

const doesTextFit = ({ el, text, suffix, clamp, maxHeight }) => {
    el.textContent = text + suffix;

    if (clamp <= 1) {
        return el.scrollWidth <= el.clientWidth + 0.5;
    }

    return el.scrollHeight <= maxHeight + 0.5;
};

const findCutIndexByWord = (text, preferredIndex) => {
    if (!text || preferredIndex <= 0) return 0;
    if (preferredIndex >= text.length) return text.length;

    const sliced = text.slice(0, preferredIndex + 1);
    const lastSpace = Math.max(
        sliced.lastIndexOf(" "),
        sliced.lastIndexOf("\n"),
        sliced.lastIndexOf("\t"),
    );

    if (lastSpace <= 0) return preferredIndex;
    return lastSpace;
};

export const getTruncatedContent = ({
    ref,
    content,
    clamp = 1,
    suffix = "...",
    truncateBy = "word",
}) => {
    const plainText = toPlainText(content);
    if (plainText == null) return null;
    if (!ref?.current) return null;

    const sourceEl = ref.current;
    const widthPx = getAvailableWidth(sourceEl);

    if (!widthPx || widthPx <= 0) {
        return plainText;
    }

    const sourceStyle = window.getComputedStyle(sourceEl);
    const lineHeightPx = getLineHeightPx(sourceStyle, parseFloat(sourceStyle.fontSize) || 16);
    const maxHeight = lineHeightPx * Math.max(1, clamp);

    const measureEl = document.createElement("div");
    document.body.appendChild(measureEl);

    try {
        applyMeasurementStyles(measureEl, sourceStyle, widthPx, clamp);

        measureEl.textContent = plainText;
        const fullFits =
            clamp <= 1
                ? measureEl.scrollWidth <= measureEl.clientWidth + 0.5
                : measureEl.scrollHeight <= maxHeight + 0.5;

        if (fullFits) {
            return plainText;
        }

        let low = 0;
        let high = plainText.length;
        let best = 0;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);

            const fits = doesTextFit({
                el: measureEl,
                text: plainText.slice(0, mid),
                suffix,
                clamp,
                maxHeight,
            });

            if (fits) {
                best = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        let cutIndex = best;

        if (truncateBy === "word") {
            const wordIndex = findCutIndexByWord(plainText, best);
            if (wordIndex > 0) {
                cutIndex = wordIndex;
            }
        }

        let finalText = plainText.slice(0, cutIndex).trimEnd();

        while (finalText.length > 0) {
            const fits = doesTextFit({
                el: measureEl,
                text: finalText,
                suffix,
                clamp,
                maxHeight,
            });

            if (fits) break;
            finalText = finalText.slice(0, -1).trimEnd();
        }

        return finalText + suffix;
    } finally {
        document.body.removeChild(measureEl);
    }
};

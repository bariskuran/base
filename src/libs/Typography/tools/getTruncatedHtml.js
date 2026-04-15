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

    const rect = sourceEl.getBoundingClientRect();
    const style = window.getComputedStyle(sourceEl);

    const paddingLeft = parseFloat(style.paddingLeft) || 0;
    const paddingRight = parseFloat(style.paddingRight) || 0;

    const contentWidth = rect.width - paddingLeft - paddingRight;

    return Math.max(0, Math.floor(contentWidth));
};

const createMeasurementRoot = ({ sourceEl, widthPx, clamp }) => {
    const cs = window.getComputedStyle(sourceEl);

    const root = document.createElement(sourceEl.tagName.toLowerCase());

    Object.assign(root.style, {
        position: "absolute",
        left: "-999999px",
        top: "0",
        zIndex: "-1",
        pointerEvents: "none",
        visibility: "hidden",
        boxSizing: "border-box",

        margin: "0",
        padding: "0",
        border: "0",

        width: `${widthPx}px`,
        minWidth: `${widthPx}px`,
        maxWidth: `${widthPx}px`,

        font: cs.font,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontStyle: cs.fontStyle,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform,
        textIndent: cs.textIndent,
        textAlign: cs.textAlign,
        color: cs.color,

        whiteSpace: clamp > 1 ? "normal" : "nowrap",
        wordBreak: cs.wordBreak,
        overflowWrap: cs.overflowWrap,

        overflow: "hidden",
        display: "block",
    });

    root.innerHTML = sourceEl.innerHTML;

    return root;
};

const getTextNodes = (root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];

    let current = walker.nextNode();
    while (current) {
        nodes.push(current);
        current = walker.nextNode();
    }

    return nodes;
};

const getGraphemes = (text = "") => Array.from(text);

const getTotalTextLength = (root) => {
    const textNodes = getTextNodes(root);
    return textNodes.reduce((sum, node) => sum + getGraphemes(node.textContent || "").length, 0);
};

const removeNodesAfter = (root, startNode) => {
    const range = document.createRange();
    range.setStartAfter(startNode);
    range.setEnd(root, root.childNodes.length);
    range.deleteContents();
};

const truncateTreeAtIndex = (root, cutIndex, suffix) => {
    const textNodes = getTextNodes(root);

    if (textNodes.length === 0) {
        root.textContent = suffix;
        return;
    }

    if (cutIndex <= 0) {
        root.textContent = suffix;
        return;
    }

    let consumed = 0;

    for (let i = 0; i < textNodes.length; i += 1) {
        const node = textNodes[i];
        const originalText = node.textContent || "";
        const graphemes = getGraphemes(originalText);
        const len = graphemes.length;
        const nextConsumed = consumed + len;

        if (cutIndex < nextConsumed) {
            const localCount = cutIndex - consumed;
            const kept = graphemes.slice(0, localCount).join("").replace(/\s+$/u, "");

            node.textContent = kept + suffix;

            const range = document.createRange();
            range.setStart(node, node.textContent.length);
            range.setEnd(root, root.childNodes.length);
            range.deleteContents();

            return;
        }

        if (cutIndex === nextConsumed) {
            node.textContent = originalText.replace(/\s+$/u, "") + suffix;
            removeNodesAfter(root, node);
            return;
        }

        consumed = nextConsumed;
    }

    // Her ihtimale karşı
    const lastNode = textNodes[textNodes.length - 1];
    if (lastNode) {
        lastNode.textContent = (lastNode.textContent || "").replace(/\s+$/u, "") + suffix;
    }
};

const fits = ({ el, clamp, maxHeight }) => {
    if (clamp <= 1) {
        return el.scrollWidth <= el.clientWidth + 0.5;
    }

    return el.scrollHeight <= maxHeight + 0.5;
};

const buildCandidate = ({ sourceEl, widthPx, clamp, cutIndex, suffix }) => {
    const candidate = createMeasurementRoot({ sourceEl, widthPx, clamp });
    truncateTreeAtIndex(candidate, cutIndex, suffix);
    document.body.appendChild(candidate);
    return candidate;
};

export const getTruncatedHtml = ({ visibleRef, sourceRef, clamp = 1, suffix = "..." }) => {
    const visibleEl = visibleRef?.current;
    const sourceEl = sourceRef?.current;

    if (!visibleEl || !sourceEl) return null;

    const widthPx = getAvailableWidth(visibleEl);
    if (!widthPx || widthPx <= 0) return null;

    const visibleStyle = window.getComputedStyle(visibleEl);
    const lineHeightPx = getLineHeightPx(visibleStyle, parseFloat(visibleStyle.fontSize) || 16);
    const maxHeight = lineHeightPx * Math.max(1, clamp);

    const totalLength = getTotalTextLength(sourceEl);

    if (totalLength <= 0) {
        return {
            isTruncated: false,
            html: sourceEl.innerHTML,
        };
    }

    const fullCandidate = createMeasurementRoot({
        sourceEl,
        widthPx,
        clamp,
    });
    document.body.appendChild(fullCandidate);

    try {
        const fullFits = fits({
            el: fullCandidate,
            clamp,
            maxHeight,
        });

        if (fullFits) {
            return {
                isTruncated: false,
                html: sourceEl.innerHTML,
            };
        }
    } finally {
        document.body.removeChild(fullCandidate);
    }

    let low = 0;
    let high = totalLength;
    let best = 0;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        const candidate = buildCandidate({
            sourceEl,
            widthPx,
            clamp,
            cutIndex: mid,
            suffix,
        });

        try {
            const candidateFits = fits({
                el: candidate,
                clamp,
                maxHeight,
            });

            if (candidateFits) {
                best = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        } finally {
            document.body.removeChild(candidate);
        }
    }

    const finalCandidate = buildCandidate({
        sourceEl,
        widthPx,
        clamp,
        cutIndex: best,
        suffix,
    });

    try {
        return {
            isTruncated: true,
            html: finalCandidate.innerHTML,
        };
    } finally {
        document.body.removeChild(finalCandidate);
    }
};

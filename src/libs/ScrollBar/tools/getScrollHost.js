const getScrollHost = ({ node, body = false }) => {
    if (typeof document === "undefined") return null;
    if (body) return document.documentElement;
    return node?.parentElement || null;
};

export default getScrollHost;

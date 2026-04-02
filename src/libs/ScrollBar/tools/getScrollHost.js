const getScrollHost = (node) => {
    const root = document.getElementById("root");
    let current = node?.parentElement;

    while (current) {
        if (current === root || current === document.body || current === document.documentElement) {
            return root;
        }

        const style = window.getComputedStyle(current);
        const overflowY = style.overflowY;
        const overflowX = style.overflowX;

        const isScrollable =
            ["auto", "scroll", "overlay"].includes(overflowY) ||
            ["auto", "scroll", "overlay"].includes(overflowX);

        if (isScrollable) return current;

        current = current.parentElement;
    }

    return root;
};
export default getScrollHost;

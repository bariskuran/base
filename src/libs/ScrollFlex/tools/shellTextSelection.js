export const lockShellTextSelection = (el) => {
    if (!el) return;
    el.style.userSelect = "none";
    el.style.webkitUserSelect = "none";
    el.style.MozUserSelect = "none";
};

export const unlockShellTextSelection = (el) => {
    if (!el) return;
    el.style.userSelect = "";
    el.style.webkitUserSelect = "";
    el.style.MozUserSelect = "";
};

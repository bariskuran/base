export const scrollLock = (boo) => {
    setTimeout(
        () =>
            document
                .getElementsByTagName("body")[0]
                .setAttribute("style", boo ? "overflow-y:hidden;" : "overflow-y:auto;"),
        0,
    );
};

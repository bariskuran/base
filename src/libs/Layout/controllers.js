const MENU_TRANSITION_MS = 500;
const VALID_HEADER_STATUS = ["extended", "condensed"];

const getLastMapValue = (map) => {
    const values = Array.from(map.values());
    return values.length ? values[values.length - 1] : null;
};

export const createHeaderAmedistController = ({ notify }) => {
    const hiddenSources = new Set();
    const appearanceSources = new Map();
    let menuTimer = null;
    const state = {
        menuStatus: "closed",
        searchValue: "",
        visibleHeaderStatus: "extended",
        extendedHeight: 100,
        condensedHeight: 50,
    };

    const update = (updater) => {
        updater(state);
        notify();
    };

    const clearMenuTimer = () => {
        if (menuTimer != null) clearTimeout(menuTimer);
        menuTimer = null;
    };

    const finishMenuTransition = (status) => {
        clearMenuTimer();
        menuTimer = setTimeout(() => {
            update((draft) => {
                draft.menuStatus = status;
            });
            menuTimer = null;
        }, MENU_TRANSITION_MS);
    };

    const openMenu = () => {
        if (state.menuStatus === "open" || state.menuStatus === "opening") return;
        clearMenuTimer();
        update((draft) => {
            draft.menuStatus = "opening";
        });
        finishMenuTransition("open");
    };

    const closeMenu = () => {
        if (state.menuStatus === "closed" || state.menuStatus === "closing") return;
        clearMenuTimer();
        update((draft) => {
            draft.menuStatus = "closing";
            draft.searchValue = "";
        });
        finishMenuTransition("closed");
    };

    const hideHeader = (source = "manual") => {
        const size = hiddenSources.size;
        hiddenSources.add(source);
        if (hiddenSources.size !== size) notify();
    };

    const showHeader = (source = "manual") => {
        if (hiddenSources.delete(source)) notify();
    };

    const publicActions = {
        openMenu,
        closeMenu,
        toggleMenu: () =>
            state.menuStatus === "open" || state.menuStatus === "opening"
                ? closeMenu()
                : openMenu(),
        setSearchValue: (value) => {
            update((draft) => {
                draft.searchValue = value == null ? "" : String(value);
            });
            if (value) openMenu();
        },
        clearSearchValue: () =>
            update((draft) => {
                draft.searchValue = "";
            }),
        hideHeader,
        showHeader,
    };

    const internalActions = {
        setHeaderStatus: (status) => {
            if (!VALID_HEADER_STATUS.includes(status) || state.visibleHeaderStatus === status)
                return;
            update((draft) => {
                draft.visibleHeaderStatus = status;
            });
        },
        setHeaderHeights: ({ extendedHeight, condensedHeight }) => {
            const nextExtended = Number(extendedHeight) || 100;
            const nextCondensed = Number(condensedHeight) || 50;
            if (state.extendedHeight === nextExtended && state.condensedHeight === nextCondensed)
                return;
            update((draft) => {
                draft.extendedHeight = nextExtended;
                draft.condensedHeight = nextCondensed;
            });
        },
        setHeaderAppearance: (source, appearance) => {
            appearanceSources.delete(source);
            appearanceSources.set(source, appearance || {});
            notify();
        },
        clearHeaderAppearance: (source) => {
            if (appearanceSources.delete(source)) notify();
        },
        hideHeaderFromProp: (hidden) => (hidden ? hideHeader("prop") : showHeader("prop")),
    };

    return {
        getState: () => ({
            ...state,
            headerStatus: hiddenSources.size ? "hidden" : state.visibleHeaderStatus,
            headerAppearance: getLastMapValue(appearanceSources),
        }),
        getPublicState: () => ({
            menuStatus: state.menuStatus,
            searchValue: state.searchValue,
            headerStatus: hiddenSources.size ? "hidden" : state.visibleHeaderStatus,
            extendedHeight: state.extendedHeight,
            condensedHeight: state.condensedHeight,
            ...publicActions,
        }),
        ...publicActions,
        ...internalActions,
    };
};

export const createBasicLayoutController = () => ({
    getState: () => ({}),
    getPublicState: () => ({}),
});

export const createFooterAmedistController = ({ notify }) => {
    const hiddenSources = new Set();

    const hideFooter = (source = "manual") => {
        const size = hiddenSources.size;
        hiddenSources.add(source);
        if (hiddenSources.size !== size) notify();
    };

    const showFooter = (source = "manual") => {
        if (hiddenSources.delete(source)) notify();
    };

    const getVisible = () => hiddenSources.size === 0;

    return {
        getState: () => ({ visible: getVisible() }),
        getPublicState: () => ({
            visible: getVisible(),
            hideFooter,
            showFooter,
        }),
        hideFooter,
        showFooter,
    };
};

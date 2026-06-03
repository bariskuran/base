export const DEFAULT_PAGE_TITLE = "Design System";

export const resolvePageTitleFromMatches = (matches, fallback = DEFAULT_PAGE_TITLE) =>
    [...matches].reverse().find((m) => m.handle?.pageTitle)?.handle?.pageTitle || fallback;

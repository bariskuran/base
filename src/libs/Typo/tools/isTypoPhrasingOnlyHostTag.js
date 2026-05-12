/** HTML phrasing-content-only hosts: block / flow roots like `<pre>` are invalid inside these. */
const PHRASING_ONLY_HOST_TAGS = new Set(["p", "span", "h1", "h2", "h3", "h4", "h5", "h6"]);

export const isTypoPhrasingOnlyHostTag = (as) =>
    typeof as === "string" && PHRASING_ONLY_HOST_TAGS.has(as.toLowerCase());

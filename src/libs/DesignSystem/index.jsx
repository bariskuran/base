import { lazy as l } from "react";
import Layout from "./Layout";
import code from "./CodeViewer";
import api from "./ApiViewer";
import page from "./Page";
import block from "./Block";
import variant from "./VariantViewer";
import output from "./OutputArea";
import useOutputViewer from "./useOutputViewer";
import { baseStore } from "../@baseStore";

const getShowInternalDs = () => {
    try {
        // This flag is expected to be set by the consumer app via projectSettings.adminSettings.
        return !!baseStore.globalData.get?.()?._adminSettings?.showInternalDs;
    } catch {
        return false;
    }
};

/**
 * Sol menü / route `pageTitle`.
 * - PascalCase bileşen: `<Button>`
 * - SCREAMING_SNAKE / tamamı büyük harf sabit: `COUNTRY_INFORMATION` (<> yok)
 * - Hook / fonksiyon: `useTimer`, `colorGet`
 */
export const formatDsNavLabel = (name) => {
    if (name == null || name === "") return "";
    const s = String(name);
    if (/\s/.test(s)) return s;
    if (/^[A-Z][A-Z0-9_]*$/.test(s)) return s;
    if (/^[A-Z]/.test(s)) return `<${s}>`;
    return s;
};

const publicSitemap = [
    ["How To Setup", undefined, l(() => import("./_dS")), { index: true }],
    ["Button", "button", l(() => import("../Button/_dS"))],
    ["ButtonList", "buttonList", l(() => import("../ButtonList/_dS"))],
    ["byPath", "byPath", l(() => import("../byPath/_dS"))],
    ["cleanFalsyValues", "cleanFalsyValues", l(() => import("../cleanFalsyValues/_dS"))],
    ["colorAlpha", "colorAlpha", l(() => import("../colorAlpha/_dS"))],
    ["colorWcagMatch", "colorWcagMatch", l(() => import("../colorWcagMatch/_dS"))],
    ["colorWcagValue", "colorWcagValue", l(() => import("../colorWcagValue/_dS"))],
    ["colorConverter", "colorConverter", l(() => import("../colorConverter/_dS"))],
    ["colorFind", "colorFind", l(() => import("../colorFind/_dS"))],
    ["colorGet", "colorGet", l(() => import("../colorGet/_dS"))],
    ["colorGet3dShadow", "colorGet3dShadow", l(() => import("../colorGet3DShadow/_dS"))],
    [
        "colorPickHigherContrast",
        "colorPickHigherContrast",
        l(() => import("../colorPickHigherContrast/_dS")),
    ],
    ["colorShader", "colorShader", l(() => import("../colorShader/_dS"))],
    ["colorTinter", "colorTinter", l(() => import("../colorTinter/_dS"))],
    ["copyToClipboard", "copyToClipboard", l(() => import("../copyToClipboard/_dS"))],
    ["debouncedFunction", "debouncedFunction", l(() => import("../debouncedFunction/_dS"))],
    ["deepMerge", "deepMerge", l(() => import("../deepMerge/_dS"))],
    ["delayedFunction", "delayedFunction", l(() => import("../delayedFunction/_dS"))],
    ["downloadAsCsv", "downloadAsCsv", l(() => import("../downloadAsCsv/_dS"))],
    ["findDifferences", "findDifferences", l(() => import("../findDifferences/_dS"))],
    ["Flag", "flag", l(() => import("../@Flag/_dS"))],
    ["flagLibrary", "flagLibrary", l(() => import("../@Flag/_dSLibrary"))],
    ["FloatingUi", "floatingUi", l(() => import("../FloatingUi/_dS"))],
    ["Flex", "flex", l(() => import("../Flex/_dS"))],
    ["generateRandom", "generateRandom", l(() => import("../generateRandom/_dS"))],
    ["getText", "getText", l(() => import("../getText/_dS"))],
    ["getTimeDiff", "getTimeDiff", l(() => import("../getTimeDiff/_dS"))],
    ["Icon", "icon", l(() => import("../@Icon/_dS"))],
    ["iconLibrary", "iconLibrary", l(() => import("../@Icon/_dSLibrary"))],
    ["isArray", "isArray", l(() => import("../isArray/_dS"))],
    [
        "isArrayOrPlainObject",
        "isArrayOrPlainObject",
        l(() => import("../isArrayOrPlainObject/_dS")),
    ],
    ["isDeepEqual", "isDeepEqual", l(() => import("../isDeepEqual/_dS"))],
    ["useDeepEqual", "useDeepEqual", l(() => import("../useDeepEqual/_dS"))],
    ["isNumber", "isNumber", l(() => import("../isNumber/_dS"))],
    ["isPlainObject", "isPlainObject", l(() => import("../isPlainObject/_dS"))],
    ["notifier", "notifier", l(() => import("../notifier/_dS"))],
    ["PopOver", "popOver", l(() => import("../PopOver/_dS"))],
    ["PopConfirm", "popConfirm", l(() => import("../PopConfirm/_dS"))],
    ["PopUp", "popUp", l(() => import("../PopUp/_dS"))],
    ["PopTip", "popTip", l(() => import("../PopTip/_dS"))],
    ["pushAsSorted", "pushAsSorted", l(() => import("../pushAsSorted/_dS"))],
    ["queryConverter", "queryConverter", l(() => import("../queryConverter/_dS"))],
    ["ScrollBar", "scrollBar", l(() => import("../ScrollBar/_dS"))],
    ["ScrollFlex", "scrollFlex", l(() => import("../ScrollFlex/_dS"))],
    ["scrollLock", "scrollLock", l(() => import("../scrollLock/_dS"))],
    ["isShallowEqual", "isShallowEqual", l(() => import("../isShallowEqual/_dS"))],
    ["sleep", "sleep", l(() => import("../sleep/_dS"))],
    ["sortBy", "sortBy", l(() => import("../sortBy/_dS"))],
    ["Space", "space", l(() => import("../Space/_dS"))],
    ["stringCaseConverter", "stringCaseConverter", l(() => import("../stringCaseConverter/_dS"))],
    ["typeOf", "typeOf", l(() => import("../typeOf/_dS"))],
    ["Typo", "typo", l(() => import("../Typo/_dS"))],
    ["useBaseEffect", "useBaseEffect", l(() => import("../useBaseEffect/_dS"))],
    ["useCheckOverflow", "useCheckOverflow", l(() => import("../useCheckOverflow/_dS"))],
    [
        "useDebouncedFunction",
        "useDebouncedFunction",
        l(() => import("../useDebouncedFunction/_dS")),
    ],
    ["useDebouncedValue", "useDebouncedValue", l(() => import("../useDebouncedValue/_dS"))],
    ["useEffectAfterMount", "useEffectAfterMount", l(() => import("../useEffectAfterMount/_dS"))],
    ["useEventListener", "useEventListener", l(() => import("../useEventListener/_dS"))],
    ["useImagePreloader", "useImagePreloader", l(() => import("../useImagePreloader/_dS"))],
    ["useImagesReady", "useImagesReady", l(() => import("../useImagesReady/_dS"))],
    [
        "useManageSearchParams",
        "useManageSearchParams",
        l(() => import("../useManageSearchParams/_dS")),
    ],
    ["useMouseXY", "useMouseXY", l(() => import("../useMouseXY/_dS"))],
    ["useObserver", "useObserver", l(() => import("../useObserver/_dS"))],
    ["usePrevious", "usePrevious", l(() => import("../usePrevious/_dS"))],
    ["useScrollThrottle", "useScrollThrottle", l(() => import("../useScrollThrottle/_dS"))],
    ["useScrollTopLeft", "useScrollTopLeft", l(() => import("../useScrollTopLeft/_dS"))],
    [
        "useScrollWidthHeight",
        "useScrollWidthHeight",
        l(() => import("../useScrollWidthHeight/_dS")),
    ],
    ["useTimer", "useTimer", l(() => import("../useTimer/_dS"))],
    ["useLinkIntoView", "useLinkIntoView", l(() => import("../useLinkIntoView/_dS"))],
    ["useDelayedFunction", "useDelayedFunction", l(() => import("../useDelayedFunction/_dS"))],
    [
        "COUNTRY_INFORMATION",
        "countryInformation",
        l(() => import("../../constants/COUNTRY_INFORMATION_dS")),
    ],
    ["LANGUAGES", "languages", l(() => import("../../constants/LANGUAGES_dS"))],
    [
        "LOWER_CASE_ALPHABET",
        "lowerCaseAlphabet",
        l(() => import("../../constants/LOWER_CASE_ALPHABET_dS")),
    ],
    ["NUMBERS", "numbers", l(() => import("../../constants/NUMBERS_dS"))],
    ["SYMBOLS", "symbols", l(() => import("../../constants/SYMBOLS_dS"))],
    [
        "UPPER_CASE_ALPHABET",
        "upperCaseAlphabet",
        l(() => import("../../constants/UPPER_CASE_ALPHABET_dS")),
    ],
    ["baseDate", "baseDate", l(() => import("../@baseDate/_dS"))],
];

const internalSitemap = [
    ["columnTypes", "columnTypes", l(() => import("../columnTypes/_dS"))],
    ["cssNormalizeSize", "cssNormalizeSize", l(() => import("../cssNormalizeSize/_dS"))],
    ["cssSpacingResolver", "cssSpacingResolver", l(() => import("../cssSpacingResolver/_dS"))],
    ["NestedBaseUi", "nestedBaseUi", l(() => import("../NestedBaseUi/_dS"))],
];

/** Okuma anında `globalData._adminSettings` hazır olmalı — modül import’unda sabitleme yok */
export const getSitemap = () => [...publicSitemap, ...(getShowInternalDs() ? internalSitemap : [])];

export const getDesignSystemRoutes = () => [
    {
        path: "design-system",
        element: <Layout />,
        children: [
            ...getSitemap().map(([name, path, El, props]) => ({
                path,
                element: <El />,
                ...props,
                handle: {
                    pageTitle: formatDsNavLabel(name),
                },
            })),
        ],
    },
];

const Ds = {
    code,
    variant,
    api,
    page,
    block,
    output,
    useOutputViewer,
    layout: Layout,
};
export default Ds;

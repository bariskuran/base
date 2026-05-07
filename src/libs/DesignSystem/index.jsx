import { lazy as l } from "react";
import Layout from "./Layout";
import code from "./CodeViewer";
import api from "./ApiViewer";
import page from "./Page";
import block from "./Block";
import variant from "./VariantViewer";

export const sitemap = [
    ["How To Setup", undefined, l(() => import("./_dS")), { index: true }],
    ["Button", "button", l(() => import("../Button/_dS"))],
    ["ButtonList", "buttonList", l(() => import("../ButtonList/_dS"))],
    ["byPath", "byPath", l(() => import("../byPath/_dS"))],
    ["clearUndefinedDeep", "clearUndefinedDeep", l(() => import("../clearUndefinedDeep/_dS"))],
    ["colorAlpha", "colorAlpha", l(() => import("../colorAlpha/_dS"))],
    ["colorWcagMatch", "colorWcagMatch", l(() => import("../colorWcagMatch/_dS"))],
    ["colorWcagValue", "colorWcagValue", l(() => import("../colorWcagValue/_dS"))],
    ["colorConverter", "colorConverter", l(() => import("../colorConverter/_dS"))],
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
    ["getTimeDifference", "getTimeDifference", l(() => import("../getTimeDifference/_dS"))],
    ["Icon", "icon", l(() => import("../@Icon/_dS"))],
    ["iconLibrary", "iconLibrary", l(() => import("../@Icon/_dSLibrary"))],
    ["isContainer", "isContainer", l(() => import("../isContainer/_dS"))],
    ["isEqual", "isEqual", l(() => import("../isEqual/_dS"))],
    ["isNumber", "isNumber", l(() => import("../isNumber/_dS"))],
    ["isPlainObject", "isPlainObject", l(() => import("../isPlainObject/_dS"))],
    ["Popover", "popover", l(() => import("../Popover/_dS"))],
    ["PopTip", "popTip", l(() => import("../PopTip/_dS"))],
    ["pushAsSorter", "pushAsSorter", l(() => import("../pushAsSorted/_dS"))],
    ["queryConverter", "queryConverter", l(() => import("../queryConverter/_dS"))],
    ["ScrollBar", "scrollBar", l(() => import("../ScrollBar/_dS"))],
    ["ScrollFlex", "scrollFlex", l(() => import("../ScrollFlex/_dS"))],
    ["scrollLock", "scrollLock", l(() => import("../scrollLock/_dS"))],
    ["shallowEqual", "shallowEqual", l(() => import("../shallowEqual/_dS"))],
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
];

export const designSystemRoutes = [
    {
        path: "design-system",
        element: <Layout />,
        children: [
            ...sitemap.map(([name, path, El, props]) => ({
                path,
                element: <El />,
                ...props,
                handle: {
                    pageTitle: name,
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
    layout: Layout,
};
export default Ds;

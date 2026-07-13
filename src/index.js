/* 3rd PARTIES */
export {
    Children,
    cloneElement,
    createContext,
    createElement,
    createRoot,
    default as React,
    ErrorBoundary,
    forwardRef,
    Fragment,
    hydrateRoot,
    isValidElement,
    lazy,
    memo,
    Offscreen,
    Profiler,
    StrictMode,
    Suspense,
    SuspenseList,
    use,
    useActionState,
    useCallback,
    useContext,
    useDeferredValue,
    useEffect,
    useFormStatus,
    useId,
    useImperativeHandle,
    useLayoutEffect,
    useMemo,
    useOptimistic,
    useReducer,
    useRef,
    useState,
    useSyncExternalStore,
    useTransition,
} from "react";
export {
    createGlobalStyle,
    css,
    default as styled,
    keyframes,
    ThemeProvider,
    useTheme,
    withTheme,
} from "styled-components";
export * as RRD from "react-router-dom";
export {
    BrowserRouter,
    RouterProvider,
    createBrowserRouter,
    Link,
    Navigate,
    NavLink,
    Outlet,
    Route,
    Routes,
    useLocation,
    useMatch,
    useNavigate,
    useNavigation,
    useParams,
    useSearchParams,
} from "react-router-dom";
export { createPortal } from "react-dom";

/* TAILOR MADE */
export { baseDate, getNow } from "./libs/baseDate";
export { baseFetch } from "./libs/baseFetch";
export { useBaseFetch } from "./libs/useBaseFetch";
export { setLanguage } from "./libs/@Base/GlobalDataProvider/resolveLanguage";
export { getPageRrdInfo } from "./libs/getPageRrdInfo";
export { baseStore } from "./libs/baseStore";
export { baseStore as cs } from "./libs/baseStore";
export { Button } from "./libs/Button";
export { ButtonGroup } from "./libs/ButtonGroup";
export { byPath } from "./libs/byPath";
export { cleanFalsyValues, FALSY_TYPES } from "./libs/cleanFalsyValues";
export {
    THEME_SCALE_KEYS,
    buildScale,
    buildThemeWithScales,
    packTheme,
} from "./libs/COLORS";
export { colorAlpha } from "./libs/colorAlpha";
export { colorConverter } from "./libs/colorConverter";
export { colorFind } from "./libs/colorFind";
export { colorGet } from "./libs/colorGet";
export { colorPickHigherContrast } from "./libs/colorPickHigherContrast";
export { colorShader } from "./libs/colorShader";
export { colorTinter } from "./libs/colorTinter";
export { colorWcagMatch } from "./libs/colorWcagMatch";
export { colorWcagValue } from "./libs/colorWcagValue";
export { columnTypes, COLUMN_SIZES } from "./libs/columnTypes";
export { copyToClipboard } from "./libs/copyToClipboard";
export { COUNTRY_INFORMATION } from "./constants/COUNTRY_INFORMATION";
export { createImageCatalog, getImageCatalog } from "./libs/createImageCatalog";
export { cssNormalizeSize } from "./libs/cssNormalizeSize";
export { cssSpacingResolver } from "./libs/cssSpacingResolver";
export { debouncedFunction } from "./libs/debouncedFunction";
export { deepMerge } from "./libs/deepMerge";
export { default as Base } from "./libs/@Base/index";
export { default as DS } from "./libs/DesignSystem";
export { delayedFunction } from "./libs/delayedFunction";
export { downloadAsCsv } from "./libs/downloadAsCsv";
export { Dropdown } from "./libs/Dropdown";
export { findDifferences } from "./libs/findDifferences";
export { Flag } from "./libs/Flag";
export { Flex } from "./libs/Flex";
export { FloatingUi } from "./libs/FloatingUi";
export { generateRandom } from "./libs/generateRandom";
export { Group } from "./libs/Group";
export { get3DShadow } from "./libs/colorGet3DShadow";
export { getClientData } from "./libs/getClientData";
export { getText, getText as t } from "./libs/getText";
export { getTimeDiff } from "./libs/getTimeDiff";
export { Icon } from "./libs/Icon";
export { Image } from "./libs/Image";
export { Layout } from "./libs/Layout";
export { Visibility } from "./libs/Visibility";
export { isArray } from "./libs/isArray";
export { isArrayOrPlainObject } from "./libs/isArrayOrPlainObject";
export { isDeepEqual } from "./libs/isDeepEqual";
export { isNumber } from "./libs/isNumber";
export { isPlainObject } from "./libs/isPlainObject";
export { isShallowEqual } from "./libs/isShallowEqual";
export { LANGUAGES } from "./constants/LANGUAGES";
export { logReferrers } from "./libs/logReferrers";
export { LOWER_CASE_ALPHABET } from "./constants/LOWER_CASE_ALPHABET";
export { manageSearchParams } from "./libs/manageSearchParams";
export { notifier } from "./libs/notifier";
export { NUMBERS } from "./constants/NUMBERS";
export { PopConfirm } from "./libs/PopConfirm";
export { PopOver } from "./libs/PopOver";
export { PopTip } from "./libs/PopTip";
export { PopUp } from "./libs/PopUp";
export { pushAsSorted } from "./libs/pushAsSorted";
export { queryConverter } from "./libs/queryConverter";
export { ScrollBar } from "./libs/ScrollBar";
export { ScrollFlex } from "./libs/ScrollFlex";
export { scrollLock } from "./libs/scrollLock";
export { sleep } from "./libs/sleep";
export { sortBy } from "./libs/sortBy";
export { Space } from "./libs/Space";
export { stringCaseConverter } from "./libs/stringCaseConverter";
export { default as templateLiteralTo, dedent, splitParagraphs } from "./libs/templateLiteralTo";
export { TemplateLiteral } from "./libs/TemplateLiteral";
export { useCatalogImage } from "./libs/useCatalogImage";
export { SYMBOLS } from "./constants/SYMBOLS";
export { TextArea } from "./libs/TextArea";
export { Table } from "./libs/Table";
export { typeOf } from "./libs/typeOf";
export { Typo, Typography } from "./libs/Typo";
export { TypoAnimated, autoDuration } from "./libs/TypoAnimated";
export { UPPER_CASE_ALPHABET } from "./constants/UPPER_CASE_ALPHABET";
export { useBaseEffect } from "./libs/useBaseEffect";
export { useBaseForm } from "./libs/baseForm";
export { useCheckOverflow } from "./libs/useCheckOverflow";
export { useDebouncedFunction } from "./libs/useDebouncedFunction";
export { useDebouncedValue } from "./libs/useDebouncedValue";
export { useDeepEqual } from "./libs/useDeepEqual";
export { useDelayedFunction } from "./libs/useDelayedFunction";
export { useEffectAfterMount } from "./libs/useEffectAfterMount";
export { useEventListener } from "./libs/useEventListener";
export { useExportData, useExportedData } from "./helpers/useExportedData";
export { useImagePreloader } from "./libs/useImagePreloader";
export { useImagesReady } from "./libs/useImagesReady";
export { useRevealNavItem } from "./libs/useRevealNavItem";
export { useManageSearchParams } from "./libs/useSearchParams";
export { useMouseXY } from "./libs/useMouseXY";
export { useObserver } from "./libs/useObserver";
export { usePrevious } from "./libs/usePrevious";
export { useScrollThrottle } from "./libs/useScrollThrottle";
export { useScrollTopLeft } from "./libs/useScrollTopLeft";
export { useScrollWidthHeight } from "./libs/useScrollWidthHeight";
export { useTimer, getTimersSnapshot } from "./libs/useTimer";
export { Slider } from "./libs/Slider";
export { BlockBuilder } from "./libs/BlockBuilder";
export { Card } from "./libs/Card";
export { CardViewer } from "./libs/CardViewer";

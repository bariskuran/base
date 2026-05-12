/* 3rd PARTIES */
export {
    Activity,
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

/* TAILOR MADE */
export { baseDate, getNow } from "./libs/@baseDate";
export { baseFetch, useBaseFetch } from "./libs/@baseFetch";
export { baseStore } from "./libs/@baseStore";
export { baseStore as cs } from "./libs/@baseStore";
export { byPath } from "./libs/byPath";
export { colorAlpha } from "./libs/colorAlpha";
export { colorFind } from "./libs/colorFind";
export { colorWcagMatch } from "./libs/colorWcagMatch";
export { colorWcagValue } from "./libs/colorWcagValue";
export { colorConverter } from "./libs/colorConverter";
export { colorPickHigherContrast } from "./libs/colorPickHigherContrast";
export { copyToClipboard } from "./libs/copyToClipboard";
export { debouncedFunction } from "./libs/debouncedFunction";
export { deepMerge } from "./libs/deepMerge";
export { default as Base } from "./libs/@Base/index";
export { downloadAsCsv } from "./libs/downloadAsCsv";
export { findDifferences } from "./libs/findDifferences";
export { generateRandom } from "./libs/generateRandom";
export { getClientData } from "./libs/getClientData";
export { getText, getText as t } from "./libs/getText";
export { getTimeDiff } from "./libs/getTimeDiff";
export { Icon } from "./libs/@Icon";
export { isArray } from "./libs/isArray";
export { isArrayOrPlainObject } from "./libs/isArrayOrPlainObject";
export { isDeepEqual } from "./libs/isDeepEqual";
export { isNumber } from "./libs/isNumber";
export { isPlainObject } from "./libs/isPlainObject";
export { logReferrers } from "./libs/logReferrers";
export { LOWER_CASE_ALPHABET } from "./constants/LOWER_CASE_ALPHABET";
export { manageSearchParams } from "./libs/useManageSearchParams/manageSearchParams";
export { NUMBERS } from "./constants/NUMBERS";
export { pushAsSorted } from "./libs/pushAsSorted";
export { queryConverter } from "./libs/queryConverter";
export { scrollLock } from "./libs/scrollLock";
export { isShallowEqual } from "./libs/isShallowEqual";
export { sleep } from "./libs/sleep";
export { sortBy } from "./libs/sortBy";
export { stringCaseConverter } from "./libs/stringCaseConverter";
export { SYMBOLS } from "./constants/SYMBOLS";
export { typeOf } from "./libs/typeOf";
export { UPPER_CASE_ALPHABET } from "./constants/UPPER_CASE_ALPHABET";
export { useBaseForm } from "./libs/@baseForm";
export { useDebouncedFunction } from "./libs/useDebouncedFunction";
export { useDebouncedValue } from "./libs/useDebouncedValue";
export { useEffectAfterMount } from "./libs/useEffectAfterMount";
export { useEventListener } from "./libs/useEventListener";
export { useImagePreloader } from "./libs/useImagePreloader";
export { useImagesReady } from "./libs/useImagesReady";
export { useLinkIntoView } from "./libs/useLinkIntoView";
export { useManageSearchParams } from "./libs/useManageSearchParams";
export { useMouseXY } from "./libs/useMouseXY";
export { useObserver } from "./libs/useObserver";
export { usePrevious } from "./libs/usePrevious";
export { useScrollThrottle } from "./libs/useScrollThrottle";
export { useScrollTopLeft } from "./libs/useScrollTopLeft";
export { useScrollWidthHeight } from "./libs/useScrollWidthHeight";
export { useTimer, getTimersSnapshot } from "./libs/useTimer";
export { useDeepEqual } from "./libs/useDeepEqual";
export { useBaseEffect } from "./libs/useBaseEffect";
export { colorShader } from "./libs/colorShader";
export { colorTinter } from "./libs/colorTinter";
export { clearUndefinedDeep } from "./libs/clearUndefinedDeep";
export { Button } from "./libs/Button";
export { FloatingUi } from "./libs/FloatingUi";
export { PopTip } from "./libs/PopTip";
export { Popover } from "./libs/Popover";
export { delayedFunction } from "./libs/delayedFunction";
export { ButtonList } from "./libs/ButtonList";
export { ScrollFlex } from "./libs/ScrollFlex";
export { ScrollBar } from "./libs/ScrollBar";
export { useCheckOverflow } from "./libs/useCheckOverflow";
export { useExportData, useExportedData } from "./libs/useExportedData";
export { cssNormalizeSize } from "./libs/cssNormalizeSize";
export { cssSpacingResolver } from "./libs/cssSpacingResolver";
export { get3DShadow } from "./libs/colorGet3DShadow";
export { colorGet } from "./libs/colorGet";
export { Flex } from "./libs/Flex";
export { removeUndefined, removeUndefinedDeep } from "./libs/removeUndefined";
export { Typo, Typography } from "./libs/Typo";
export { Dropdown } from "./libs/Dropdown";
export { TextArea } from "./libs/TextArea";
export { Space } from "./libs/Space";
export { default as DS } from "./libs/DesignSystem";
export { columnTypes, COLUMN_SIZES } from "./libs/columnTypes";
export { notifier } from "./libs/notifier";
export { COUNTRY_INFORMATION } from "./constants/COUNTRY_INFORMATION";
export { LANGUAGES } from "./constants/LANGUAGES";

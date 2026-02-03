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
export { produce, freeze, current, original } from "immer";
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
export { baseDate } from "./libs/@baseDate";
export { baseStore } from "./libs/@baseStore";
export { baseStore as cs } from "./libs/@baseStore";
export { byPath } from "./libs/byPath";
export { colorConverter } from "./libs/colorConverter";
export { copyToClipboard } from "./libs/copyToClipboard";
export { debouncedFunction } from "./libs/debouncedFunction";
export { deepMerge } from "./libs/deepMerge";
export { default as Base } from "./libs/@Base/index";
export { findDifferences } from "./libs/findDifferences";
export { generateRandom } from "./libs/generateRandom";
export { getContrastRatio } from "./libs/getContrastRatio";
export { getTimeDifference } from "./libs/getTimeDifference";
export { Icon } from "./libs/@Icon";
export { isContainer } from "./libs/isContainer";
export { isEqual } from "./libs/isEqual";
export { isNumber } from "./libs/isNumber";
export { isPlainObject } from "./libs/isPlainObject";
export { logReferrers } from "./libs/logReferrers";
export { LOWER_CASE_ALPHABET } from "./constants/LOWER_CASE_ALPHABET";
export { manageSearchParams } from "./libs/useManageSearchParams/manageSearchParams";
export { NUMBERS } from "./constants/NUMBERS";
export { pickHigherContrastColor } from "./libs/pickHigherContrastColor";
export { pushAsSorted } from "./libs/pushAsSorted";
export { queryConverter } from "./libs/queryConverter";
export { scrollLock } from "./libs/scrollLock";
export { shallowEqual } from "./libs/shallowEqual";
export { sleep } from "./libs/sleep";
export { sortFunction } from "./libs/sortFunction";
export { stringCaseConverter } from "./libs/stringCaseConverter";
export { SYMBOLS } from "./constants/SYMBOLS";
export { typeOf } from "./libs/typeOf";
export { UPPER_CASE_ALPHABET } from "./constants/UPPER_CASE_ALPHABET";
export { useDebouncedFunction } from "./libs/useDebouncedFunction";
export { useDebouncedValue } from "./libs/useDebouncedValue";
export { useEffectAfterMount } from "./libs/useEffectAfterMount";
export { useEventListener } from "./libs/useEventListener";
export { useImagePreloader } from "./libs/useImagePreloader";
export { useImagesReady } from "./libs/useImagesReady";
export { useManageSearchParams } from "./libs/useManageSearchParams";
export { useMouseXY } from "./libs/useMouseXY";
export { useObserver } from "./libs/useObserver";
export { usePrevious } from "./libs/usePrevious";
export { useScrollThrottle } from "./libs/useScrollThrottle";
export { useScrollTopLeft } from "./libs/useScrollTopLeft";
export { useScrollWidthHeight } from "./libs/useScrollWidthHeight";
export { useTimer, getTimersSnapshot } from "./libs/useTimer";
export { getClientData } from "./libs/getClientData";

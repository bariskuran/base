import { DEFAULT_BREAKPOINTS } from "../../constants/DEFAULT_BREAKPOINTS";
import { DEFAULT_MAX_ASP_RATIO } from "../../constants/DEFAULT_MAX_ASP_RATIO";
import { DEFAULT_MIN_ASP_RATIO } from "../../constants/DEFAULT_MIN_ASP_RATIO";

/**
 *  * @example
 * const client = getClientData();
 * console.log(client.currentBreakpoint, client.isMobile, client.timeZone);
 *
 * @example
 * const client = getClientData({
 *   breakpoints: { sm: [0, 640], md: [640, 1024], lg: [1024, 99999] },
 *   maxAspRatio: 0.45,
 *   minAspRatio: 2.5,
 * });
 */

/**
 * Collects lightweight client/environment data (viewport, breakpoints, timezone, UA hints, media prefs, connectivity)
 * with SSR safety.
 *
 * - In SSR / non-browser environments it returns a fully shaped object with safe defaults.
 * - In the browser it reads from `window`, `document`, `navigator`, `Intl`, and `matchMedia` when available.
 *
 * @param {Object} [options]
 * @param {Record<string, [number, number]>} [options.breakpoints=DEFAULT_BREAKPOINTS]
 *        Breakpoint map in the form:
 *        `{ sm: [0, 640], md: [640, 1024], ... }` where `min` is inclusive and `max` is exclusive.
 * @param {number} [options.maxAspRatio=DEFAULT_MAX_ASP_RATIO]
 *        Lower bound for allowed aspect ratio. (Note: naming kept for backward compatibility.)
 * @param {number} [options.minAspRatio=DEFAULT_MIN_ASP_RATIO]
 *        Upper bound for allowed aspect ratio. (Note: naming kept for backward compatibility.)
 *
 * @returns {{
 *   winW: number,
 *   winH: number,
 *   aspectRatio: number,
 *   language: string,
 *
 *   timeZone: string,
 *   utcOffsetMinutes: number,
 *   utcOffsetHours: number,
 *
 *   MAX_ASP_RATIO: number,
 *   MIN_ASP_RATIO: number,
 *   isOutOfRatio: boolean,
 *   isSafeSize: boolean,
 *   currentBreakpoint: string,
 *   isMobile: boolean,
 *
 *   device: "mobile"|"tablet"|"mac"|"windows"|"linux"|"unknown",
 *   os: "windows"|"android"|"ios"|"macOsX"|"linux"|"unknown",
 *   browser: "edge"|"chrome"|"safari"|"firefox"|"unknown",
 *
 *   dpr: number,
 *   isRetina: boolean,
 *   orientation: string,
 *
 *   prefersDark: boolean,
 *   prefersReducedMotion: boolean,
 *   prefersContrastMore: boolean,
 *
 *   online: boolean,
 *   connection: null | {
 *     effectiveType: string | null,
 *     downlink: number | null,
 *     rtt: number | null,
 *     saveData: boolean | null,
 *   },
 *
 *   deviceMemory: number | null,
 *   hardwareConcurrency: number | null,
 *
 *   maxTouchPoints: number,
 *   hasTouch: boolean,
 *   pointerCoarse: boolean,
 * }}
 *
 */
export const getClientData = ({
    breakpoints = DEFAULT_BREAKPOINTS,
    maxAspRatio = DEFAULT_MAX_ASP_RATIO,
    minAspRatio = DEFAULT_MIN_ASP_RATIO,
} = {}) => {
    // SSR / non-browser safety
    if (typeof window === "undefined" || typeof navigator === "undefined") {
        return {
            winW: 0,
            winH: 0,
            aspectRatio: 0,
            language: "undefined",
            timeZone: "undefined",
            utcOffsetMinutes: 0,
            utcOffsetHours: 0,

            MAX_ASP_RATIO: maxAspRatio,
            MIN_ASP_RATIO: minAspRatio,
            isOutOfRatio: false,
            isSafeSize: true,
            currentBreakpoint: "Not found",
            isMobile: false,

            device: "unknown",
            os: "unknown",
            browser: "unknown",

            // extras
            dpr: 1,
            isRetina: false,
            orientation: "unknown",

            prefersDark: false,
            prefersReducedMotion: false,
            prefersContrastMore: false,

            online: true,
            connection: null,
            deviceMemory: null,
            hardwareConcurrency: null,
            maxTouchPoints: 0,
            hasTouch: false,
            pointerCoarse: false,
        };
    }

    /** Vars */
    const winW = window.innerWidth || document.documentElement.clientWidth || 0;
    const winH = window.innerHeight || document.documentElement.clientHeight || 0;

    const aspectRatioRaw = winH ? winW / winH : 0;
    const aspectRatio = Number(aspectRatioRaw.toFixed(2));

    const isMobile = winW < 601;

    // NOTE: Your naming convention:
    // maxAspRatio = lower bound, minAspRatio = upper bound
    const isOutOfRatio = aspectRatio < maxAspRatio || aspectRatio > minAspRatio;
    const isSafeSize = !isOutOfRatio;

    const language = navigator.language || navigator.userLanguage || "undefined";
    const userAgent = navigator.userAgent || "";

    /** Device / OS / Browser (lightweight UA parsing) */
    const device = /iPad|Tablet/i.test(userAgent)
        ? "tablet"
        : /Mobile/i.test(userAgent)
          ? "mobile"
          : /Macintosh|Mac OS/i.test(userAgent)
            ? "mac"
            : /Windows/i.test(userAgent)
              ? "windows"
              : /Linux/i.test(userAgent)
                ? "linux"
                : "unknown";

    const os = /Windows NT/i.test(userAgent)
        ? "windows"
        : /Android/i.test(userAgent)
          ? "android"
          : /iPhone|iPad|iPod/i.test(userAgent)
            ? "ios"
            : /Mac OS X/i.test(userAgent)
              ? "macOsX"
              : /Linux/i.test(userAgent)
                ? "linux"
                : "unknown";

    const browser = /Edg\//i.test(userAgent)
        ? "edge"
        : /Chrome\//i.test(userAgent) && !/Edg\//i.test(userAgent)
          ? "chrome"
          : /Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent) && !/Edg\//i.test(userAgent)
            ? "safari"
            : /Firefox\//i.test(userAgent)
              ? "firefox"
              : "unknown";

    /** Define currentBP */
    const currentBreakpoint = (() => {
        for (const [breakpoint, range] of Object.entries(breakpoints)) {
            const [min, max] = range;
            if (winW >= min && winW < max) return breakpoint;
        }
        return "Not found";
    })();

    /** Timezone + UTC offset */
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcOffsetMinutes = -new Date().getTimezoneOffset(); // e.g. 120 or 180
    const utcOffsetHours = utcOffsetMinutes / 60;

    /** "Retina" */
    const dpr = window.devicePixelRatio || 1;
    const isRetina = dpr >= 2;

    /** Orientation */
    const orientationType =
        window.screen?.orientation?.type ||
        (winW && winH ? (winW > winH ? "landscape" : "portrait") : "unknown");

    /** Media preferences */
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
    const prefersReducedMotion =
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const prefersContrastMore = window.matchMedia?.("(prefers-contrast: more)")?.matches ?? false;

    /** Connectivity */
    const online = navigator.onLine ?? true;
    const net =
        navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;

    const connection = net
        ? {
              effectiveType: net.effectiveType ?? null, // "4g", "3g", ...
              downlink: typeof net.downlink === "number" ? net.downlink : null, // Mbps
              rtt: typeof net.rtt === "number" ? net.rtt : null, // ms
              saveData: net.saveData ?? null,
          }
        : null;

    /** Performance-ish hints */
    const deviceMemory = navigator.deviceMemory ?? null; // GB (mostly Chromium)
    const hardwareConcurrency = navigator.hardwareConcurrency ?? null;

    /** Input capabilities */
    const maxTouchPoints = navigator.maxTouchPoints ?? 0;
    const hasTouch = maxTouchPoints > 0;
    const pointerCoarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;

    /** Return */
    return {
        winW,
        winH,
        aspectRatio,
        language,

        timeZone,
        utcOffsetMinutes,
        utcOffsetHours,

        MAX_ASP_RATIO: maxAspRatio,
        MIN_ASP_RATIO: minAspRatio,
        isOutOfRatio,
        isSafeSize,
        currentBreakpoint,
        isMobile,

        device,
        os,
        browser,

        // extras
        dpr,
        isRetina,
        orientation: orientationType,

        prefersDark,
        prefersReducedMotion,
        prefersContrastMore,

        online,
        connection,

        deviceMemory,
        hardwareConcurrency,

        maxTouchPoints,
        hasTouch,
        pointerCoarse,
    };
};

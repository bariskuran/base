import { DEFAULT_BREAKPOINTS } from "../../constants/DEFAULT_BREAKPOINTS";
import { DEFAULT_MAX_ASP_RATIO } from "../../constants/DEFAULT_MAX_ASP_RATIO";
import { DEFAULT_MIN_ASP_RATIO } from "../../constants/DEFAULT_MIN_ASP_RATIO";

export const getClientData = ({
    breakpoints = DEFAULT_BREAKPOINTS,
    maxAspRatio = DEFAULT_MAX_ASP_RATIO,
    minAspRatio = DEFAULT_MIN_ASP_RATIO,
} = {}) => {

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
            urlMaxLength: 2048,


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


    const winW = window.innerWidth || document.documentElement.clientWidth || 0;
    const winH = window.innerHeight || document.documentElement.clientHeight || 0;

    const aspectRatioRaw = winH ? winW / winH : 0;
    const aspectRatio = Number(aspectRatioRaw.toFixed(2));

    const isMobile = winW < 601;



    const isOutOfRatio = aspectRatio < maxAspRatio || aspectRatio > minAspRatio;
    const isSafeSize = !isOutOfRatio;

    const language = navigator.language || navigator.userLanguage || "undefined";
    const userAgent = navigator.userAgent || "";


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


    const urlMaxLength =
        browser === "safari"
            ? 1024
            : browser === "firefox"
              ? 2048
              : browser === "chrome" || browser === "edge"
                ? 2048
                : 2048;


    const currentBreakpoint = (() => {
        for (const [breakpoint, range] of Object.entries(breakpoints)) {
            const [min, max] = range;
            if (winW >= min && winW < max) return breakpoint;
        }
        return "Not found";
    })();


    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcOffsetMinutes = -new Date().getTimezoneOffset();
    const utcOffsetHours = utcOffsetMinutes / 60;


    const dpr = window.devicePixelRatio || 1;
    const isRetina = dpr >= 2;


    const orientationType =
        window.screen?.orientation?.type ||
        (winW && winH ? (winW > winH ? "landscape" : "portrait") : "unknown");


    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
    const prefersReducedMotion =
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const prefersContrastMore = window.matchMedia?.("(prefers-contrast: more)")?.matches ?? false;


    const online = navigator.onLine ?? true;
    const net =
        navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;

    const connection = net
        ? {
              effectiveType: net.effectiveType ?? null,
              downlink: typeof net.downlink === "number" ? net.downlink : null,
              rtt: typeof net.rtt === "number" ? net.rtt : null,
              saveData: net.saveData ?? null,
          }
        : null;


    const deviceMemory = navigator.deviceMemory ?? null;
    const hardwareConcurrency = navigator.hardwareConcurrency ?? null;


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
        urlMaxLength,


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

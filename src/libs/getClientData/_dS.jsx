import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { formatJsonForDisplay } from "../DesignSystem/formatJsonForDisplay";
import { getClientData } from ".";
import { baseStore } from "../@baseStore";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";

const X = () => {
    const clientData = baseStore.useGlobal((s) => s._clientData);
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    return (
        <Ds.page
            title="getClientData()"
            releasedOn="1.0.0"
            description={
                <>
                    Collects lightweight client/environment data. It is already maintained and kept
                    up to date in Base. You do not need to call it manually.
                    <br />
                    <br />
                    <Button.string to="/design-system/base-store" label="baseStore" />
                    <br />
                    <Button.string to="/design-system/base" label="<Base>" />
                </>
            }
        >
            <Ds.block
                title="Accesing clientData"
                description="globalData._clientData can be used to get the client data."
                code={`import { baseStore } from "${SYS.basePath}";

                    // React
                    const clientData = baseStore.useGlobal((s) => s._clientData);

                    // Non-React
                    const clientData = baseStore.globalData.get()._clientData;`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex.column gap={4}>
                            <Typo.span>
                                winW: {clientData?.winW ?? "—"} · winH: {clientData?.winH ?? "—"} ·
                                currentBreakpoint: {clientData?.currentBreakpoint ?? "—"} ·
                                isMobile: {String(clientData?.isMobile ?? "—")}
                            </Typo.span>
                            <Typo.span>
                                timeZone: {clientData?.timeZone ?? "—"} · device:{" "}
                                {clientData?.device ?? "—"} · browser: {clientData?.browser ?? "—"}
                            </Typo.span>
                        </Flex.column>
                        <Typo.code codeFormat={false}>
                            {formatJsonForDisplay(clientData ?? {})}
                        </Typo.code>
                    </Flex.column>
                }
            />
            <Ds.api
                args="getClientData({ breakpoints, maxAspRatio, minAspRatio })"
                returns="Client/environment snapshot object (SSR-safe defaults when window is unavailable)."
                props={{
                    breakpoints: {
                        description:
                            "Breakpoint map: { name: [min, max] } — min inclusive, max exclusive. Default: DEFAULT_BREAKPOINTS from constants.",
                        type: "Record<string, [number, number]>",
                    },
                    maxAspRatio: {
                        description:
                            "Lower bound for allowed aspect ratio (winW / winH). Naming kept for backward compatibility.",
                        type: "number",
                    },
                    minAspRatio: {
                        description:
                            "Upper bound for allowed aspect ratio. Naming kept for backward compatibility.",
                        type: "number",
                    },
                }}
                returnProps={{
                    winW: { description: "Viewport width (px).", type: "number" },
                    winH: { description: "Viewport height (px).", type: "number" },
                    aspectRatio: { description: "winW / winH (2 decimals).", type: "number" },
                    language: {
                        description: "navigator.language (or userLanguage).",
                        type: "string",
                    },
                    timeZone: { description: "IANA timezone from Intl.", type: "string" },
                    utcOffsetMinutes: {
                        description: "UTC offset in minutes (e.g. 180 for UTC+3).",
                        type: "number",
                    },
                    utcOffsetHours: {
                        description: "UTC offset in hours (utcOffsetMinutes / 60).",
                        type: "number",
                    },
                    MAX_ASP_RATIO: {
                        description: "Configured lower bound for aspect ratio (from options).",
                        type: "number",
                    },
                    MIN_ASP_RATIO: {
                        description: "Configured upper bound for aspect ratio (from options).",
                        type: "number",
                    },
                    isOutOfRatio: {
                        description: "True when aspectRatio is outside MAX/MIN bounds.",
                        type: "boolean",
                    },
                    isSafeSize: {
                        description: "True when aspect ratio is within bounds (!isOutOfRatio).",
                        type: "boolean",
                    },
                    currentBreakpoint: {
                        description: "Active breakpoint key from breakpoints map.",
                        type: "string",
                    },
                    isMobile: {
                        description: "True when winW < 601.",
                        type: "boolean",
                    },
                    device: {
                        description: "mobile | tablet | mac | windows | linux | unknown",
                        type: "string",
                    },
                    os: {
                        description: "windows | android | ios | macOsX | linux | unknown",
                        type: "string",
                    },
                    browser: {
                        description: "edge | chrome | safari | firefox | unknown",
                        type: "string",
                    },
                    dpr: { description: "window.devicePixelRatio.", type: "number" },
                    isRetina: { description: "True when dpr >= 2.", type: "boolean" },
                    orientation: {
                        description: "screen.orientation.type or landscape/portrait fallback.",
                        type: "string",
                    },
                    prefersDark: {
                        description: "prefers-color-scheme: dark.",
                        type: "boolean",
                    },
                    prefersReducedMotion: {
                        description: "prefers-reduced-motion: reduce.",
                        type: "boolean",
                    },
                    prefersContrastMore: {
                        description: "prefers-contrast: more.",
                        type: "boolean",
                    },
                    online: { description: "navigator.onLine.", type: "boolean" },
                    connection: {
                        description:
                            "NetworkInformation snapshot: effectiveType, downlink, rtt, saveData (or null).",
                        type: "object | null",
                    },
                    deviceMemory: {
                        description:
                            "navigator.deviceMemory in GB (Chromium; null if unavailable).",
                        type: "number | null",
                    },
                    hardwareConcurrency: {
                        description: "navigator.hardwareConcurrency (null if unavailable).",
                        type: "number | null",
                    },
                    maxTouchPoints: {
                        description: "navigator.maxTouchPoints.",
                        type: "number",
                    },
                    hasTouch: {
                        description: "True when maxTouchPoints > 0.",
                        type: "boolean",
                    },
                    pointerCoarse: {
                        description: "matchMedia (pointer: coarse).",
                        type: "boolean",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

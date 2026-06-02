export { loadingApi } from "./loadingApi";

import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { baseStore } from "../../baseStore";
import {
    withTimeout,
    waitForImages,
    waitForVideos,
    waitForFonts,
    waitForBackgroundImages,
    waitForLottieBestEffort,
    raf,
} from "./_tools";

export const PageLoadingManager = () => {
    const location = useLocation();
    const [setGlobal] = baseStore.useGlobal((s) => [s.set]);
    const runIdRef = useRef(0);

    const setLoadingPage = useCallback((next) => {
        setGlobal?.((s) => {
            s.isLoadingPage = Boolean(next);
            s.isLoading = Boolean(s.isLoadingApi || false || s.isLoadingPage);
        });
    }, []);

    useEffect(() => {
        const myRunId = ++runIdRef.current;

        setLoadingPage(true);
        let alive = true;
        const run = async () => {
            await raf();
            if (!alive || myRunId !== runIdRef.current) return;

            await withTimeout(
                Promise.all([
                    waitForImages(),
                    waitForVideos(),
                    waitForFonts(),
                    waitForBackgroundImages(),
                    waitForLottieBestEffort(),
                ]),
                8000,
            );

            if (!alive || myRunId !== runIdRef.current) return;
            await raf();
            if (!alive || myRunId !== runIdRef.current) return;

            setLoadingPage(false);
        };

        run();

        return () => {
            alive = false;
        };
    }, [location.key]);

    return null;
};

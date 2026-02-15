import { useEffect } from "react";
import { useBase } from "../useBase";
import { useDS } from "../useDashStore";
import { Container, TextAnimation } from "./_styled";

export const LoadingScreen = () => {
    const [
        isLoading,
        LoadingScreenComponent,
        loadingScreenPeriod,
        loadingScreenAnimationTime,
        addToLoading,
        removeFromLoading,
        date,
    ] = useBase((s) => [
        s.isLoading,
        s.BASE_SETTINGS?.loadingManager?.LoadingScreenComponent,
        s.BASE_SETTINGS?.loadingManager?.loadingScreenPeriod,
        s.BASE_SETTINGS?.loadingManager?.loadingScreenAnimationTime,
        s.addToLoading,
        s.removeFromLoading,
        s.date,
    ]);
    const { isAnimation, set } = useDS({ isAnimation: true });

    useEffect(() => {
        const now = date.now.ts();
        const { lastShown = 0 } = JSON.parse(localStorage.getItem("loadingScreenSettings")) || {};
        const diff = (now - lastShown) / 1000 / 60 / 60 / 24;

        if (loadingScreenPeriod === 0 || diff > loadingScreenPeriod) {
            set({ isAnimation: true });
            const queueId = addToLoading("loadingAnimation");
            setTimeout(() => {
                removeFromLoading(queueId);
            }, loadingScreenAnimationTime * 1000);
            loadingScreenPeriod !== 0 &&
                localStorage.setItem("loadingScreenSettings", JSON.stringify({ lastShown: now }));
        } else {
            set({ isAnimation: false });
        }
    }, []);

    if (!isLoading) return null;
    return (
        <Container>
            {LoadingScreenComponent ? (
                <LoadingScreenComponent isFreezed={!isAnimation} />
            ) : (
                <TextAnimation>Loading</TextAnimation>
            )}
        </Container>
    );
};

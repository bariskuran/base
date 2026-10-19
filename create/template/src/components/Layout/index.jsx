import { Outlet, ScrollBar, Suspense } from "base";
import { NavigationContext } from "./NavigationContext";
import { SuspenceFallback } from "../SuspenceFallback";

export const Layout = () => {
    /* Return */
    return (
        <span style={{ display: "contents" }}>
            <ScrollBar.primary body maxLength={40} fillMode />
            <NavigationContext.Provider value={{}}>
                <Suspense fallback={<SuspenceFallback />}>
                    <Outlet />
                </Suspense>
            </NavigationContext.Provider>
        </span>
    );
};

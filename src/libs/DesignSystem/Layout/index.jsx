import { Outlet } from "react-router-dom";
import { S } from "./_styled";
import { formatDsNavLabel, getSitemap } from "../index";
import { baseStore } from "../../baseStore";
import { Button } from "../../Button";
import useVars from "./useVars";
import { sortBy } from "../../sortBy";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ScrollBar } from "../../ScrollBar";
import { Flex } from "../../Flex";
import { useRevealNavItem } from "../../useRevealNavItem";

const resetDocumentScroll = () => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
};

const Layout = () => {
    const vars = useVars();
    const { pathname } = useLocation();
    const navScrollRef = useRef(null);
    const showInternalDs = baseStore.useGlobal((s) => !!s._adminSettings?.showInternalDs);
    const sorted = useMemo(() => {
        const list = getSitemap() || [];
        const pinnedCount = 2;
        const pinned = list.slice(0, pinnedCount);
        const rest = list.slice(pinnedCount).sort((a, b) => sortBy.asc(a[0], b[0]));
        return [...pinned, ...rest];
    }, [showInternalDs]);

    useLayoutEffect(() => {
        if (typeof history !== "undefined" && "scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }
    }, []);

    const resetContentScroll = useCallback(() => {
        resetDocumentScroll();
    }, []);

    useLayoutEffect(() => {
        resetContentScroll();
    }, [pathname, resetContentScroll]);

    useEffect(() => {
        resetContentScroll();
    }, [pathname, resetContentScroll]);

    const [isActive, activeNavItemRef] = useRevealNavItem({
        links: sorted,
        basePath: "/design-system",
        getPathFromLink: (link) => link[1],
        scrollRootRef: navScrollRef,
    });

    /* RETURN */
    return (
        <S.container $vars={vars} aria-label="Design System">
            <ScrollBar.primary body maxLength={40} fillMode />
            <S.navigation aria-label="Navigation">
                <Flex.column ref={navScrollRef} height="100vh" flex="0 0 300rem" paddingBottom={75}>
                    <ScrollBar disableX trackMargin={0} edgeMargin={-4} />
                    <S.logoArea>
                        <S.logoArea2>
                            <Button.plain
                                to="/design-system"
                                bgColor="transparent"
                                hoverBgColor="transparent"
                                activeBgColor="transparent"
                                icon={{
                                    disablePulseEffect: true,
                                    disableScaleEffect: true,
                                    icon: "baseLogo",
                                    color: "primary",
                                    width: 125,
                                    flat: true,
                                }}
                            />
                        </S.logoArea2>
                    </S.logoArea>
                    {sorted.map((entry, i) => {
                        const [name, path] = entry;
                        return (
                            <Button.squareOnRight
                                key={path ?? `nav-${i}`}
                                ref={isActive(entry) ? activeNavItemRef : undefined}
                                to={path ? `/design-system/${path}` : "/design-system"}
                                label={formatDsNavLabel(name)}
                                bgColor="transparent"
                                color="foreground"
                                fullWidth="right"
                            />
                        );
                    })}
                </Flex.column>
            </S.navigation>
            <Flex.column full flex="1 1 0%" gap={10} padding="30rem" minWidth={0}>
                <Outlet />
            </Flex.column>
        </S.container>
    );
};
export default Layout;

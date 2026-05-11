import { Outlet, useLocation } from "react-router-dom";
import { S } from "./_styled";
import { formatDsNavLabel, getSitemap } from "../index";
import { baseStore } from "../../@baseStore";
import { Button } from "../../Button";
import useVars from "./useVars";
import { sortBy } from "../../sortBy";
import { useMemo } from "react";
import { ScrollBar } from "../../ScrollBar";
import { Flex } from "../../Flex";
import { useLinkIntoView } from "../../useLinkIntoView";

const Layout = () => {
    const vars = useVars();
    const location = useLocation();
    const showInternalDs = baseStore.useGlobal((s) => !!s._adminSettings?.showInternalDs);

    const sorted = useMemo(() => {
        const [first, ...rest] = getSitemap() || [];
        return first ? [first, ...rest.sort((a, b) => sortBy.asc(a[0], b[0]))] : [];
    }, [showInternalDs]);

    const [isActive, activeNavItemRef] = useLinkIntoView({
        pathname: location.pathname,
        links: sorted,
    });

    /* RETURN */
    return (
        <S.container $vars={vars} aria-label="Design System">
            <ScrollBar.primary maxLength={40} fillMode disableX />
            <S.navigation aria-label="Navigation">
                <Flex.column height="100vh" flex="0 0 300rem" paddingBottom={75}>
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
                                to={path || "/design-system"}
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

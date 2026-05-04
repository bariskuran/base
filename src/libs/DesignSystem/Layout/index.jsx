import { Outlet } from "react-router-dom";
import { S } from "./_styled";
import { sitemap } from "../index";
import { Button } from "../../Button";
import useVars from "./useVars";
import { sortBy } from "../../sortBy";
import { useMemo } from "react";
import { ScrollBar } from "../../ScrollBar";
import { Flex } from "../../Flex";

const Layout = () => {
    const vars = useVars();

    const sorted = useMemo(() => {
        const [first, ...rest] = sitemap || [];
        return first ? [first, ...rest.sort((a, b) => sortBy.asc(a[0], b[0]))] : [];
    }, [sitemap]);

    /* RETURN */
    return (
        <S.container $vars={vars} aria-label="Design System">
            <ScrollBar.primary maxLength={40} fillMode disableX />
            <S.navigation aria-label="Navigation">
                <Flex.column height="100vh" flex="0 0 300rem" paddingBottom={75}>
                    <ScrollBar disableX trackMargin={0} edgeMargin={-4} />
                    <Flex margin="10rem 0" full>
                        <Button.plain
                            to="/design-system"
                            bgColor="transparent"
                            hoverBgColor="transparent"
                            icon={{
                                disableScaleEffect: true,
                                icon: "baseLogo",
                                color: "primary",
                                width: 125,
                            }}
                        />
                    </Flex>
                    {sorted.map(([name, path], i) => (
                        <Button.squareOnRight
                            key={path || i}
                            to={path || "/design-system"}
                            label={name}
                            bgColor="transparent"
                            color="foreground"
                            fullWidth="right"
                        />
                    ))}
                </Flex.column>
            </S.navigation>
            <Flex.column full flex="1 1 auto" gap={10} padding="30rem">
                <Outlet />
            </Flex.column>
        </S.container>
    );
};
export default Layout;

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
        <S.container $vars={vars}>
            <ScrollBar.primary body maxLength={40} fillMode disableX />
            <S.navigation>
                <S.navigationContent>
                    <ScrollBar disableX edgeMargin={0} trackMargin={0} variant="primary" />
                    <S.logoArea>
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
                    </S.logoArea>
                    <Flex.column>
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
                </S.navigationContent>
            </S.navigation>
            <S.content>
                <Outlet />
            </S.content>
        </S.container>
    );
};
export default Layout;

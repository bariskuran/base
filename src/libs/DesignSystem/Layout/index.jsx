import { Outlet } from "react-router-dom";
import { S } from "./_styled";
import { sitemap } from "../index";
import { Button } from "../../Button";
import { ScrollBox } from "../../ScrollBox";
import useVars from "./useVars";

const Layout = () => {
    const vars = useVars();

    /* RETURN */
    return (
        <S.container $vars={vars}>
            <S.navigation>
                <ScrollBox.clean fullWidth="right" maxHeight="100vh">
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
                    {sitemap.map(([name, path], i) => (
                        <Button.squareOnRight
                            key={path || i}
                            to={path || "/design-system"}
                            label={name}
                            bgColor="transparent"
                            color="foreground"
                            fullWidth="right"
                        />
                    ))}
                </ScrollBox.clean>
            </S.navigation>
            <S.content>
                <Outlet />
            </S.content>
        </S.container>
    );
};
export default Layout;

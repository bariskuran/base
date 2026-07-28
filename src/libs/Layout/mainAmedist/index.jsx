import { Visibility } from "../../Visibility";
import { useLayout } from "../controllerRegistry";
import { S } from "./_styled";

const getVariantControllerName = (element, fallback) =>
    element?.type?.layoutControllerName || fallback;

const MainAmedist = ({ controllerId = "default", header, footer, menuContent, children }) => {
    const headerControllerName = getVariantControllerName(header, "headerAmedist");
    const headerControllerId = header?.props?.controllerId || controllerId;
    const headerController = useLayout(headerControllerName, {
        controllerId: headerControllerId,
    });
    const { menuStatus = "closed", extendedHeight = 100, condensedHeight = 50 } = headerController;
    const outletVisible = menuStatus === "closed" || menuStatus === "closing";
    const menuVisible = menuStatus !== "closed";

    return (
        <S.container $extendedHeight={extendedHeight} $condensedHeight={condensedHeight}>
            <S.pageContent>
                {header}
                <S.main aria-label="main">
                    <Visibility visible={outletVisible} content={children} />
                    <Visibility.mount
                        visible={menuVisible}
                        content={
                            <S.menuArea $closing={menuStatus === "closing"}>
                                {menuContent}
                            </S.menuArea>
                        }
                    />
                </S.main>
            </S.pageContent>
            <Visibility
                visible={outletVisible}
                content={<S.footerBoundary>{footer}</S.footerBoundary>}
            />
        </S.container>
    );
};

MainAmedist.displayName = "Layout.mainAmedist";
MainAmedist.layoutControllerName = "mainAmedist";

export default MainAmedist;

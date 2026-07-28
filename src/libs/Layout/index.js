import { createElement } from "react";
import { Visibility } from "../Visibility";
import { ControllerError } from "./ControllerError";
import {
    registerLayoutControllerFactory,
    useLayout,
    useLayoutControllerOwner,
} from "./controllerRegistry";
import {
    createBasicLayoutController,
    createFooterAmedistController,
    createHeaderAmedistController,
} from "./controllers";
import FooterAmedist from "./footerAmedist";
import HeaderAmedist from "./headerAmedist";
import MainAmedist from "./mainAmedist";

registerLayoutControllerFactory("mainAmedist", createBasicLayoutController);
registerLayoutControllerFactory("headerAmedist", createHeaderAmedistController);
registerLayoutControllerFactory("footerAmedist", createFooterAmedistController);

const withLayoutController = (controllerName, Component) => {
    const LayoutVariant = ({ visible = true, controllerId = "default", ...props }) => {
        const owner = useLayoutControllerOwner(controllerName, controllerId);
        const controller = useLayout(controllerName, { controllerId: owner.controllerId });

        if (owner.hasDuplicateController) {
            return createElement(ControllerError, {
                controllerName,
                controllerId: owner.controllerId,
            });
        }

        return createElement(Visibility, {
            visible: visible && controller.visible !== false,
            content: createElement(Component, { ...props, controllerId: owner.controllerId }),
        });
    };

    LayoutVariant.displayName = Component.displayName;
    LayoutVariant.layoutControllerName = controllerName;
    return LayoutVariant;
};

export const Layout = {
    mainAmedist: withLayoutController("mainAmedist", MainAmedist),
    headerAmedist: withLayoutController("headerAmedist", HeaderAmedist),
    footerAmedist: withLayoutController("footerAmedist", FooterAmedist),
};

export { useLayout };

import { createElement } from "react";
import { Visibility } from "../Visibility";
import FooterAmedist from "./footerAmedist";

const withLayoutVisibility = (Component) => {
    const LayoutVariant = ({ visible = true, ...props }) =>
        createElement(Visibility, { visible, content: createElement(Component, props) });

    LayoutVariant.displayName = Component.displayName;
    return LayoutVariant;
};

export const Layout = {
    footerAmedist: withLayoutVisibility(FooterAmedist),
};

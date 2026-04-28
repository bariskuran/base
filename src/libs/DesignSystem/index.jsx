import { lazy as l } from "react";
import Layout from "./Layout";
import code from "./CodeViewer";
import api from "./ApiViewer";
import page from "./Page";
import block from "./Block";
import variant from "./VariantViewer";

export const sitemap = [
    ["How To Setup", undefined, l(() => import("./_dS")), { index: true }],
    ["<Ds.api>", "dSApiViewer", l(() => import("./ApiViewer/_dS"))],
    ["<Ds.block>", "dSBlock", l(() => import("./Block/_dS"))],
    ["<Ds.code>", "dSCodeViewer", l(() => import("./CodeViewer/_dS"))],
    ["<Icon>", "icon", l(() => import("../@Icon/_dS"))],
    ["<ScrollBar>", "scrollBar", l(() => import("../ScrollBar/_dS"))],
    ["iconLibrary", "iconLibrary", l(() => import("../@Icon/_dSLibrary"))],
    ["<ScrollFlex>", "scrollFlex", l(() => import("../ScrollFlex/_dS"))],
    ["<Button>", "button", l(() => import("../Button/_dS"))],
    ["<FloatingUi>", "floatingUi", l(() => import("../FloatingUi/_dS"))],
    ["<PopTip>", "popTip", l(() => import("../PopTip/_dS"))],
    //
];

export const designSystemRoutes = [
    {
        path: "design-system",
        element: <Layout />,
        children: [
            ...sitemap.map(([name, path, El, props]) => ({
                path,
                element: <El />,
                ...props,
                handle: {
                    pageTitle: name,
                },
            })),
        ],
    },
];

const Ds = {
    code,
    variant,
    api,
    page,
    block,
    layout: Layout,
};
export default Ds;

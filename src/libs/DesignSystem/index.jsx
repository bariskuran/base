import { lazy as l } from "react";
import Layout from "./Layout";
import code from "./CodeViewer";
import api from "./ApiViewer";
import page from "./Page";
import block from "./Block";

export const sitemap = [
    ["How To Setup", undefined, l(() => import("./_dS")), { index: true }],
    ["<Ds.api>", "dSApiViewer", l(() => import("./ApiViewer/_dS"))],
    ["<Ds.block>", "dSBlock", l(() => import("./Block/_dS"))],
    ["<Ds.code>", "dSCodeViewer", l(() => import("./CodeViewer/_dS"))],
    ["<Icon>", "icon", l(() => import("../@Icon/_dS"))],
    ["<ScrollBar>", "scrollBar", l(() => import("../ScrollBar/_dS"))],
    ["iconLibrary", "iconLibrary", l(() => import("../@Icon/_dSLibrary"))],
    //
    ["<ScrollBox>", "scrollBox", l(() => import("../ScrollBox/_dS"))],
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
    api,
    page,
    block,
    layout: Layout,
};
export default Ds;

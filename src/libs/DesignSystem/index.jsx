import { lazy as l } from "react";
import Layout from "./Layout";
import code from "./CodeViewer";
import api from "./ApiViewer";
import page from "./Page";
import block from "./Block";

export const sitemap = [
    ["How To Install", undefined, l(() => import("./_dS")), { index: true }],
    ["DSApiViewer", "dSApiViewer", l(() => import("./ApiViewer/_dS"))],
    ["DSBlock", "dSBlock", l(() => import("./Block/_dS"))],
    //
    ["DSCodeViewer", "dSCodeViewer", l(() => import("./CodeViewer/_dS"))],
    ["Icon", "icons", l(() => import("../@Icon/_dS"))],
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

import { lazy as l } from "react";
import { DesignSystemLayout } from "./DesignSystemLayout";

export const sitemap = [
    ["How To Install", undefined, l(() => import("./_dS")), { index: true }],
    ["Icon", "icons", l(() => import("../@Icon/_dS"))],
    ["DSCodeViewer", "dSCodeViewer", l(() => import("../DSCodeViewer/_dS"))],
    ["DSApiViewer", "dSApiViewer", l(() => import("../DSApiViewer/_dS"))],
];

export const designSystemRoutes = [
    {
        path: "design-system",
        element: <DesignSystemLayout />,
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

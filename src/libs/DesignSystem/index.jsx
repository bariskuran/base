import { DesignSystemLayout } from "./DesignSystemLayout";

import { IconsLibrary } from "./IconsLibrary";

export const designSystemRoutes = [
    {
        path: "baseDesignSystem",
        element: <DesignSystemLayout />,
        children: [{ index: true, path: "icons", element: <IconsLibrary /> }],
    },
];

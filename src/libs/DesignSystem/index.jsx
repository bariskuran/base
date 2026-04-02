import { DesignSystemLayout } from "./DesignSystemLayout";

import { IconsLibrary } from "./IconsLibrary";

export const designSystemRoutes = [
    {
        path: "design-system",
        element: <DesignSystemLayout />,
        children: [{ index: true, path: "icons", element: <IconsLibrary /> }],
    },
];

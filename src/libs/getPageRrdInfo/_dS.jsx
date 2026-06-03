import { useMemo } from "react";
import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { getPageRrdInfo } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../baseStore";

const X = () => {
    const [pathname] = baseStore.useGlobal((s) => [s._reactRouterDom?.location?.pathname]);
    const info = useMemo(() => getPageRrdInfo(), [pathname]);
    const pretty = useMemo(() => JSON.stringify(info, null, 2), [info]);

    return (
        <Ds.page
            title="getPageRrdInfo()"
            releasedOn="1.0.0"
            description="Reads the active route from globalData (_preparedRoutes + current pathname). Use instead of wiring preparedRoutes and pathname manually."
        >
            <Ds.block
                title="Usage"
                code={`import { getPageRrdInfo } from "${SYS.basePath}";

                   const { route, handle, relatives, pathname, preparedRoutesForLanguage } = getPageRrdInfo();
                   // optional: getPageRrdInfo("/custom/path")`}
                example={
                    <Flex.column gap={8} padding={10} bgColor="backgrounds.shade10" full>
                        <Typo.p balance>
                            Live snapshot for the current DS route (updates when pathname changes):
                        </Typo.p>
                        <Typo.code copy content={pretty} />
                    </Flex.column>
                }
            />
            <Ds.api
                args="getPageRrdInfo(pathnameOverride?)"
                props={{
                    pathnameOverride: {
                        description:
                            "Optional pathname. Defaults to globalData._reactRouterDom.location.pathname.",
                        type: "string",
                        defaultValue: null,
                    },
                }}
                returns={{
                    pathname: { description: "Normalized active pathname.", type: "string" },
                    language: { description: "Active globalData.language.", type: "string" },
                    route: {
                        description: "Matched prepared route object or null.",
                        type: "object | null",
                    },
                    handle: { description: "route.handle or null.", type: "object | null" },
                    relatives: {
                        description: "handle.relatives map for language switching.",
                        type: "object | null",
                    },
                    categories: {
                        description: "Breadcrumb category stack from prepareRoutes.",
                        type: "array | null",
                    },
                    languageRoute: {
                        description: "Snapshot used by setLanguage (_languageRoute).",
                        type: "object | null",
                    },
                    preparedRoutes: {
                        description: "Full flattened route list.",
                        type: "array",
                    },
                    preparedRoutesForLanguage: {
                        description: "Routes filtered by active language.",
                        type: "array",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

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
            description={{ tr: "Aktif route'u globalData'dan okur (_preparedRoutes + güncel pathname). preparedRoutes ve pathname'i elle bağlamak yerine kullanın.", en: "Reads the active route from globalData (_preparedRoutes + current pathname). Use it instead of wiring preparedRoutes and pathname manually." }}
        >
            <Ds.block
            title={{ tr: "Kullanım", en: "Usage" }}
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
                        description: { tr: "İsteğe bağlı pathname. Varsayılan globalData._reactRouterDom.location.pathname değeridir.", en: "Optional pathname. Defaults to globalData._reactRouterDom.location.pathname." },
                        type: "string",
                        defaultValue: null,
                    },
                }}
                returns={{
                    pathname: { description: { tr: "Normalize edilmiş aktif pathname.", en: "Normalized active pathname." }, type: "string" },
                    language: { description: { tr: "Aktif globalData.language.", en: "Active globalData.language." }, type: "string" },
                    route: {
                        description: { tr: "Eşleşen hazırlanmış route nesnesi veya null.", en: "Matched prepared route object or null." },
                        type: "object | null",
                    },
                    handle: { description: { tr: "route.handle veya null.", en: "route.handle or null." }, type: "object | null" },
                    relatives: {
                        description: { tr: "Dil değiştirme için handle.relatives map'i.", en: "handle.relatives map for language switching." },
                        type: "object | null",
                    },
                    categories: {
                        description: { tr: "prepareRoutes'tan gelen breadcrumb kategori yığını.", en: "Breadcrumb category stack from prepareRoutes." },
                        type: "array | null",
                    },
                    languageRoute: {
                        description: { tr: "setLanguage tarafından kullanılan snapshot (_languageRoute).", en: "Snapshot used by setLanguage (_languageRoute)." },
                        type: "object | null",
                    },
                    preparedRoutes: {
                        description: { tr: "Tam düzleştirilmiş route listesi.", en: "Full flattened route list." },
                        type: "array",
                    },
                    preparedRoutesForLanguage: {
                        description: { tr: "Aktif dile göre filtrelenmiş route'lar.", en: "Routes filtered by active language." },
                        type: "array",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { baseStore } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { formatGlobalDataForDisplay } from "../DesignSystem/formatJsonForDisplay";

const X = () => {
    const globalSnapshot = baseStore.useGlobal((s) => s);
    const [winW] = baseStore.useGlobal((s) => [s._clientData?.winW]);

    return (
        <Ds.page
            title="baseStore.useGlobal"
            releasedOn="1.0.0"
            description={
                <>
                    'useGlobal' is a shared data bank reachable from anywhere in the app. It wraps
                    'use' and always targets the singleton{" "}
                    <Typo.code>baseStore.globalData</Typo.code> store (the global store module —
                    same API as any store from <Typo.code>create</Typo.code>), so you do not pass a
                    store instance each time. Base subsystems keep shared values here (e.g.
                    '_clientData', 'textLibrary'). You may add app-wide fields too — avoid
                    overwriting internal keys the system relies on.
                    <br />
                    <br />
                    Helper methods (set, setByPath, remove, get) work the same as on{" "}
                    <Button.string to="/design-system/baseStore_use" label="baseStore.use" />.
                </>
            }
        >
            <Ds.block
                title="Basic usage"
                code={`import { baseStore } from "${SYS.basePath}";

                    const [winW] = baseStore.useGlobal((s) => [s._clientData?.winW]);
                    const { winW } = baseStore.globalData.get()._clientData;`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Typo.span>
                            winW (from selector): <Typo.code>{String(winW ?? "—")}</Typo.code>
                        </Typo.span>
                    </Flex.column>
                }
            />
            <Ds.api
                title="useGlobal"
                disableLastBlock
                args="const value = baseStore.useGlobal(selector);"
                props={{
                    selector: {
                        description:
                            "Optional selector on globalData. Omit to receive full state + helpers.",
                        type: "function",
                    },
                }}
            />
            <Ds.api
                title="globalData"
                disableLastBlock
                args="baseStore.globalData.get();"
                props={{
                    store: {
                        description:
                            "Singleton global store (create() result for DEFAULT_GLOBAL_CORESTORE_VARIABLES). Draft updates go through a proxy in set().",
                        type: "object",
                    },
                    get: {
                        description: "Returns the current state snapshot.",
                        type: "function",
                    },
                    set: {
                        description:
                            "Updates state via draft function, partial object merge, or full replace.",
                        type: "function",
                    },
                    setByPath: {
                        description: 'Sets a nested value by dot path (e.g. "obj.path.key").',
                        type: "function",
                    },
                    remove: {
                        description: 'Removes a value by dot path (e.g. "obj.path.key").',
                        type: "function",
                    },
                }}
            />
            <Ds.block
                title="Current globalData"
                lastBlock
                description="Live snapshot from the global store."
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Typo.code codeFormat={false}>
                            {formatGlobalDataForDisplay(globalSnapshot ?? {})}
                        </Typo.code>
                    </Flex.column>
                }
            />
        </Ds.page>
    );
};

export default X;

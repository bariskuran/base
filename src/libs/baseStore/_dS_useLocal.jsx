import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { baseStore } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";

const X = () => {
    const { test, set, localStore } = baseStore.useLocal({ test: 1 });

    return (
        <Ds.page
            title="baseStore.useLocal"
            releasedOn="1.0.0"
            description={
                <>
                    'useLocal' is scoped to a single component tree by design — ideal for quick
                    local state without creating a shared store file.
                    <br />
                    <br />
                    Helper methods (set, setByPath, remove, get) work the same as on{" "}
                    <Button.string to="/design-system/baseStore_use" label="baseStore.use" />.
                </>
            }
        >
            <Ds.block
                title="Basic usage"
                example={
                    <Flex.column gap={20}>
                        <Typo.code copy>{`import { baseStore } from "${SYS.basePath}";`}</Typo.code>
                        <Typo.code copy>
                            {`const { test, set } = baseStore.useLocal({ test: 1 });`}
                        </Typo.code>
                    </Flex.column>
                }
            />
            <Ds.block
                title="localStore export"
                description={
                    <>
                        The hook also returns the underlying store instance (same API as create).
                        <br />
                        <br />
                        It can be passed to child components by React's Context api and can be used
                        by baseStore.use.
                    </>
                }
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Typo.code copy>
                            {`const { test, localStore } = baseStore.useLocal({ test: 1 });`}
                        </Typo.code>
                    </Flex.column>
                }
            />
            <Ds.api
                args="const { ...state, set, get, setByPath, remove, localStore } = baseStore.useLocal(initialState);"
                props={{
                    initialState: {
                        description: "Initial local state object.",
                        type: "object",
                        defaultValue: "{}",
                    },
                }}
                returnProps={{
                    state: {
                        description: "Spread state fields from the local store.",
                        type: "object",
                    },
                    set: { description: "Store set helper.", type: "function" },
                    get: { description: "Store get helper.", type: "function" },
                    setByPath: { description: "Store setByPath helper.", type: "function" },
                    remove: { description: "Store remove helper.", type: "function" },
                    localStore: {
                        description: "Underlying store instance (create API).",
                        type: "object",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

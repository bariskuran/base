import { useEffect } from "react";
import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { baseStore } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import styled from "styled-components";
import { Icon } from "../Icon";
import { isShallowEqual } from "../isShallowEqual";

const Line = styled.div`
    height: 1px;
    width: 100rem;
    background-color: ${({ theme }) => theme.greys.shade50};
`;

const dsUseDemoStore = baseStore.create({
    var1: 1,
    var2: 2,
    obj: { var1: "nested-a" },
    arr: [{ usage: "a" }, { usage: "b" }, { usage: "c" }],
    dynamicKey: "initial",
    removeMe: "to-delete",
    nested: { path: { usage: "nested-value" } },
});

const IsValid = ({ isValid, code }) => {
    return (
        <Flex gap={20} align="center" alignSelf="start" width="fit-content">
            <Typo.span>
                {isValid ? <Icon icon="check" color="green" /> : <Icon icon="close" color="red" />}
            </Typo.span>
            <Typo.code copy>{code}</Typo.code>
        </Flex>
    );
};

const store = baseStore.create({
    e1: null,
    obj: { path: { usage: null } },
    arr: [{ usage2: null }],
});

const pathStore = baseStore.create({
    e3: null,
    nested: { obj: { usage: null } },
    arr: [{ usage: "a" }, { usage: "b" }, { usage: "c" }],
    staticPath: { dynamic: null },
});

const removeStore = baseStore.create({
    var1: 1,
    obj: { path: { usage: "remove-usage" } },
    arr: [{ usage: "a" }, { usage: "b" }, { usage: "c" }],
});

const X = () => {
    const [e1, e2, usage, usage2, usage3, set] = baseStore.use(store, (s) => [
        s.e1,
        s.e2,
        s.obj.path.usage,
        s.arr[0].usage2,
        s.arr?.[1]?.usage3,
        s.set,
    ]);

    useEffect(() => {
        set((s) => {
            s.e1 = "e1";
        });
        set((s) => {
            s.obj.path.usage = "updated-usage";
        });
        set((s) => {
            s.arr[0].usage2 = "updated-usage2";
        });
        set((s) => {
            s.arr.push({ usage3: "new" });
        });
        const dynamic = "e2";
        set((s) => {
            s[dynamic] = "dynamic";
        });
    }, [set]);

    const [nestedObjUsage, arr2Usage, staticDynamic, setByPath] = baseStore.use(pathStore, (s) => [
        s.nested.obj.usage,
        s.arr[2]?.usage,
        s.staticPath?.dynamic,
        s.setByPath,
    ]);

    useEffect(() => {
        setByPath("nested.obj.usage", "path-usage");
        setByPath("arr.2.usage", "arr-2-usage");
        const dynamicPath = "dynamic";
        setByPath(`staticPath.${dynamicPath}`, "dynamic-value");
    }, [setByPath]);

    const [var1Removed, objUsageRemoved, arr1Removed, remove] = baseStore.use(removeStore, (s) => [
        s.var1,
        s.obj.path.usage,
        s.arr[1],
        s.remove,
    ]);

    useEffect(() => {
        remove("var1");
        remove("obj.path.usage");
        remove("arr.1");
    }, [remove]);

    return (
        <Ds.page
            title="baseStore.use"
            releasedOn="1.0.0"
            description={
                <>
                    baseStore is a data management library used instead of useState, immer, zustand
                    or redux. Because the store can be imported, it works outside React components
                    in isolated functions without prop drilling — a major advantage when writing
                    code.
                </>
            }
        >
            <Ds.block
                title="Create"
                example={
                    <Typo.code copy>{`// store.js
                        import { baseStore } from "${SYS.basePath}";

                        const store = baseStore.create({});
                        export default store;`}</Typo.code>
                }
            />
            <Ds.block
                title="Get (React)"
                example={
                    <Flex.column gap={20}>
                        <Typo.code copy>
                            {`import { baseStore } from "${SYS.basePath}";
                            import { store } from "your-store-file";`}
                        </Typo.code>
                        <Line />
                        <IsValid
                            isValid={typeof baseStore.use(dsUseDemoStore) === "object"}
                            code="const all = baseStore.use(store);"
                        />
                        <Typo.span>
                            Not recommended: may cause unnecessary re-renders. This library is
                            designed to avoid that.
                        </Typo.span>
                        <Line />
                        <IsValid
                            isValid={baseStore.use(dsUseDemoStore, (s) => s.var1) === 1}
                            code="const var1 = baseStore.use(store, (s) => s.var1);"
                        />
                        <Line />
                        <IsValid
                            isValid={isShallowEqual(
                                baseStore.use(dsUseDemoStore, (s) => [s.var1, s.var2]),
                                [1, 2],
                            )}
                            code="const [var1, var2] = baseStore.use(store, (s) => [s.var1, s.var2]);"
                        />
                        <Line />
                        <IsValid
                            isValid={isShallowEqual(
                                baseStore.use(dsUseDemoStore, (s) => s.nested.path.usage),
                                "nested-value",
                            )}
                            code="const var1 = baseStore.use(store, (s) => s.obj.arr.2.key);"
                        />
                        <Typo.span>
                            May need to use optional chaining for nested values. If you're not sure
                            about the structure, use '?' operator.
                        </Typo.span>
                    </Flex.column>
                }
            />
            <Ds.block
                title="Get (non-React)"
                example={
                    <Flex.column gap={20}>
                        <Typo.code copy>
                            {`import { baseStore } from "${SYS.basePath}";
                            import { store } from "your-store-file";`}
                        </Typo.code>
                        <Line />
                        <IsValid
                            isValid={isShallowEqual(dsUseDemoStore.get().var1, 1)}
                            code="const { var1 } = store.get();"
                        />
                        <Line />
                        <IsValid
                            isValid={isShallowEqual(dsUseDemoStore.get().var1, 1)}
                            code="const var1 = store.get()?.var1;"
                        />
                        <Line />
                        <IsValid
                            isValid={isShallowEqual(
                                dsUseDemoStore.get().nested?.path?.usage,
                                "nested-value",
                            )}
                            code="const value = store.get().nested?.path?.usage;"
                        />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Access set (React)"
                example={
                    <Flex.column gap={20}>
                        <Typo.code copy>
                            {`import { baseStore } from "${SYS.basePath}";
                            import { store } from "your-store-file";`}
                        </Typo.code>
                        <Line />
                        <IsValid
                            isValid={
                                typeof baseStore.use(dsUseDemoStore, (s) => s.set) === "function"
                            }
                            code="const set = baseStore.use(store, s=>s.set);"
                        />
                        <Line />
                        <IsValid
                            isValid={
                                typeof baseStore.use(dsUseDemoStore, (s) => [s.var1, s.set])[1] ===
                                "function"
                            }
                            code="const [var1, set] = baseStore.use(store, s=>[s.var1, s.set]);"
                        />
                        <Line />
                        <IsValid
                            isValid={typeof dsUseDemoStore.set === "function"}
                            code="const set = store.set"
                        />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Access set (non-React)"
                code="const set = store.set;"
                example={
                    <IsValid
                        isValid={typeof dsUseDemoStore.set === "function"}
                        code="const set = store.set"
                    />
                }
            />
            <Ds.block
                title="set methods"
                example={
                    <Flex.column gap={10} padding={10} full>
                        <IsValid isValid={e1 === "e1"} code="set((s) => { s.e1 = 'e1'; });" />
                        <Line />
                        <IsValid
                            isValid={usage === "updated-usage"}
                            code="set((s) => { s.obj.path.usage = 'updated-usage'; });"
                        />
                        <Line />
                        <IsValid
                            isValid={usage2 === "updated-usage2"}
                            code="set((s) => { s.arr[0].usage2 = 'updated-usage2'; });"
                        />
                        <Line />
                        <IsValid
                            isValid={usage3 === "new"}
                            code="set((s) => { s.arr.push({ usage3: 'new' }); });"
                        />
                        <Line />
                        <IsValid
                            isValid={e2 === "dynamic"}
                            code="set((s) => { s[dynamicKeyName] = 'dynamic'; });"
                        />
                    </Flex.column>
                }
            />

            <Ds.block
                title="Access setByPath (React)"
                example={
                    <Flex.column gap={20}>
                        <Typo.code copy>
                            {`import { baseStore } from "${SYS.basePath}";
                            import { store } from "your-store-file";`}
                        </Typo.code>
                        <Line />
                        <IsValid
                            isValid={
                                typeof baseStore.use(pathStore, (s) => s.setByPath) === "function"
                            }
                            code="const setByPath = baseStore.use(store, (s) => s.setByPath);"
                        />
                        <Line />
                        <IsValid
                            isValid={
                                typeof baseStore.use(pathStore, (s) => [s.e3, s.setByPath])[1] ===
                                "function"
                            }
                            code={`const [e3, setByPath] = baseStore.use(
                                    store, (s) => [ s.e3, s.setByPath ]);`}
                        />
                        <Line />
                        <IsValid
                            isValid={typeof pathStore.setByPath === "function"}
                            code="const setByPath = store.setByPath;"
                        />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Access setByPath (non-React)"
                example={
                    <Flex.column gap={20}>
                        <Typo.code copy>
                            {`import { baseStore } from "${SYS.basePath}";
                            import { store } from "your-store-file";`}
                        </Typo.code>
                        <Line />
                        <IsValid
                            isValid={typeof pathStore.setByPath === "function"}
                            code="const setByPath = store.setByPath;"
                        />
                    </Flex.column>
                }
            />

            <Ds.block
                title="setByPath methods"
                example={
                    <Flex.column gap={10} padding={10} full>
                        <IsValid
                            isValid={nestedObjUsage === "path-usage"}
                            code='setByPath("nested.obj.usage", value);'
                        />
                        <Line />
                        <IsValid
                            isValid={arr2Usage === "arr-2-usage"}
                            code='setByPath("arr.2.usage", value);'
                        />
                        <Line />
                        <IsValid
                            isValid={staticDynamic === "dynamic-value"}
                            code='setByPath("staticPath." + dynamicPath, value);'
                        />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Access remove (React)"
                example={
                    <Flex.column gap={20}>
                        <Typo.code copy>
                            {`import { baseStore } from "${SYS.basePath}";
                            import { store } from "your-store-file";`}
                        </Typo.code>
                        <Line />
                        <IsValid
                            isValid={
                                typeof baseStore.use(removeStore, (s) => s.remove) === "function"
                            }
                            code="const remove = baseStore.use(store, (s) => s.remove);"
                        />
                        <Line />
                        <IsValid
                            isValid={
                                typeof baseStore.use(removeStore, (s) => [s.var1, s.remove])[1] ===
                                "function"
                            }
                            code={`const [var1, remove] = baseStore.use(store,
                                   (s) => [s.var1, s.remove]);`}
                        />
                        <Line />
                        <IsValid
                            isValid={typeof removeStore.remove === "function"}
                            code="const remove = store.remove;"
                        />
                    </Flex.column>
                }
            />

            <Ds.block
                title="remove methods"
                example={
                    <Flex.column gap={10} padding={10} full>
                        <IsValid isValid={var1Removed === undefined} code='remove("var1");' />
                        <Line />
                        <IsValid
                            isValid={objUsageRemoved === undefined}
                            code='remove("obj.path.usage");'
                        />
                        <Line />
                        <IsValid isValid={arr1Removed === undefined} code='remove("arr.1");' />
                    </Flex.column>
                }
            />
            <Ds.api
                title="create"
                disableLastBlock
                args="export const store = baseStore.create(initialState);"
                props={{
                    initialState: {
                        description: "Initial state object for the new store.",
                        type: "object",
                        defaultValue: "{}",
                    },
                }}
            />
            <Ds.api
                title="store"
                disableLastBlock
                args="export const store = baseStore.create(initialState);"
                props={{
                    store: {
                        description:
                            "Store instance returned from create. Draft updates go through a proxy in set().",
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
            <Ds.api
                title="use"
                args="const values = baseStore.use(store, selector);"
                props={{
                    store: {
                        description: "Store instance created with baseStore.create().",
                        type: "object",
                        required: true,
                    },
                    selector: {
                        description:
                            "Optional. Picks from state (and helpers: get, set, setByPath, remove). Return a single value, array, or object.",
                        type: "function",
                    },
                }}
                returnProps={{
                    values: {
                        description:
                            "Selector result, or full state with helpers when selector is omitted. Re-renders when selected slice changes.",
                        type: "any",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

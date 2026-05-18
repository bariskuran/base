import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { queryConverter } from ".";
import { baseStore } from "../@baseStore";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";

const exportSample = { page: 2, filter: { q: "test" }, list: ["a", "b"], flag: true };
const importSampleQs = "?page=2&filter[q]=test&list[0]=a&list[1]=b&flag=true";

const DEMO_STORE_INITIAL = {
    form: { currentForm: { page: 1, q: "old" } },
};

const demoStore = baseStore.create(DEMO_STORE_INITIAL);

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();
    const { set: setDemo, ...demo } = baseStore.use(demoStore);

    return (
        <Ds.page
            title="queryConverter"
            releasedOn="1.0.0"
            description="Nested object/query converter."
        >
            <Ds.block
                title="export"
                code={`import { queryConverter } from "${SYS.basePath}";

                        const qs = queryConverter.export({ page: 2, filter: { q: "test" } });`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Typo.code>sample = {JSON.stringify(exportSample, null, 2)}</Typo.code>
                        <Button.plain
                            label="queryConverter.export(sample)"
                            {...outputButtonProps({
                                path: "export",
                                activeLabel: "export",
                                fn: () => queryConverter.export(exportSample),
                            })}
                        />
                        <Output path="export" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="import"
                code={`import { queryConverter } from "${SYS.basePath}";
                    
                    const obj = queryConverter.import(
                        "?page=2&filter[q]=test&list[0]=a&list[1]=b&flag=true"
                    );`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Button.plain
                            label="queryConverter.import(sampleQs)"
                            {...outputButtonProps({
                                path: "import",
                                activeLabel: "import",
                                fn: () => queryConverter.import(importSampleQs),
                            })}
                        />
                        <Output path="import" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="preserveBooleans"
                description='Keeps "true" / "false" as strings instead of booleans.'
                code='queryConverter.import("flag=true", { preserveBooleans: true });'
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Button.plain
                            label="preserveBooleans: true"
                            {...outputButtonProps({
                                path: "preserveBooleans",
                                activeLabel: "preserveBooleans",
                                fn: () =>
                                    queryConverter.import("flag=true&count=3", {
                                        preserveBooleans: true,
                                    }),
                            })}
                        />
                        <Output path="preserveBooleans" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="preserveNumbers"
                description="Keeps numeric-looking values as strings."
                code='queryConverter.import("page=2", { preserveNumbers: true });'
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Button.plain
                            label="preserveNumbers: true"
                            {...outputButtonProps({
                                path: "preserveNumbers",
                                activeLabel: "preserveNumbers",
                                fn: () =>
                                    queryConverter.import("page=2&count=10", {
                                        preserveNumbers: true,
                                    }),
                            })}
                        />
                        <Output path="preserveNumbers" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="prefix (export)"
                description='Dot-separated query key namespace on export (e.g. "filters.form" → filters[form][obj1][value]=test).'
                code={`queryConverter.export({ obj1: { value: "test" }, page: 2 }, { prefix: "filters.form" });
                        // ?filters[form][obj1][value]=test&filters[form][page]=2`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Button.plain
                            label='export (prefix: "filters.form")'
                            {...outputButtonProps({
                                path: "prefixExport",
                                activeLabel: "prefixExport",
                                fn: () => {
                                    const qo = { obj1: { value: "test" }, page: 2 };
                                    const result = queryConverter.export(qo, {
                                        prefix: "filters.form",
                                    });
                                    const result2 = queryConverter.export(qo);
                                    return { result, result2 };
                                },
                            })}
                        />
                        <Output path="prefixExport" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="prefix (import)"
                description="Import unwraps only the prefix branch; keys outside the prefix are ignored (e.g. noise=1). Distinct from setPath (store dot path)."
                code={`queryConverter.import(
                            "?filters[form][obj1][value]=new&filters[form][page]=3&noise=1",
                            { prefix: "filters.form" },
                        );
                        // { obj1: { value: "new" }, page: 3 }`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Button.plain
                            label='import (prefix: "filters.form")'
                            {...outputButtonProps({
                                path: "prefixImport",
                                activeLabel: "prefixImport",
                                fn: () => {
                                    const qs =
                                        "?filters[form][obj1][value]=new&filters[form][page]=3&noise=1";
                                    const result = queryConverter.import(qs, {
                                        prefix: "filters.form",
                                    });
                                    const result2 = queryConverter.import(qs);
                                    return { result, result2 };
                                },
                            })}
                        />
                        <Output path="prefixImport" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="baseStore"
                description="Merges parsed query into the store via store.set (optional setPath). The store is updated in place; import still returns only the parsed payload."
                code={`const store = baseStore.create({
                            form: { currentForm: { page: 1, q: "old" } },
                        });
                        queryConverter.import("?page=2&q=new", {
                            baseStore: store,
                            setPath: "form.currentForm",
                        });
                        store.get(); // { form: { currentForm: { page: 2, q: "new", … } } }`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10}>
                            <Button.plain
                                label="baseStore + setPath"
                                {...outputButtonProps({
                                    path: "baseStore",
                                    activeLabel: "baseStore",
                                    fn: () => {
                                        queryConverter.import("?page=2&q=new&extra=1", {
                                            baseStore: demoStore,
                                            setPath: "form.currentForm",
                                        });
                                    },
                                })}
                            />
                            <Button.plain
                                label="Reset"
                                skipClickCooldown
                                skipOnClickHold
                                onClick={() => setDemo(DEMO_STORE_INITIAL)}
                            />
                        </Flex>
                        <Output path="baseStore" directValue={demo} />
                    </Flex.column>
                }
            />
            <Ds.block
                title="baseStoreSet"
                description="Pass set from baseStore.use (e.g. setDemo) — same draft merge as store.set. Takes precedence over baseStore."
                code={`const demoStore = baseStore.create({ form: { currentForm: { page: 1 } } });
                        const { set: setDemo } = baseStore.use(demoStore);
                        queryConverter.import("?page=2&q=new&extra=1", {
                            baseStoreSet: setDemo,
                            setPath: "form.currentForm",
                        });`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10}>
                            <Button.plain
                                label="baseStoreSet + setPath"
                                {...outputButtonProps({
                                    path: "baseStoreSet",
                                    activeLabel: "baseStoreSet",
                                    fn: () => {
                                        queryConverter.import("?page=2&q=new&extra=1", {
                                            baseStoreSet: setDemo,
                                            setPath: "form.currentForm",
                                        });
                                    },
                                })}
                            />
                            <Button.plain
                                label="Reset"
                                skipClickCooldown
                                skipOnClickHold
                                onClick={() => setDemo(DEMO_STORE_INITIAL)}
                            />
                        </Flex>
                        <Output path="baseStoreSet" directValue={demo} />
                    </Flex.column>
                }
            />
            <Ds.api
                title="export"
                disableLastBlock
                args="queryConverter.export(obj, { ignoreEncode, prefix, preserveEmpty })"
                returns="Query string (with leading ?)."
                props={{
                    preserveEmpty: {
                        description: "Keeps null/undefined/empty values.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    prefix: {
                        description:
                            'Dot-separated query key namespace (e.g. "filters.form" → filters[form][key]=…). Distinct from setPath, which selects a store branch.',
                        type: "string",
                    },
                    ignoreEncode: {
                        description: "Skips encodeURIComponent.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                }}
            />
            <Ds.api
                title="import"
                args="queryConverter.import(str, { baseStore, baseStoreSet, prefix, preserveBooleans, preserveNumbers, setPath })"
                returns="Parsed nested object. When baseStore or baseStoreSet is passed, state is merged via set; return value is still the parsed payload only."
                props={{
                    preserveBooleans: {
                        description: "Keeps boolean-like values as strings.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    preserveNumbers: {
                        description: "Keeps number-like values as strings.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    prefix: {
                        description:
                            'After parse, returns the object at the dot path (e.g. "filters.form" → parsed.filters.form). Pairs with export prefix. Distinct from setPath.',
                        type: "string",
                    },
                    baseStore: {
                        description:
                            "Store instance (non-hook). Uses store.set to merge at setPath (or root). Ignored when baseStoreSet is provided.",
                        type: "object",
                    },
                    baseStoreSet: {
                        description:
                            "set from baseStore.use (or setLocal from useLocal). Draft merge at setPath. Takes precedence over baseStore.",
                        type: "function",
                    },
                    setPath: {
                        description:
                            'Dot path in the store object for merge (e.g. "form.currentForm"). Only with baseStore / baseStoreSet. Omit to merge at store root.',
                        type: "string",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

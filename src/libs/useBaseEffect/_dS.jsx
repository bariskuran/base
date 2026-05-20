import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useBaseEffect } from ".";
import { useEffect, useRef, useState } from "react";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const useRenderCount = () => {
    const renderCount = useRef(0);
    renderCount.current += 1;
    return renderCount.current;
};

const EffectCompareStats = ({ title, effectRuns, renders }) => (
    <Flex.column gap={6} padding={10} bgColor="greys.shade15" radius={8} flex={1}>
        <Typo.span weight="bold">{title}</Typo.span>
        <Typo.span>{`component renders: ${renders}`}</Typo.span>
        <Typo.span>{`effect runs: ${effectRuns}`}</Typo.span>
    </Flex.column>
);

const UseEffectColumn = ({ syncKey }) => {
    const runsRef = useRef(0);
    const [effectRuns, setEffectRuns] = useState(0);
    const renders = useRenderCount();
    const config = { value: 1 };

    useEffect(() => {
        runsRef.current += 1;
    }, [config]);

    useEffect(() => {
        setEffectRuns(runsRef.current);
    }, [syncKey]);

    return <EffectCompareStats title="useEffect" effectRuns={effectRuns} renders={renders} />;
};

const UseBaseEffectColumn = ({ syncKey }) => {
    const runsRef = useRef(0);
    const [effectRuns, setEffectRuns] = useState(0);
    const renders = useRenderCount();
    const config = { value: 1 };

    useBaseEffect(() => {
        runsRef.current += 1;
    }, [config]);

    useEffect(() => {
        setEffectRuns(runsRef.current);
    }, [syncKey]);

    return <EffectCompareStats title="useBaseEffect" effectRuns={effectRuns} renders={renders} />;
};

const VsDemo = () => {
    const [tick, setTick] = useState(0);
    const [demoKey, setDemoKey] = useState(0);

    return (
        <Flex.column gap={10} full>
            <Typo.span size="s">
                The parent re-renders. The child creates{" "}
                <Typo.span weight="bold">config = {"{ value: 1 }"}</Typo.span> on every render (new
                reference, same value). useEffect runs again. useBaseEffect skips (deep equal).
            </Typo.span>
            <Flex gap={8} wrap align="center">
                <Button label="Parent re-render" onClick={() => setTick((v) => v + 1)} />
                <Typo.span color="greys.shade60" size="s">
                    {`tick: ${tick}`}
                </Typo.span>
                <Button.plain
                    label="Reset"
                    onClick={() => {
                        setTick(0);
                        setDemoKey((k) => k + 1);
                    }}
                />
            </Flex>
            <Flex gap={10} wrap full key={demoKey}>
                <UseEffectColumn syncKey={tick} />
                <UseBaseEffectColumn syncKey={tick} />
            </Flex>
        </Flex.column>
    );
};

const SkipEffectDemo = () => {
    const [skipEffect, setSkipEffect] = useState(false);
    const [version, setVersion] = useState(0);
    const [runs, setRuns] = useState(0);
    const config = { version };

    useBaseEffect(
        () => {
            setRuns((v) => v + 1);
        },
        [config],
        { skipEffect },
    );

    return (
        <Flex.column gap={10} full>
            <Flex gap={8} wrap align="center">
                <Button
                    label={`skipEffect: ${skipEffect}`}
                    onClick={() => setSkipEffect((v) => !v)}
                    activeManually={skipEffect}
                />
                <Button
                    label={`Change dep (${version})`}
                    onClick={() => setVersion((v) => v + 1)}
                    skipClickCooldown
                    skipOnClickHold
                />
            </Flex>
            <Typo.span>{`effect runs: ${runs}`}</Typo.span>
        </Flex.column>
    );
};

const UseFalsyDepsColumn = ({ useFalsyDeps, label, syncKey }) => {
    const runsRef = useRef(0);
    const [runs, setRuns] = useState(0);
    const renders = useRenderCount();
    const config = { value: 1 };

    useBaseEffect(
        () => {
            runsRef.current += 1;
        },
        [config],
        { useFalsyDeps },
    );

    useEffect(() => {
        setRuns(runsRef.current);
    }, [syncKey]);

    return <EffectCompareStats title={label} effectRuns={runs} renders={renders} />;
};

const FalsyDepsDemo = () => {
    const [tick, setTick] = useState(0);
    const [demoKey, setDemoKey] = useState(0);

    return (
        <Flex.column gap={10} full>
            <Typo.span size="s">
                useFalsyDeps true passes undefined deps to React and skips deep compare — the effect
                can run on every render. Counters use a ref (no setState inside the effect) to avoid
                infinite loops.
            </Typo.span>
            <Flex gap={8} wrap align="center">
                <Button label="Parent re-render" onClick={() => setTick((v) => v + 1)} />
                <Typo.span color="greys.shade60" size="s">
                    {`tick: ${tick}`}
                </Typo.span>
                <Button.plain
                    label="Reset"
                    onClick={() => {
                        setTick(0);
                        setDemoKey((k) => k + 1);
                    }}
                />
            </Flex>
            <Flex gap={10} wrap full key={demoKey}>
                <UseFalsyDepsColumn
                    useFalsyDeps={false}
                    label="useFalsyDeps: false"
                    syncKey={tick}
                />
                <UseFalsyDepsColumn useFalsyDeps label="useFalsyDeps: true" syncKey={tick} />
            </Flex>
        </Flex.column>
    );
};

const FindDifferencesDemo = () => {
    const [user, setUser] = useState({ name: "Baris", age: 30 });
    const [payload, setPayload] = useState(null);

    useBaseEffect(
        ({ differences }) => {
            setPayload(differences);
        },
        [user],
        { findDifferences: true },
    );

    return (
        <Flex.column gap={10} full>
            <Typo.code>{JSON.stringify(user, null, 2)}</Typo.code>
            <Flex gap={8} wrap>
                <Button label="age +1" onClick={() => setUser((u) => ({ ...u, age: u.age + 1 }))} />
                <Button
                    label="toggle name"
                    onClick={() =>
                        setUser((u) => ({
                            ...u,
                            name: u.name === "Baris" ? "Barış" : "Baris",
                        }))
                    }
                />
            </Flex>
            <Flex.column gap={6} padding={10} bgColor="greys.shade10" radius={8} full>
                <Typo.span weight="bold">fn({"{ differences }"})</Typo.span>
                <Typo.code whiteSpace="pre-wrap">
                    {payload ? JSON.stringify(payload, null, 2) : "—"}
                </Typo.code>
            </Flex.column>
            <Typo.span color="greys.shade60" size="s">
                Click age +1 or toggle name — changedPaths should list name or age (single dep
                unwraps the deps array).
            </Typo.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="useBaseEffect()"
        releasedOn="1.0.0"
        description={`useBaseEffect is an alternative to React useEffect with deep dependency comparison.

            For objects and arrays in deps, the effect runs only when the content really changes — not when only the reference changes. This can reduce extra work. Deep compare costs more on very large data.

            Options: skipEffect turns the effect off. useFalsyDeps runs on every render (like useEffect with no deps). findDifferences passes a diff object to the callback. executeOnDev runs only in dev mode. return sets a cleanup function.

            To skip the first mount, use the separate useEffectAfterMount hook.`}
    >
        <Ds.block
            title="useEffect vs useBaseEffect"
            description="Same content, new reference every render: useEffect runs again; useBaseEffect does not (deep equal)."
            code={`import { useEffect, useBaseEffect } from "${SYS.basePath}";

                    const config = { value: 1 };

                    useEffect(() => { /* runs on ref change */ }, [config]);
                    useBaseEffect(() => { /* skips if content is equal */ }, [config]);`}
            example={<VsDemo />}
        />

        <Ds.block
            title="skipEffect"
            description="When true, hasChanged is always false — the callback never runs, even if deps change. Useful to pause side effects."
            code={`import { useBaseEffect } from "${SYS.basePath}";

                    useBaseEffect(
                        () => { /* ... */ },
                        [config],
                        { skipEffect: isPaused },
                    );`}
            example={<SkipEffectDemo />}
        />

        <Ds.block
            title="useFalsyDeps"
            description="When true, React gets undefined deps and deep compare is off — the effect may run on every render. Similar to useEffect(fn) without a deps array."
            code={`import { useBaseEffect } from "${SYS.basePath}";

                    useBaseEffect(
                        () => { /* may run every render */ },
                        [config],
                        { useFalsyDeps: true },
                    );`}
            example={<FalsyDepsDemo />}
        />

        <Ds.block
            title="findDifferences"
            description="When true, the callback is fn({ differences }). With one dep, paths are on that value (e.g. name). With multiple deps, paths use indices (e.g. 0.name, 1.id)."
            code={`import { useBaseEffect } from "${SYS.basePath}";

                    useBaseEffect(
                        ({ differences }) => {
                            const { changedPaths, differences: tree } = differences;
                        },
                        [user],
                        { findDifferences: true },
                    );`}
            example={<FindDifferencesDemo />}
        />

        <Ds.api
            args="useBaseEffect(fn, deps, { executeOnDev, findDifferences, return, skipEffect, useFalsyDeps });"
            returns="void; fn may return a cleanup function."
            props={{
                fn: {
                    description:
                        "Effect callback. Default: fn(). With findDifferences: fn({ differences }) where differences is { changedPaths, differences }.",
                    type: "function",
                    required: true,
                },
                deps: {
                    description:
                        "Dependency array. With useFalsyDeps true, React receives undefined.",
                    type: "any[]",
                    defaultValue: "[]",
                },
                skipEffect: {
                    description: "When true, the effect never runs (hasChanged is always false).",
                    type: "boolean",
                    defaultValue: "false",
                },
                return: {
                    description:
                        "Optional cleanup function used instead of a return value from fn.",
                    type: "function",
                },
                useFalsyDeps: {
                    description:
                        "When true, deep compare is off and the effect may run every render.",
                    type: "boolean",
                    defaultValue: "false",
                },
                executeOnDev: {
                    description:
                        "When true, the effect runs only when baseStore isDevMode is true.",
                    type: "boolean",
                    defaultValue: "false",
                },
                findDifferences: {
                    description:
                        "When true, fn receives { differences }. One dep: diff that value. Multiple deps: diff the full deps array (indexed paths).",
                    type: "boolean",
                    defaultValue: "false",
                },
            }}
        />
    </Ds.page>
);

export default X;

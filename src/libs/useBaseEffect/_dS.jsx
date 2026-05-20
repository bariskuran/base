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
        <Typo.span weight="bold">{title} Component</Typo.span>
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

const UseBaseEffectColumn = () => {
    const [effectRuns, setEffectRuns] = useState(0);
    const renders = useRenderCount();
    const config = { value: 1 };

    useBaseEffect(() => {
        setEffectRuns((v) => v + 1);
    }, [config]);

    return <EffectCompareStats title="useBaseEffect" effectRuns={effectRuns} renders={renders} />;
};

const Demo = () => {
    const [tick, setParentTick] = useState(0);
    const [demoKey, setDemoKey] = useState(0);

    return (
        <Flex.column gap={10} full>
            <Typo.span size="s">
                <Typo.span weight="bold">parentTick</Typo.span> deps listesinde yok; sadece
                parent&apos;ı yeniden render eder. Child her seferinde{" "}
                <Typo.span weight="bold">config = {"{ value: 1 }"}</Typo.span> ile yeni obje
                oluşturur — useEffect bunu değişiklik sayar (Object.is referans karşılaştırması).
            </Typo.span>
            <Flex gap={8} wrap align="center">
                <Button label="Parent re-render" onClick={() => setParentTick((v) => v + 1)} />
                <Typo.span color="greys.shade60" size="s">
                    {`parentTick: ${tick}`}
                </Typo.span>
                <Button.plain
                    label="Sıfırla"
                    onClick={() => {
                        setParentTick(0);
                        setDemoKey((k) => k + 1);
                    }}
                />
            </Flex>
            <Typo.span color="greys.shade60" size="s">
                Mount: ikisinde effect runs 1. Her parent re-render: useEffect +1 (veya +2 sayaç
                senkronu), useBaseEffect aynı kalır. component renders ikisinde de artar.
            </Typo.span>
            <Flex gap={10} wrap full key={demoKey}>
                <UseEffectColumn syncKey={tick} />
                <UseBaseEffectColumn />
            </Flex>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="useBaseEffect()"
        releasedOn="1.0.0"
        description={`useBaseEffect is a utility hook developed as an alternative to React's useEffect, designed to more effectively track deep dependencies.

            Its advantage lies in performing deep comparison, rather than shallow, on reference types such as objects and arrays in the dependency list—triggering the effect only when a true change occurs.

            This helps reduce unnecessary renders and effect executions. However, the downside is that deep comparison introduces additional computational overhead, so performance impacts may be observed with large data structures.

            Additionally, you have flexible control through options to configure whether it runs on mount or only in development mode.`}
    >
        <Ds.block
            title="useEffect vs useBaseEffect"
            description="Aynı içerikli obje her render'da yeni referans: useEffect gereksiz tetiklenir, useBaseEffect derin eşitlik sayesinde tetiklenmez."
            code={`import { useEffect, useBaseEffect } from "${SYS.basePath}";

                    useBaseEffect(() => {}, [config]);`}
            example={<Demo />}
        />
        <Ds.api
            args="useBaseEffect(fn, deps, { executeOnDev, findDifferences, return, skipEffect, useFalsyDeps });"
            returns="void; effect may return a cleanup from fn."
            props={{
                fn: {
                    description: "Effect callback.",
                    type: "function",
                    required: true,
                },
                deps: {
                    description: "Dependency list.",
                    type: "any[]",
                    defaultValue: "[]",
                },
                skipEffect: {
                    description: "Skips effect execution.",
                    type: "boolean",
                    defaultValue: "false",
                },
                return: {
                    description: "Cleanup function.",
                    type: "function",
                },
                useFalsyDeps: {
                    description: "Runs with no fixed deps array.",
                    type: "boolean",
                    defaultValue: "false",
                },
                executeOnDev: {
                    description: "Runs only in dev mode.",
                    type: "boolean",
                    defaultValue: "false",
                },
                findDifferences: {
                    description: "Passes dependency differences to callback.",
                    type: "boolean",
                    defaultValue: "false",
                },
            }}
        />
    </Ds.page>
);

export default X;

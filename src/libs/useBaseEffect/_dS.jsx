import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useBaseEffect } from ".";
import { useState } from "react";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const Demo = () => {
    const [count, setCount] = useState(0);
    const [runs, setRuns] = useState(0);

    useBaseEffect(
        () => {
            setRuns((v) => v + 1);
        },
        [count],
        { useEffectAfterMount: true },
    );

    return (
        <Flex.column gap={8}>
            <Button label={`count: ${count}`} onClick={() => setCount((v) => v + 1)} />
            <Typo.span>{`effect runs(after mount): ${runs}`}</Typo.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="useBaseEffect()"
        releasedOn="1.0.0"
        description="Deep-aware effect helper hook."
    >
        <Ds.block
            title="After-Mount Effect"
            code={`import { useBaseEffect } from "${SYS.basePath}";

                        useBaseEffect(() => {
                        // run on dependency changes
                        }, [value], { useEffectAfterMount: true });`}
            example={<Demo />}
        />
        <Ds.api
            args="useBaseEffect(fn, deps, { skipEffect, useEffectAfterMount, return: cleanup, useFalsyDeps, executeOnDev, findDifferences });"
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
                useEffectAfterMount: {
                    description: "Skips first render run.",
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

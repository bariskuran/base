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
        <Flex.column xAlign="start" gap={8}>
            <Button label={`count: ${count}`} onClick={() => setCount((v) => v + 1)} />
            <Typo.span>{`effect runs(after mount): ${runs}`}</Typo.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="<useBaseEffect>"
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
            props={{
                fn: {
                    description: "Effect callback.",
                    type: "function",
                    required: true,
                    defaultValue: "undefined",
                },
                deps: {
                    description: "Dependency list.",
                    type: "any[]",
                    required: false,
                    defaultValue: "[]",
                },
                settings: {
                    description: "Behavior options.",
                    type: "object",
                    required: false,
                    defaultValue: "{}",
                },
                "settings.skipEffect": {
                    description: "Skips effect execution.",
                    type: "boolean",
                    required: false,
                    defaultValue: "false",
                },
                "settings.useEffectAfterMount": {
                    description: "Skips first render run.",
                    type: "boolean",
                    required: false,
                    defaultValue: "false",
                },
                "settings.return": {
                    description: "Cleanup function.",
                    type: "function",
                    required: false,
                    defaultValue: "undefined",
                },
                "settings.useFalsyDeps": {
                    description: "Runs with no fixed deps array.",
                    type: "boolean",
                    required: false,
                    defaultValue: "false",
                },
                "settings.executeOnDev": {
                    description: "Runs only in dev mode.",
                    type: "boolean",
                    required: false,
                    defaultValue: "false",
                },
                "settings.findDifferences": {
                    description: "Passes dependency differences to callback.",
                    type: "boolean",
                    required: false,
                    defaultValue: "false",
                },
            }}
        />
    </Ds.page>
);

export default X;

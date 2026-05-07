import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useEffectAfterMount } from ".";
import { useState } from "react";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const Demo = () => {
    const [count, setCount] = useState(0);
    const [effectCount, setEffectCount] = useState(0);

    useEffectAfterMount(() => {
        setEffectCount((v) => v + 1);
    }, [count]);

    return (
        <Flex.column xAlign="start" gap={8}>
            <Button label={`count: ${count}`} onClick={() => setCount((v) => v + 1)} />
            <Typo.span>{`effect runs(after first render): ${effectCount}`}</Typo.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="useEffectAfterMount()"
        releasedOn="1.0.0"
        description="Runs effect only after first mount render."
    >
        <Ds.block
            title="Skip First Render"
            code={`import { useEffectAfterMount } from "${SYS.basePath}";

useEffectAfterMount(() => {
  // runs after mount on dependency updates
}, [value]);`}
            example={<Demo />}
        />
        <Ds.api
            args="useEffectAfterMount(effect, deps);"
            returns="void."
            props={{
                effect: {
                    description: "Effect callback.",
                    type: "function",
                    required: true,
                },
                deps: {
                    description: "Dependency array.",
                    type: "any[]",
                    defaultValue: "[]",
                },
            }}
        />
    </Ds.page>
);

export default X;

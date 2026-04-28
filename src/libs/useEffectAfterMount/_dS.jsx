import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useEffectAfterMount } from ".";
import { useState } from "react";
import { Button } from "../Button";
import { Typography } from "../Typography";
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
            <Typography.span>{`effect runs(after first render): ${effectCount}`}</Typography.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page title="<useEffectAfterMount>" releasedOn="1.0.0" description="Runs effect only after first mount render.">
        <Ds.block
            title="Skip First Render"
            code={`import { useEffectAfterMount } from "${SYS.basePath}";

useEffectAfterMount(() => {
  // runs after mount on dependency updates
}, [value]);`}
            example={<Demo />}
        />
        <Ds.api
            props={{
                effect: { description: "Effect callback.", type: "function", required: true, defaultValue: "undefined" },
                deps: { description: "Dependency array.", type: "any[]", required: false, defaultValue: "[]" },
            }}
        />
    </Ds.page>
);

export default X;

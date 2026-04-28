import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useObserver } from ".";
import { Typography } from "../Typography";
import { Card } from "../Card";
import { Flex } from "../Flex";

const Demo = () => {
    const { ref, inViewport } = useObserver({ threshold: 0.2 });
    return (
        <Flex.column xAlign="start" gap={8}>
            <Typography.span>{`inViewport: ${String(inViewport)}`}</Typography.span>
            <Card ref={ref} padding={10}>
                Observed element
            </Card>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page title="<useObserver>" releasedOn="1.0.0" description="IntersectionObserver wrapper hook.">
        <Ds.block
            title="Viewport Entry Tracking"
            code={`import { useObserver } from "${SYS.basePath}";

const { ref, inViewport } = useObserver({ threshold: 0.2 });`}
            example={<Demo />}
        />
        <Ds.api
            props={{
                options: { description: "Observer options object.", type: "object", required: false, defaultValue: "{}" },
                "options.onEnter": { description: "Called when element enters viewport.", type: "function", required: false, defaultValue: "undefined" },
                "options.onExit": { description: "Called when element exits viewport.", type: "function", required: false, defaultValue: "undefined" },
                "options.threshold": { description: "Intersection threshold value(s).", type: "number | number[]", required: false, defaultValue: "0.1" },
                "options.rootMargin": { description: "Observer root margin.", type: "number | string", required: false, defaultValue: "0" },
                "options.root": { description: "Custom root element.", type: "Element | null", required: false, defaultValue: "null" },
                "options.disable": { description: "Disables observer setup.", type: "boolean", required: false, defaultValue: "false" },
                return: { description: "Observer helpers { ref, inViewport }.", type: "object", required: true, defaultValue: "{ ref, false }" },
            }}
        />
    </Ds.page>
);

export default X;

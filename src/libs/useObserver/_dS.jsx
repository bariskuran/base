import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useObserver } from ".";
import { Typo } from "../Typo";
import { Card } from "../Card";
import { Flex } from "../Flex";

const Demo = () => {
    const { ref, inViewport } = useObserver({ threshold: 0.2 });
    return (
        <Flex.column gap={8}>
            <Typo.span>{`inViewport: ${String(inViewport)}`}</Typo.span>
            <Card ref={ref} padding={10}>
                Observed element
            </Card>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="useObserver()"
        releasedOn="1.0.0"
        description="IntersectionObserver wrapper hook."
    >
        <Ds.block
            title="Viewport Entry Tracking"
            code={`import { useObserver } from "${SYS.basePath}";

const { ref, inViewport } = useObserver({ threshold: 0.2 });`}
            example={<Demo />}
        />
        <Ds.api
            args="useObserver(options);"
            returns="Object with ref callback and inViewport flag."
            props={{
                options: {
                    description: "Observer options object.",
                    type: "object",
                    defaultValue: "{}",
                },
                "options.onEnter": {
                    description: "Called when element enters viewport.",
                    type: "function",
                },
                "options.onExit": {
                    description: "Called when element exits viewport.",
                    type: "function",
                },
                "options.threshold": {
                    description: "Intersection threshold value(s).",
                    type: "number | number[]",
                    defaultValue: "0.1",
                },
                "options.rootMargin": {
                    description: "Observer root margin.",
                    type: "number | string",
                    defaultValue: "0",
                },
                "options.root": {
                    description: "Custom root element.",
                    type: "Element | null",
                },
                "options.disable": {
                    description: "Disables observer setup.",
                    type: "boolean",
                    defaultValue: "false",
                },
            }}
        />
    </Ds.page>
);

export default X;

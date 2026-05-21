import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useObserver } from ".";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const X = () => {
    const { ref, inViewport } = useObserver({ threshold: 0.2 });

    return (
        <Ds.page
            title="useObserver()"
            releasedOn="1.0.0"
            description="IntersectionObserver wrapper hook."
        >
            <Ds.block
                title="Viewport Entry Tracking"
                code={`import { useObserver } from "${SYS.basePath}";

const { ref, inViewport } = useObserver({ threshold: 0.2 });`}
                example={
                    <Flex.column gap={8}>
                        <Typo.span>{`inViewport: ${String(inViewport)}`}</Typo.span>
                        <Flex ref={ref} padding={10} bgColor="greys.shade10">
                            Observed element
                        </Flex>
                    </Flex.column>
                }
            />
            <Ds.api
                args="const { ref, inViewport } = useObserver({ disable, onEnter, onExit, root, rootMargin, threshold });"
                props={{
                    disable: {
                        description: "Disables observer setup.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    onEnter: {
                        description: "Called when element enters viewport.",
                        type: "function",
                    },
                    onExit: {
                        description: "Called when element exits viewport.",
                        type: "function",
                    },
                    root: {
                        description: "Custom root element.",
                        type: "Element | null",
                    },
                    rootMargin: {
                        description: "Observer root margin.",
                        type: "number | string",
                        defaultValue: "0",
                    },
                    threshold: {
                        description: "Intersection threshold value(s).",
                        type: "number | number[]",
                        defaultValue: "0.1",
                    },
                }}
                returnProps={{
                    ref: {
                        description: "Ref callback to attach to the observed element.",
                        type: "function",
                    },
                    inViewport: {
                        description: "True when the element intersects the root/viewport.",
                        type: "boolean",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

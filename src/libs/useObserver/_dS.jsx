import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useObserver } from ".";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const Demo = () => {
    const { ref, inViewport } = useObserver({ threshold: 0.2 });
    return (
        <Flex.column gap={8}>
            <Typo.span>{`inViewport: ${String(inViewport)}`}</Typo.span>
            <Flex ref={ref} padding={10} bgColor="greys.shade10">
                Observed element
            </Flex>
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
            args="useObserver({ disable, onEnter, onExit, root, rootMargin, threshold })"
            returns="Object with ref callback and inViewport flag."
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
        />
    </Ds.page>
);

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useEventListener } from ".";
import { useState } from "react";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const Demo = () => {
    const [count, setCount] = useState(0);

    useEventListener(
        "click",
        () => {
            setCount((v) => v + 1);
        },
        { delay: 0, source: typeof window !== "undefined" ? window : undefined },
    );

    return (
        <Flex.column xAlign="start" gap={8}>
            <Typo.span>Click anywhere in page</Typo.span>
            <Typo.span>{`captured clicks: ${count}`}</Typo.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="useEventListener()"
        releasedOn="1.0.0"
        description="Event listener hook with debounce/throttle options."
    >
        <Ds.block
            title="Window Event Listener"
            code={`import { useEventListener } from "${SYS.basePath}";

useEventListener("scroll", onScroll, { delay: 200, isThrottle: true });`}
            example={<Demo />}
        />
        <Ds.api
            args="useEventListener(event, handler, { enabled, delay, isThrottle, getFirst, source, capture, once, passive, onStart, onEnd });"
            returns="void."
            props={{
                event: {
                    description: "Event name or names.",
                    type: "string | string[]",
                    required: true,
                },
                handler: {
                    description: "Event callback.",
                    type: "function",
                    required: true,
                },
                enabled: {
                    description: "Enables listener.",
                    type: "boolean",
                    defaultValue: "true",
                },
                delay: {
                    description: "Debounce/throttle delay.",
                    type: "number",
                    defaultValue: "500",
                },
                isThrottle: {
                    description: "Uses throttle mode.",
                    type: "boolean",
                    defaultValue: "true",
                },
                getFirst: {
                    description: "Runs first call immediately.",
                    type: "boolean",
                    defaultValue: "false",
                },
                source: {
                    description: "Event source target.",
                    type: "EventTarget",
                    defaultValue: "window",
                },
                capture: {
                    description: "Capture phase option.",
                    type: "boolean",
                },
                once: {
                    description: "Once option.",
                    type: "boolean",
                },
                passive: {
                    description: "Passive option.",
                    type: "boolean",
                },
                onStart: {
                    description: "Debounce start callback.",
                    type: "function",
                },
                onEnd: {
                    description: "Debounce end callback.",
                    type: "function",
                },
            }}
        />
    </Ds.page>
);

export default X;

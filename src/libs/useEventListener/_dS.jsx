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
        title="<useEventListener>"
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
            props={{
                event: {
                    description: "Event name or names.",
                    type: "string | string[]",
                    required: true,
                    defaultValue: "undefined",
                },
                handler: {
                    description: "Event callback.",
                    type: "function",
                    required: true,
                    defaultValue: "undefined",
                },
                settings: {
                    description: "Listener options.",
                    type: "object",
                    required: false,
                    defaultValue: "{}",
                },
                "settings.enabled": {
                    description: "Enables listener.",
                    type: "boolean",
                    required: false,
                    defaultValue: "true",
                },
                "settings.delay": {
                    description: "Debounce/throttle delay.",
                    type: "number",
                    required: false,
                    defaultValue: "500",
                },
                "settings.isThrottle": {
                    description: "Uses throttle mode.",
                    type: "boolean",
                    required: false,
                    defaultValue: "true",
                },
                "settings.getFirst": {
                    description: "Runs first call immediately.",
                    type: "boolean",
                    required: false,
                    defaultValue: "false",
                },
                "settings.source": {
                    description: "Event source target.",
                    type: "EventTarget",
                    required: false,
                    defaultValue: "window",
                },
                "settings.capture": {
                    description: "Capture phase option.",
                    type: "boolean",
                    required: false,
                    defaultValue: "undefined",
                },
                "settings.once": {
                    description: "Once option.",
                    type: "boolean",
                    required: false,
                    defaultValue: "undefined",
                },
                "settings.passive": {
                    description: "Passive option.",
                    type: "boolean",
                    required: false,
                    defaultValue: "undefined",
                },
                "settings.onStart": {
                    description: "Debounce start callback.",
                    type: "function",
                    required: false,
                    defaultValue: "undefined",
                },
                "settings.onEnd": {
                    description: "Debounce end callback.",
                    type: "function",
                    required: false,
                    defaultValue: "undefined",
                },
            }}
        />
    </Ds.page>
);

export default X;

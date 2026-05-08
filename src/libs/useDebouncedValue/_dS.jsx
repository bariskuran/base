import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useDebouncedValue } from ".";
import { Input } from "../Input";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const Demo = () => {
    const [debouncedValue, setValue, state] = useDebouncedValue("", { delay: 500 });

    return (
        <Flex.column xAlign="start" gap={8}>
            <Input
                value={state.value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Type fast..."
            />
            <Typo.span>{`raw: ${state.value || "-"}`}</Typo.span>
            <Typo.span>{`debounced: ${debouncedValue || "-"}`}</Typo.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="useDebouncedValue()"
        releasedOn="1.0.0"
        description="State value with debounce/throttle behavior."
    >
        <Ds.block
            title="Debounced Input Value"
            code={`import { useDebouncedValue } from "${SYS.basePath}";

const [debouncedValue, setValue, state] = useDebouncedValue("", { delay: 500 });`}
            example={<Demo />}
        />
        <Ds.api
            args="useDebouncedValue(initialValue, { delay, isThrottle, enabled });"
            returns="Tuple: debounced value, setValue, and state helpers."
            props={{
                initialValue: {
                    description: "Initial state value.",
                    type: "any",
                    required: true,
                },
                delay: {
                    description: "Delay in milliseconds.",
                    type: "number",
                    defaultValue: "500",
                },
                isThrottle: {
                    description: "Throttle mode.",
                    type: "boolean",
                    defaultValue: "false",
                },
                enabled: {
                    description: "Enables debounce/throttle behavior.",
                    type: "boolean",
                    defaultValue: "true",
                },
            }}
        />
    </Ds.page>
);

export default X;

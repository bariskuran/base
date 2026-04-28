import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useDebouncedValue } from ".";
import { Input } from "../Input";
import { Typography } from "../Typography";
import { Flex } from "../Flex";

const Demo = () => {
    const [debouncedValue, setValue, state] = useDebouncedValue("", { delay: 500 });

    return (
        <Flex.column xAlign="start" gap={8}>
            <Input value={state.value} onChange={(e) => setValue(e.target.value)} placeholder="Type fast..." />
            <Typography.span>{`raw: ${state.value || "-"}`}</Typography.span>
            <Typography.span>{`debounced: ${debouncedValue || "-"}`}</Typography.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page title="<useDebouncedValue>" releasedOn="1.0.0" description="State value with debounce/throttle behavior.">
        <Ds.block
            title="Debounced Input Value"
            code={`import { useDebouncedValue } from "${SYS.basePath}";

const [debouncedValue, setValue, state] = useDebouncedValue("", { delay: 500 });`}
            example={<Demo />}
        />
        <Ds.api
            props={{
                initialValue: { description: "Initial state value.", type: "any", required: true, defaultValue: "undefined" },
                settings: { description: "Debounce behavior options.", type: "object", required: false, defaultValue: "{}" },
                "settings.delay": { description: "Delay in milliseconds.", type: "number", required: false, defaultValue: "500" },
                "settings.isThrottle": { description: "Throttle mode.", type: "boolean", required: false, defaultValue: "false" },
                "settings.enabled": { description: "Enables debounce/throttle behavior.", type: "boolean", required: false, defaultValue: "true" },
                return: {
                    description: "[debouncedValue, setValue, { value, setDebouncedValue, reset, isWaiting }]",
                    type: "array",
                    required: true,
                    defaultValue: "computed",
                },
            }}
        />
    </Ds.page>
);

export default X;

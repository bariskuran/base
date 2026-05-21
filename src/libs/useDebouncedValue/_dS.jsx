import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useDebouncedValue } from ".";
import { TextArea } from "../TextArea";
import { Typo } from "../Typo";
import { Flex } from "../Flex";
import { Button } from "../Button";

const BasicUsageDemo = () => {
    const [debouncedValue, setValue, state] = useDebouncedValue("Type fast", { delay: 1000 });

    return (
        <Flex.column gap={8} full>
            <Flex maxWidth={300}>
                <TextArea value={state.value} onChange={setValue} />
            </Flex>
            <Flex gap={8} wrap>
                <Button
                    label="setDebouncedValue"
                    onClick={() => state.setDebouncedValue("Synced now")}
                />
                <Button label="reset" onClick={() => state.reset()} />
            </Flex>
            <Typo.span>{`value: ${state.value || "-"}`}</Typo.span>
            <Typo.span>{`debounced: ${debouncedValue || "-"}`}</Typo.span>
            <Typo.span color="greys.shade60" size="s">
                Debounced updates 1000ms after you stop. setDebouncedValue skips the wait; reset
                restores the initial value.
            </Typo.span>
        </Flex.column>
    );
};

const ThrottleDemo = () => {
    const [debouncedValue, setValue, { value, isWaiting }] = useDebouncedValue("Type fast", {
        delay: 1000,
        isThrottle: true,
    });

    return (
        <Flex.column gap={8} full>
            <Flex maxWidth={300}>
                <TextArea value={value} onChange={setValue} />
            </Flex>
            <Typo.span>{`debounced: ${debouncedValue || "-"}`}</Typo.span>
            <Typo.span>{`isWaiting: ${String(isWaiting)}`}</Typo.span>
            <Typo.span color="greys.shade60" size="s">
                Throttle commits at most once per 1000ms. isWaiting is true during the cooldown
                window.
            </Typo.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="useDebouncedValue()"
        releasedOn="1.0.0"
        description="useDebouncedValue keeps a raw value and a delayed copy. Debounce (default) updates after you stop changing the value. Throttle updates at most once per delay window."
    >
        <Ds.block
            title="Basic Usage"
            code={`import { useDebouncedValue } from "${SYS.basePath}";
                    import { TextArea, Button } from "${SYS.basePath}";

                    const [debouncedValue, setValue, { value, setDebouncedValue, reset }] = useDebouncedValue("", {                     delay: 500 });

                    <TextArea value={value} onChange={setValue} />
                    <Button label="setDebouncedValue" onClick={() => setDebouncedValue("Synced now")} />
                    <Button label="reset" onClick={() => reset()} />`}
            example={<BasicUsageDemo />}
        />
        <Ds.block
            title="Throttle and isWaiting"
            code={`import { useDebouncedValue } from "${SYS.basePath}";

                    const [debouncedValue, setValue, { value, isWaiting }] = useDebouncedValue("", {
                        delay: 1000,
                        isThrottle: true,
                    });`}
            example={<ThrottleDemo />}
        />
        <Ds.api
            args="const [debouncedValue, setValue, { value, setDebouncedValue, reset, isWaiting }] = useDebouncedValue(initialValue, { delay, enabled, isThrottle });"
            props={{
                initialValue: {
                    description: "Initial value",
                    type: "any",
                    required: true,
                },
                delay: {
                    description: "Delay in milliseconds.",
                    type: "number",
                    defaultValue: "500",
                },
                isThrottle: {
                    description: "When true, uses throttle instead of debounce.",
                    type: "boolean",
                },
                enabled: {
                    description: "When false, debouncedValue follows value immediately.",
                    type: "boolean",
                },
            }}
            returnProps={{
                debouncedValue: {
                    description: "Delayed copy of the value (tuple index 0).",
                    type: "any",
                },
                setValue: {
                    description: "Updates the raw value immediately (tuple index 1).",
                    type: "fn",
                },
                value: {
                    description: "Current raw value (third item: state.value).",
                    type: "any",
                },
                setDebouncedValue: {
                    description: "Sets debouncedValue directly without waiting for delay.",
                    type: "fn",
                },
                reset: {
                    description:
                        "Resets value and debouncedValue to initialValue or an optional next value.",
                    type: "fn",
                },
                isWaiting: {
                    description: "True during throttle cooldown (isThrottle only).",
                    type: "boolean",
                },
            }}
        />
    </Ds.page>
);

export default X;

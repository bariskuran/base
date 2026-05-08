import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { isEqual, useIsEqual } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";
import { Button } from "../Button";
import { Space } from "../Space";

const X = () => {
    const { value, output, setLocal } = baseStore.useLocal({
        value: { a: 1, b: { c: 2 } },
        output: null,
    });
    const stable = useIsEqual(value);

    return (
        <Ds.page title="isEqual()" releasedOn="1.0.0" description="Deep equality checker utility.">
            <Ds.block
                title="Basic usage"
                code={`import { isEqual } from "${SYS.basePath}";

isEqual({ a: 1 }, { a: 1 });

isEqual([1, 2], [2, 1]);`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button.string
                            label="Run isEqual({ a: 1 }, { a: 1 })"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(isEqual({ a: 1 }, { a: 1 }));
                                })
                            }
                        />
                        <Button.string
                            label="Run isEqual([1, 2], [2, 1])"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(isEqual([1, 2], [2, 1]));
                                })
                            }
                        />
                        <Space size="l" />
                        {output != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.code>{output}</Typo.code>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.block
                title="useIsEqual hook"
                code={`import { useIsEqual } from "${SYS.basePath}";

const stableValue = useIsEqual(value);`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button
                            label="Set same deep value"
                            onClick={() =>
                                setLocal((s) => {
                                    s.value = { a: 1, b: { c: 2 } };
                                })
                            }
                        />
                        <Typo.span balance>Stable reference (JSON for display):</Typo.span>
                        <Typo.code>{JSON.stringify(stable)}</Typo.code>
                    </Flex.column>
                }
            />
            <Ds.api
                args={[
                    "isEqual(a, b, { treatFalsiesAsEqual, maxKeys, maxDepth, useHashShortcut });",
                    "useIsEqual(value);",
                ]}
                returns="isEqual: boolean; useIsEqual: stable reference when deep-equal."
                props={{
                    a: {
                        description: "First value (isEqual).",
                        type: "any",
                        required: true,
                    },
                    b: {
                        description: "Second value (isEqual).",
                        type: "any",
                        required: true,
                    },
                    treatFalsiesAsEqual: {
                        description: "Treats falsy values as equal in comparisons.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    maxKeys: {
                        description: "Maximum key count guard for deep checks.",
                        type: "number",
                        defaultValue: "500",
                    },
                    maxDepth: {
                        description: "Maximum recursion depth for deep checks.",
                        type: "number",
                        defaultValue: "10",
                    },
                    useHashShortcut: {
                        description: "Uses hash shortcut before deep walk.",
                        type: "boolean",
                        defaultValue: "true",
                    },
                    value: {
                        description: "Tracked value (useIsEqual).",
                        type: "any",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

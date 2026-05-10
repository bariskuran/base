import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { shallowEqual } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });

    return (
        <Ds.page
            title="shallowEqual()"
            releasedOn="1.0.0"
            description="Shallow compare for arrays/plain objects."
        >
            <Ds.block
                title="Object and array checks"
                code={`import { shallowEqual } from "${SYS.basePath}";

shallowEqual({ a: 1 }, { a: 1 });

shallowEqual([1, 2], [1, 2]);

shallowEqual({ a: { b: 1 } }, { a: { b: 1 } });`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Button.string
                            label="Run shallowEqual({ a: 1 }, { a: 1 })"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(shallowEqual({ a: 1 }, { a: 1 }));
                                })
                            }
                        />
                        <Button.string
                            label="Run shallowEqual([1, 2], [1, 2])"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(shallowEqual([1, 2], [1, 2]));
                                })
                            }
                        />
                        <Button.string
                            label="Run shallowEqual(nested objects)"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(
                                        shallowEqual({ a: { b: 1 } }, { a: { b: 1 } }),
                                    );
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
            <Ds.api
                args="shallowEqual(a, b);"
                returns="Boolean shallow equality result."
                props={{
                    a: {
                        description: "First value.",
                        type: "any",
                        required: true,
                    },
                    b: {
                        description: "Second value.",
                        type: "any",
                        required: true,
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

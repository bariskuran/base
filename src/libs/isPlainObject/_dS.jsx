import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { isPlainObject } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });

    return (
        <Ds.page title="isPlainObject()" releasedOn="1.0.0" description="Checks plain-object values.">
            <Ds.block
                title="Basic usage"
                code={`import { isPlainObject } from "${SYS.basePath}";

isPlainObject({ a: 1 });

isPlainObject(new Date());`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button.string
                            label="Run isPlainObject({})"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(isPlainObject({}));
                                })
                            }
                        />
                        <Button.string
                            label="Run isPlainObject(new Date())"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(isPlainObject(new Date()));
                                })
                            }
                        />
                        <Button.string
                            label="Run isPlainObject([])"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(isPlainObject([]));
                                })
                            }
                        />
                        <Space size="l" />
                        {output != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.pre whiteSpace="pre-wrap">{output}</Typo.pre>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.api
                args="isPlainObject(v);"
                returns="True for plain object or null-prototype object."
                props={{
                    v: {
                        description: "Value to test.",
                        type: "any",
                        required: true,
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { isContainer } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });

    return (
        <Ds.page title="isContainer()" releasedOn="1.0.0" description="Checks array or plain object.">
            <Ds.block
                title="Basic usage"
                code={`import { isContainer } from "${SYS.basePath}";

isContainer([]);

isContainer({});

isContainer(new Date());`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button.string
                            label="Run isContainer([])"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(isContainer([]));
                                })
                            }
                        />
                        <Button.string
                            label="Run isContainer({})"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(isContainer({}));
                                })
                            }
                        />
                        <Button.string
                            label="Run isContainer(new Date())"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(isContainer(new Date()));
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
                args="isContainer(v);"
                returns="True if v is a non-null array or plain object."
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

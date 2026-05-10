import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { isNumber } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });

    return (
        <Ds.page title="isNumber()" releasedOn="1.0.0" description="Checks finite numeric values.">
            <Ds.block
                title="Basic usage"
                code={`import { isNumber } from "${SYS.basePath}";

isNumber(12);

isNumber("12.4");

isNumber("abc");`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Button.string
                            label="Run isNumber(12)"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(isNumber(12));
                                })
                            }
                        />
                        <Button.string
                            label='Run isNumber("12.4")'
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(isNumber("12.4"));
                                })
                            }
                        />
                        <Button.string
                            label='Run isNumber("abc")'
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(isNumber("abc"));
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
                args="isNumber(data);"
                returns="True for finite numeric-like values."
                props={{
                    data: {
                        description: "Value to check.",
                        type: "any",
                        required: true,
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

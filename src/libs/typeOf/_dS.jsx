import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { typeOf } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });

    return (
        <Ds.page title="typeOf()" releasedOn="1.0.0" description="Extended type detector helper.">
            <Ds.block
                title="Single and multi input"
                code={`import { typeOf } from "${SYS.basePath}";

typeOf(null);

typeOf(1, "x", []);`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button.string
                            label="Run typeOf(null)"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(typeOf(null));
                                })
                            }
                        />
                        <Button.string
                            label='Run typeOf(1, "x", [])'
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = JSON.stringify(typeOf(1, "x", []));
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
                args="typeOf(...args);"
                returns="undefined with no args; string for one arg; string[] for multiple."
                props={{
                    "...args": {
                        description: "One or more values to inspect.",
                        type: "any[]",
                        defaultValue: "[]",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

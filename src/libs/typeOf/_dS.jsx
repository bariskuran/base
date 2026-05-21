import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { typeOf } from ".";
import { Flex } from "../Flex";
import { Button } from "../Button";

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    return (
        <Ds.page
            title="typeOf()"
            releasedOn="1.0.0"
            description="Extended type detector helper. Supports multiple arguments. Detects 'number', 'string', 'boolean', 'undefined', 'function', 'object', 'null', 'array', 'date', 'regexp', 'map', 'set', 'error', 'promise'."
        >
            <Ds.block
                title="Single and multi input"
                code={`import { typeOf } from "${SYS.basePath}";

                        typeOf(null);

                        typeOf(1, "x", []);`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="typeOf(null)"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but1",
                                    fn: () => typeOf(null),
                                })}
                            />
                            <Button.plain
                                label='typeOf(1, "x", [])'
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but2",
                                    fn: () => typeOf(1, "x", []),
                                })}
                            />
                        </Flex>
                        <Output path="basic" />
                    </Flex.column>
                }
            />
            <Ds.api
                args={["const type = typeOf(arg);", "const types = typeOf(arg1, arg2, ...argN);"]}
                props={{
                    "...args": {
                        description: "One or more values to inspect.",
                        type: "any || any[]",
                    },
                }}
                returnProps={{
                    type: {
                        description: "Detected type string for a single argument.",
                        type: "string",
                    },
                    types: {
                        description: "Array of type strings when multiple arguments are passed.",
                        type: "string[]",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { isArray } from ".";
import { Flex } from "../Flex";
import { Button } from "../Button";

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    return (
        <Ds.page title="isArray()" releasedOn="1.0.0" description="Checks array values.">
            <Ds.block
                title="Basic usage"
                code={`import { isArray } from "${SYS.basePath}";

                       isArray([]);
                       isArray({});
                       isArray(new Date());`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="isArray([])"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but1",
                                    fn: () => isArray([]),
                                })}
                            />
                            <Button.plain
                                label="isArray({})"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but2",
                                    fn: () => isArray({}),
                                })}
                            />
                            <Button.plain
                                label="isArray(new Date())"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but3",
                                    fn: () => isArray(new Date()),
                                })}
                            />
                        </Flex>
                        <Output path="basic" />
                    </Flex.column>
                }
            />
            <Ds.api
                args="const ok = isArray(v);"
                props={{
                    v: {
                        description: "Value to test.",
                        type: "any",
                        required: true,
                    },
                }}
                returnProps={{
                    ok: { description: "True when v is an array.", type: "boolean" },
                }}
            />
        </Ds.page>
    );
};

export default X;

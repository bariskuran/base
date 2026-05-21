import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { isPlainObject } from ".";
import { Flex } from "../Flex";
import { Button } from "../Button";

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    return (
        <Ds.page
            title="isPlainObject()"
            releasedOn="1.0.0"
            description="Checks plain-object values."
        >
            <Ds.block
                title="Basic usage"
                code={`import { isPlainObject } from "${SYS.basePath}";

                        isPlainObject({ a: 1 });

                        isPlainObject(new Date());`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="isPlainObject({})"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but1",
                                    fn: () => isPlainObject({}),
                                })}
                            />
                            <Button.plain
                                label="isPlainObject(new Date())"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but2",
                                    fn: () => isPlainObject(new Date()),
                                })}
                            />
                            <Button.plain
                                label="isPlainObject([])"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but3",
                                    fn: () => isPlainObject([]),
                                })}
                            />
                        </Flex>
                        <Output path="basic" />
                    </Flex.column>
                }
            />
            <Ds.api
                args="const ok = isPlainObject(v);"
                props={{
                    v: {
                        description: "Value to test.",
                        type: "any",
                        required: true,
                    },
                }}
                returnProps={{
                    ok: {
                        description: "True for plain object or null-prototype object.",
                        type: "boolean",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

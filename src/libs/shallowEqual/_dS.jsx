import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { shallowEqual } from ".";
import { Flex } from "../Flex";
import { Button } from "../Button";

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();

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
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="({ a: 1 }, { a: 1 })"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but1",
                                    fn: () => shallowEqual({ a: 1 }, { a: 1 }),
                                })}
                            />
                            <Button.plain
                                label="([1, 2], [1, 2])"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but2",
                                    fn: () => shallowEqual([1, 2], [1, 2]),
                                })}
                            />
                            <Button.plain
                                label="({ a: { b: 1 } }, { a: { b: 1 } })"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but3",
                                    fn: () => shallowEqual({ a: { b: 1 } }, { a: { b: 1 } }),
                                })}
                            />
                        </Flex>
                        <Output path="basic" />
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

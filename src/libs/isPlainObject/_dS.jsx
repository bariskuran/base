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
            description={{ tr: "Düz nesne değerlerini kontrol eder.", en: "Checks plain-object values." }}
        >
            <Ds.block
                title={{ tr: "Temel kullanım", en: "Basic Usage" }}
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
                        description: { tr: "Test edilecek değer.", en: "Value to test." },
                        type: "any",
                        required: true,
                    },
                }}
                returnProps={{
                    ok: {
                        description: { tr: "Düz nesne veya null-prototype nesnesinde true.", en: "True for a plain object or null-prototype object." },
                        type: "boolean",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

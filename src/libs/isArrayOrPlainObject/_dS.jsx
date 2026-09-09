import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { isArrayOrPlainObject } from ".";
import { Flex } from "../Flex";
import { Button } from "../Button";

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    return (
        <Ds.page
            title="isArrayOrPlainObject()"
            releasedOn="1.0.0"
            description={{ tr: "Dizi veya düz nesneyi kontrol eder.", en: "Checks an array or plain object." }}
        >
            <Ds.block
                title={{ tr: "Temel kullanım", en: "Basic Usage" }}
                code={`import { isArrayOrPlainObject } from "${SYS.basePath}";

                        isArrayOrPlainObject([]);
                        isArrayOrPlainObject({});
                        isArrayOrPlainObject(new Date());`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="([])"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but1",
                                    fn: () => isArrayOrPlainObject([]),
                                })}
                            />
                            <Button.plain
                                label="({})"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but2",
                                    fn: () => isArrayOrPlainObject({}),
                                })}
                            />
                            <Button.plain
                                label="(new Date())"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but3",
                                    fn: () => isArrayOrPlainObject(new Date()),
                                })}
                            />
                        </Flex>
                        <Output path="basic" />
                    </Flex.column>
                }
            />
            <Ds.api
                args="const ok = isArrayOrPlainObject(v);"
                props={{
                    v: {
                        description: { tr: "Test edilecek değer.", en: "Value to test." },
                        type: "any",
                        required: true,
                    },
                }}
                returnProps={{
                    ok: {
                        description: { tr: "v null olmayan dizi veya düz nesneyse true.", en: "True if v is a non-null array or plain object." },
                        type: "boolean",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

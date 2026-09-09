import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { isNumber } from ".";
import { Flex } from "../Flex";
import { Button } from "../Button";

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    return (
        <Ds.page title="isNumber()" releasedOn="1.0.0" description={{ tr: "Sonlu sayısal değerleri kontrol eder.", en: "Checks finite numeric values." }}>
            <Ds.block
                title={{ tr: "Temel kullanım", en: "Basic Usage" }}
                code={`import { isNumber } from "${SYS.basePath}";

                        isNumber(12);
                        isNumber("12.4");
                        isNumber("abc");`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="isNumber(12)"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but1",
                                    fn: () => isNumber(12),
                                })}
                            />
                            <Button.plain
                                label='isNumber("12.4")'
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but2",
                                    fn: () => isNumber("12.4"),
                                })}
                            />
                            <Button.plain
                                label='isNumber("abc")'
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but3",
                                    fn: () => isNumber("abc"),
                                })}
                            />
                        </Flex>
                        <Output path="basic" />
                    </Flex.column>
                }
            />
            <Ds.api
                args="const ok = isNumber(data);"
                props={{
                    data: {
                        description: { tr: "Kontrol edilecek değer.", en: "Value to check." },
                        type: "any",
                        required: true,
                    },
                }}
                returnProps={{
                    ok: {
                        description: { tr: "Sonlu, sayısal benzeri değerlerde true.", en: "True for finite numeric-like values." },
                        type: "boolean",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

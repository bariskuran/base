import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useScrollWidthHeight } from ".";
import { Typo } from "../Typo";
import { Flex } from "../Flex";
import { Button } from "../Button";
import { ScrollFlex } from "../ScrollFlex";

const X = () => {
    const documentSize = useScrollWidthHeight();
    const containerSize = useScrollWidthHeight();

    return (
        <Ds.page
            title="useScrollWidthHeight()"
            releasedOn="1.0.0"
            description="Measures scrollable width/height. Attach ref to auto-detect the scroll container, or pass source explicitly. Without ref, document scroll size is measured."
        >
            <Ds.block
                title="Document scroll size"
                code={`import { useScrollWidthHeight } from "${SYS.basePath}";

                       const { width, height, manualTrigger } = useScrollWidthHeight();`}
                example={
                    <Flex.column gap={8}>
                        <Typo.span>{`doc width: ${documentSize.width}`}</Typo.span>
                        <Typo.span>{`doc height: ${documentSize.height}`}</Typo.span>
                        <Button.plain
                            label="manualTrigger()"
                            onClick={documentSize.manualTrigger}
                        />
                    </Flex.column>
                }
            />
            <Ds.block
                title="ScrollFlex scroll size"
                description="ref resolves the ScrollFlex scroll host; page scroll does not affect these values."
                code={`import { useScrollWidthHeight } from "${SYS.basePath}";
                        import { ScrollFlex } from "${SYS.basePath}";

                        const { width, height, ref } = useScrollWidthHeight();

                        return (
                            <ScrollFlex width="100%" height={280}>
                                <Flex ref={ref} minWidth={5000} minHeight={5000}>
                                    scroll inside the box
                                </Flex>
                            </ScrollFlex>
                        );`}
                example={
                    <Flex.column full gap={10}>
                        <Typo.span>
                            {`container width: ${containerSize.width} height: ${containerSize.height}`}
                        </Typo.span>
                        <ScrollFlex width="100%" height={280}>
                            <Flex
                                ref={containerSize.ref}
                                minWidth={5000}
                                minHeight={5000}
                                padding={20}
                            >
                                scroll inside the box
                            </Flex>
                        </ScrollFlex>
                    </Flex.column>
                }
            />
            <Ds.api
                disableLastBlock
                args="const { width, height, manualTrigger, ref, source } = useScrollWidthHeight({ source, settleDelay, resizeDelay });"
                props={{
                    source: {
                        description: "Optional scroll element to measure.",
                        type: "HTMLElement | null | undefined",
                    },
                    resizeDelay: {
                        description: "Resize throttle delay.",
                        type: "number",
                        defaultValue: "1000",
                    },
                    settleDelay: {
                        description: "Delay before each measurement.",
                        type: "number",
                        defaultValue: "250",
                    },
                }}
            />
            <Ds.api
                args="width, height"
                props={{
                    width: { description: "Measured scroll width in pixels.", type: "number" },
                    height: { description: "Measured scroll height in pixels.", type: "number" },
                }}
            />
            <Ds.api
                args="ref"
                props={{
                    ref: {
                        description:
                            "Callback ref to attach to your content root. Used to auto-detect the scroll container when source is not provided.",
                        type: "fn",
                    },
                }}
            />
            <Ds.api
                args="source"
                props={{
                    source: {
                        description: "Resolved scroll element currently being measured.",
                        type: "HTMLElement",
                    },
                }}
            />
            <Ds.api
                args="manualTrigger()"
                props={{
                    manualTrigger: {
                        description: "Schedules a fresh width/height measurement.",
                        type: "fn",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

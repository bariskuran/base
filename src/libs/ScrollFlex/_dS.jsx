import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { ScrollFlex } from "./";
import { generateRandom } from "../generateRandom";
import { Button } from "../Button";
import { Flex } from "../Flex";

const longText = generateRandom.loremIpsum(1000);

const X = () => {
    return (
        <Ds.page
            title="<ScrollFlex>"
            releasedOn="1.0.0"
            description={
                <>
                    ScrollFlex integrates Flex with a ScrollBar to create a scrollable Flex
                    container at any desired size.
                    <br />
                    <br />
                    It is ideal for everyday use. For more advanced scenarios, use{" "}
                    <Button.string to="/design-system/scrollBar" label="ScrollBar" /> with a
                    customized <Button.string to="/design-system/flex" label="Flex" /> or a
                    customized content area.
                </>
            }
        >
            <Ds.block
                title="Basic usage"
                description="It is recommended to specify especially height when using ScrollFlex. This will give you the cleanest result."
                code={`import { ScrollFlex } from "${SYS.basePath}"
                
                        <ScrollFlex width={200} height={100}>
                            {longText}
                        </ScrollFlex>;`}
                example={
                    <ScrollFlex width={200} height={100}>
                        {longText}
                    </ScrollFlex>
                }
            />
            <Ds.block
                title="Advanced usage"
                description="You can further customize ScrollFlex using Flex and ScrollBar props."
                code={`import { ScrollFlex } from "${SYS.basePath}"
                
                        <ScrollFlex
                        variant="with3DShadow"
                        flexProps={{ width: 200, height: 100, justify: "center", borderRadius: 10 }}
                        scrollBarProps={{ variant: "primary", fillMode: true }}
                    >
                        {longText}
                    </ScrollFlex>`}
                example={
                    <ScrollFlex
                        variant="with3DShadow"
                        flexProps={{ width: 200, height: 100, justify: "center", borderRadius: 10 }}
                        scrollBarProps={{ variant: "primary", fillMode: true }}
                    >
                        {longText}
                    </ScrollFlex>
                }
            />
            <Ds.block
                title="Auto Width & Height"
                description="If width or height is not provided, ScrollFlex attempts to fill its parent’s width and height. Because CSS height depends on the parent chain, this may not always produce the expected result. If no valid height can be resolved from the parent tree, ScrollFlex falls back to 200. Otherwise, it uses the parent’s height."
                code={`import { ScrollFlex } from "${SYS.basePath}"
                
                        <ScrollFlex
                        variant="with3DShadow"
                        flexProps={{ width: 200, height: 100, justify: "center", borderRadius: 10 }}
                        scrollBarProps={{ variant: "primary", fillMode: true }}
                    >
                        {longText}
                    </ScrollFlex>`}
                example={
                    <>
                        {/* <Flex gap={10}>
                            <Flex height={100}>
                                <Flex>
                                    <ScrollFlex>{longText}</ScrollFlex>
                                </Flex>
                            </Flex>
                            <Flex height={150}>
                                <ScrollFlex>{longText}</ScrollFlex>
                            </Flex>
                            <Flex>
                                <ScrollFlex>{longText}</ScrollFlex>
                            </Flex>
                        </Flex> */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "stretch",
                                width: "100%",
                                height: 50,
                            }}
                        >
                            <div style={{ backgroundColor: "red", flex: 1 }}>Sol</div>
                            <div style={{ backgroundColor: "skyblue", flex: 1 }}>
                                <ScrollFlex>{longText}</ScrollFlex>
                            </div>
                        </div>
                    </>
                }
            />
            <Ds.api
                props={{
                    width: {
                        description: "ScrollBox width. Uses parent width when omitted.",
                        type: "number | string",
                        defaultValue: "100%",
                    },
                    height: {
                        description:
                            "ScrollBox height. Uses parent rect height when omitted and maxHeight is not provided.",
                        type: "number | string",
                        defaultValue: "parent height",
                    },
                    scrollBarProps: {
                        description: (
                            <>
                                Check out{" "}
                                <Button.string to="/design-system/scrollBar" label="ScrollBar" />{" "}
                                api.
                            </>
                        ),
                        type: "object",
                    },
                    flexProps: {
                        description: (
                            <>
                                Check out <Button.string to="/design-system/flex" label="Flex" />{" "}
                                api.
                            </>
                        ),
                        type: "object",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

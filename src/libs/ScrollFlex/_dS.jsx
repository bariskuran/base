import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { ScrollFlex } from "./";
import { generateRandom } from "../generateRandom";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { useRef } from "react";

const longText = generateRandom.loremIpsum(1000);
const HEIGHT_BY_ID_DEMO_SOURCE = "ds-scrollflex-height-by-id-demo";

const X = () => {
    const flexRef1 = useRef(null);

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
                        variant="hoverShadow"
                        flexProps={{ width: 200, height: 100, justify: "center", borderRadius: 10 }}
                        scrollBarProps={{ variant: "primary", fillMode: true }}
                    >
                        {longText}
                    </ScrollFlex>`}
                example={
                    <ScrollFlex
                        variant="hoverShadow"
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
                code={`import { ScrollFlex, Flex } from "${SYS.basePath}"
                
                    <Flex gap={10}>
                        /* First Flex won't be displayed because it and its parents have no height */
                        <Flex>
                            <ScrollFlex>{longText}</ScrollFlex>
                        </Flex>
                        <Flex height={150}>
                            <ScrollFlex>{longText}</ScrollFlex>
                        </Flex>
                        <Flex height={150}>
                            <Flex>
                                <ScrollFlex>{longText}</ScrollFlex>
                            </Flex>
                        </Flex>
                        <Flex height={150}>
                            <Flex>
                                <Flex>
                                    <ScrollFlex>{longText}</ScrollFlex>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>`}
                example={
                    <Flex gap={10}>
                        <Flex>
                            <ScrollFlex>{longText}</ScrollFlex>
                        </Flex>
                        <Flex height={150}>
                            <ScrollFlex>{longText}</ScrollFlex>
                        </Flex>
                        <Flex height={150}>
                            <Flex>
                                <ScrollFlex>{longText}</ScrollFlex>
                            </Flex>
                        </Flex>
                        <Flex height={150}>
                            <Flex>
                                <Flex>
                                    <ScrollFlex>{longText}</ScrollFlex>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                }
            />
            <Ds.block
                title="Relative Height & Width"
                description={`You can set the height of ScrollFlex by referencing another DOM element that is not in the same region. You can use a React ref to point to this element.

                    The "height" or "flexProps.height" props take precedence over the "heightByRef" and "heightById" props.

                    The same feature can be used for width via the "widthByRef" or "widthById" props.`}
                code={`import { ScrollFlex, Flex } from "${SYS.basePath}"
                
                    /* Height source can be anywhere in the DOM; it does not need to share the same parent/root. */
                    <Flex height={150} ref={flexRef1}>
                       Source heightByRef
                    </Flex>

                    /* ScrollFlex */
                    <ScrollFlex heightByRef={flexRef1}>{longText}</ScrollFlex>`}
                example={
                    <>
                        <Flex height={150} ref={flexRef1}>
                            Source heightByRef
                        </Flex>
                        <ScrollFlex heightByRef={flexRef1}>{longText}</ScrollFlex>
                    </>
                }
            />
            <Ds.block
                title="Relative Height by DOM id"
                description={`Same as heightByRef, but the source element is resolved with document.getElementById. Use a stable, page-unique id on the element whose height you want to mirror.

                    Explicit height and heightByRef still take precedence over heightById. widthById works the same way for width.`}
                code={`import { ScrollFlex, Flex } from "${SYS.basePath}"

                    /* Height source can be anywhere in the DOM; it does not need to share the same parent/root. */
                    <Flex height={150} id="unique-id">
                       Source heightByRef
                    </Flex>

                    /* ScrollFlex */
                    <ScrollFlex heightById="unique-id">{longText}</ScrollFlex>`}
                example={
                    <>
                        <Flex id={HEIGHT_BY_ID_DEMO_SOURCE} height={150}>
                            Source heightById
                        </Flex>
                        <ScrollFlex heightById={HEIGHT_BY_ID_DEMO_SOURCE}>{longText}</ScrollFlex>
                    </>
                }
            />
            <Ds.block
                title="Variants"
                description="As in the rest of the Base library, you can change the variant using a prop, or by using the compound component pattern as Component.variantName."
                code={`import { ScrollFlex } from "${SYS.basePath}";
                    
                    <ScrollFlex ... />
                    <ScrollFlex.border ... /> // same as default
                    <ScrollFlex variant="shadow" ... />
                    <ScrollFlex.hoverShadow `}
                example={
                    <Ds.variant
                        variants={[
                            [
                                "border",
                                <Flex width={150} height={100} key="border">
                                    <ScrollFlex height={100}>{longText}</ScrollFlex>
                                </Flex>,
                            ],
                            [
                                "shadow",
                                <Flex width={150} height={100} key="shadow">
                                    <ScrollFlex.shadow height={100} key="shadow">
                                        {longText}
                                    </ScrollFlex.shadow>
                                </Flex>,
                            ],
                            [
                                "hoverShadow",
                                <Flex width={150} height={100} key="hoverShadow">
                                    <ScrollFlex.hoverShadow height={100}>
                                        {longText}
                                    </ScrollFlex.hoverShadow>
                                </Flex>,
                            ],
                        ]}
                    />
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
                            "ScrollFlex height. Explicit height takes precedence over reference-based height.",
                        type: "number | string",
                        defaultValue: "undefined",
                    },
                    heightByRef: {
                        description:
                            "Uses a React ref element's height when height and flexProps.height are not provided.",
                        type: "React ref | HTMLElement",
                    },
                    heightById: {
                        description:
                            "Uses a DOM element's height by id when height, flexProps.height, and heightByRef are not provided.",
                        type: "string",
                    },
                    widthByRef: {
                        description:
                            "Uses a React ref element's width when width and flexProps.width are not provided.",
                        type: "React ref | HTMLElement",
                    },
                    widthById: {
                        description:
                            "Uses a DOM element's width by id when width, flexProps.width, and widthByRef are not provided.",
                        type: "string",
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

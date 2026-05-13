import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { ScrollFlex } from "./";
import { generateRandom } from "../generateRandom";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { useRef } from "react";

const longText = generateRandom.loremIpsum(1000);
const shortText = generateRandom.loremIpsum(50);
const HEIGHT_BY_ID_DEMO_SOURCE = "ds-scrollflex-height-by-id-demo";

const Content = ({ width, height, short }) => (
    <Flex width={width} height={height} yAlign="start">
        {short ? shortText : longText}
    </Flex>
);

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
                title="Auto Axis Management"
                description="Scrollbar automatically manages the axis of the scrollbar based on the content size."
                code={`import { ScrollFlex } from "${SYS.basePath}"
                
                        <ScrollFlex width={150} height={100}>
                            <Content width={1500} />
                        </ScrollFlex>
                        <ScrollFlex width={150} height={100}>
                            <Content />
                        </ScrollFlex>
                        <ScrollFlex width={150} height={100} scrollBarProps={{ mirror: true, opposite: true }} >
                            <Content width={1500} />
                        </ScrollFlex>
                        <ScrollFlex width={150} height={100} scrollBarProps={{ mirror: true }}>
                            <Content />
                        </ScrollFlex>`}
                example={
                    <Flex gap={10}>
                        <ScrollFlex width={150} height={100}>
                            <Content width={1500} />
                        </ScrollFlex>
                        <ScrollFlex width={150} height={100}>
                            <Content />
                        </ScrollFlex>
                        <ScrollFlex
                            width={150}
                            height={100}
                            scrollBarProps={{ mirror: true, opposite: true }}
                        >
                            <Content width={1500} />
                        </ScrollFlex>
                        <ScrollFlex width={150} height={100} scrollBarProps={{ mirror: true }}>
                            <Content />
                        </ScrollFlex>
                    </Flex>
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
                title="Relative Height & Width by Ref"
                description={`You can set the height of ScrollFlex by referencing another DOM element that is not in the same region. You can use a React ref to point to this element. The "height" or "flexProps.height" props take precedence over the "heightByRef" and "heightById" props.

                    The same feature can be used for width via the "widthByRef" or "widthById" props.`}
                code={`import { ScrollFlex, Flex } from "${SYS.basePath}"
                
                        <Flex height={150} width={150} bgColor="aliceblue" ref={flexRef1}>Source 150x150</Flex>
                        <ScrollFlex heightByRef={flexRef1}>{longText}</ScrollFlex>`}
                example={
                    <Flex gap={10} align="stretch">
                        <Flex height={150} width={150} bgColor="aliceblue" ref={flexRef1}>
                            Source 150x150
                        </Flex>
                        <ScrollFlex heightByRef={flexRef1}>{longText}</ScrollFlex>
                    </Flex>
                }
            />
            <Ds.block
                title="Relative Width & Height by DOM id"
                description="Same as heightByRef, but the source element is resolved with document.getElementById. Use a stable, page-unique id on the element whose height you want to mirror. Explicit height and heightByRef still take precedence over heightById. widthById works the same way for width."
                code={`import { ScrollFlex, Flex } from "${SYS.basePath}"

                        <Flex id={HEIGHT_BY_ID_DEMO_SOURCE} height={150} width={150} bgColor="aliceblue">
                                Source 150x150
                        </Flex>
                        <ScrollFlex widthById={HEIGHT_BY_ID_DEMO_SOURCE} heightById={HEIGHT_BY_ID_DEMO_SOURCE}>{longText}</ScrollFlex>
                        </Flex>`}
                example={
                    <Flex gap={10} align="stretch">
                        <Flex
                            id={HEIGHT_BY_ID_DEMO_SOURCE}
                            height={150}
                            width={150}
                            bgColor="aliceblue"
                        >
                            Source 150x150
                        </Flex>
                        <ScrollFlex
                            widthById={HEIGHT_BY_ID_DEMO_SOURCE}
                            heightById={HEIGHT_BY_ID_DEMO_SOURCE}
                        >
                            {longText}
                        </ScrollFlex>
                    </Flex>
                }
            />
            <Ds.block
                title="Drag-to-Scroll (enableDragging)"
                description={
                    <>
                        <code>enableDragging</code> is disabled by default. When set to{" "}
                        <code>true</code>, the scroll container shell shows the <code>grab</code> /{" "}
                        <code>grabbing</code> cursor and allows you to scroll the content both
                        horizontally and vertically by dragging with the mouse or touch. Dragging
                        will not start when interacting with links, buttons, or form elements inside
                        the scroll area.
                    </>
                }
                code={`import { ScrollFlex, Flex } from "${SYS.basePath}"

                    <ScrollFlex
                        enableDragging
                        width={180}
                        height={120}
                        flexProps={{ width: 400, height: 300 }}
                    >
                        <Flex width={400} height={300} bgColor="mistyrose" justify="center" yAlign="center">
                            Large and tall content — drag the shell to scroll.
                        </Flex>
                    </ScrollFlex>`}
                example={
                    <ScrollFlex
                        enableDragging
                        width={180}
                        height={120}
                        flexProps={{ width: 400, height: 300 }}
                    >
                        <Flex
                            width={400}
                            height={300}
                            bgColor="mistyrose"
                            justify="center"
                            yAlign="center"
                        >
                            Large content — drag to scroll.
                        </Flex>
                    </ScrollFlex>
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
                                "default or border",
                                <Flex width={150} height={100} key="border">
                                    <ScrollFlex height={100}>{longText}</ScrollFlex>
                                </Flex>,
                            ],
                            [
                                "plain",
                                <Flex width={150} height={100} key="border">
                                    <ScrollFlex.plain height={100}>{longText}</ScrollFlex.plain>
                                </Flex>,
                            ],
                            [
                                "shadow",
                                <Flex width={150} height={100} key="shadow">
                                    <ScrollFlex.shadow height={100}>{longText}</ScrollFlex.shadow>
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
                args="<ScrollFlex />"
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
                    enableDragging: {
                        description:
                            "Default is false. When set to true, enables both horizontal and vertical scrolling of the shell by dragging with the mouse; the cursor becomes grab / grabbing. Drag-to-scroll does not start from interactive sub-elements (buttons, links, inputs, etc).",
                        type: "boolean",
                        defaultValue: "false",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { ScrollBar } from "./";
import { generateRandom } from "../generateRandom";
import { Flex } from "../Flex";
import { Button } from "../Button";
import styled, { css } from "styled-components";
import { useRef } from "react";

const longText = generateRandom.loremIpsum(1000);
const shortText = generateRandom.loremIpsum(50);
const SOURCE_BY_ID = "ds-scrollbar-source-by-id-demo";

const flexProps = {
    width: 150,
    height: 100,
    bgColor: "aliceblue",
    yAlign: "start",
    xAlign: "start",
    overflow: "hidden",
    padding: 10,
};

const TwoAxisLargeContent = ({ children, inProps, short }) => (
    <Flex {...flexProps} inProps={inProps}>
        <div>{short ? shortText : longText}</div>
        {children}
    </Flex>
);

export const CustomVariant = styled.div`
    ${() => css`
        &[data-slot="track"] {
            background: skyblue;
            overflow: visible !important;
        }
        & > [data-slot="thumb"] {
            transform: scaleX(20);
            background: blue;
        }
    `}
`;

const X = () => {
    const flexRef1 = useRef(null);

    /* RETURN */
    return (
        <Ds.page
            title="<ScrollBar>"
            releasedOn="1.0.0"
            description={
                <>
                    ScrollBar is an advanced utility for rendering custom scrollbars based on the
                    overflow behavior of its parent container. It automatically detects overflow on
                    the X and/or Y axis, hides the browser’s native scrollbars, and replaces them
                    with a styled, interactive scrollbar. This component works in overlay mode and
                    does not reserve layout space for content. For most layout-safe, day-to-day use
                    cases, consider using ScrollFlex instead. <br />
                    <br />
                    When you need to customize the page-level (body/window) scroll area, ScrollBar
                    should be used directly via the body prop, since that is its primary low-level
                    use case.
                    <br />
                    <br /> Check out{" "}
                    <Button.string to="/design-system/scrollFlex" label="ScrollFlex" /> to see
                    common usage.
                </>
            }
        >
            <Ds.block
                title="Basic Usage"
                description="ScrollBar hides the default browser scrollbar of its parent container and shows its own scrollbar for the x and y axis if needed. You don’t need to configure for x or y axis specifically."
                code={`import { ScrollBar } from "${SYS.basePath}";

                    const longText = generateRandom.loremIpsum(1000);
                    const shortText = generateRandom.loremIpsum(50);

                    const TwoAxisLargeContent = ({ children, inProps, short }) => (
                        <Flex
                            width={150}
                            height={100}
                            bgColor="aliceblue"
                            yAlign="start"
                            xAlign="start"
                            overflow="hidden"
                            padding={10}
                            inProps={inProps}
                        >
                            <div>{short ? shortText : longText}</div>
                            {children}
                        </Flex>
                    );

                    <Flex xAlign="start" gap={10}>
                        <TwoAxisLargeContent inProps={[{ width: 1500 }]}>
                            <ScrollBar />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent inProps={[{ width: 1500 }]} short>
                            <ScrollBar />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar />
                        </TwoAxisLargeContent>
                    </Flex>`}
                example={
                    <Flex xAlign="start" gap={10}>
                        <TwoAxisLargeContent inProps={[{ width: 1500 }]}>
                            <ScrollBar />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent inProps={[{ width: 1500 }]} short>
                            <ScrollBar />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar />
                        </TwoAxisLargeContent>
                    </Flex>
                }
            />
            <Ds.block
                title="Disabling Axis"
                description={`It is possible to disable the scrollbar for a specific axis by using the disableX or disableY props.
                
                The ScrollBar automatically decides which axis should trigger scrolling. If the Y axis is not present or is disabled, the Y scroll trigger will also scroll the X axis.`}
                code={`import { ScrollBar } from "${SYS.basePath}";

                    <Flex xAlign="start" gap={10}>
                        <TwoAxisLargeContent inProps={[{ width: 1500 }]}>
                            <ScrollBar disableX />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent inProps={[{ width: 1500 }]}>
                            <ScrollBar disableY />
                        </TwoAxisLargeContent>
                    </Flex>`}
                example={
                    <Flex xAlign="start" gap={10}>
                        <TwoAxisLargeContent inProps={[{ width: 1500 }]}>
                            <ScrollBar disableX />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent inProps={[{ width: 1500 }]}>
                            <ScrollBar disableY />
                        </TwoAxisLargeContent>
                    </Flex>
                }
            />
            <Ds.block
                title="Mirror and Opposite Position"
                description={`The "mirror" and "opposite" props determine the position of the scrollBar. The "mirror" prop mirrors the scrollBar's position — for example, a scrollBar that would normally appear on the left is instead positioned on the right. For the x-axis, a scrollBar that would be at the bottom is instead shown at the top.
                    
                    The "opposite" prop visually swaps the x and y axes. For example, the scrollBar for the y-axis is displayed where the x-axis scrollBar would usually be (at the bottom). This is only a visual change; axis functionality remains the same.
                    
                    Both props can be used together.`}
                code={`import { ScrollBar } from "${SYS.basePath}";

                    <Flex xAlign="start" gap={10}>
                        <TwoAxisLargeContent inProps={[{ width: 1500 }]}>
                            <ScrollBar disableX />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent inProps={[{ width: 1500 }]}>
                            <ScrollBar disableY />
                        </TwoAxisLargeContent>
                    </Flex>`}
                example={
                    <Flex xAlign="start" gap={10}>
                        <TwoAxisLargeContent>
                            <ScrollBar mirror />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar opposite />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar opposite mirror />
                        </TwoAxisLargeContent>
                    </Flex>
                }
            />
            <Ds.block
                title="Styling"
                description={`trackMargin, edgeMargin, truckColor, thumbColor, thickness, maxLength, minThumbLenght, exactThumbSize props are avaliable for styling.
                `}
                code={`import { ScrollBar } from "${SYS.basePath}";

                    <Flex xAlign="start" gap={10} wrap>
                        <TwoAxisLargeContent>
                            <ScrollBar thickness={10} />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar maxLength={50} />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar minThumbLength={5} />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar truckColor="red" />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar thumbColor="primary" />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar trackMargin={30} />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar edgeMargin={30} />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar exactThumbSize={3} />
                        </TwoAxisLargeContent>
                    </Flex>`}
                example={
                    <Flex xAlign="start" gap={10} wrap>
                        <TwoAxisLargeContent>
                            <ScrollBar thickness={10} />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar maxLength={50} />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar minThumbLength={5} />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar truckColor="red" />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar thumbColor="primary" />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar trackMargin={30} />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar edgeMargin={30} />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent>
                            <ScrollBar exactThumbSize={3} />
                        </TwoAxisLargeContent>
                    </Flex>
                }
            />
            <Ds.block
                title="Enable Thumb Scale"
                description={`As default, the thumb scale effect is disabled. You can enable it by using the enableThumbScale prop.
                
                Keep in mind, a variant can override this prop.`}
                code={`import { ScrollBar } from "${SYS.basePath}";

                        <TwoAxisLargeContent>
                            <ScrollBar enableThumbScale />
                        </TwoAxisLargeContent>`}
                example={
                    <TwoAxisLargeContent>
                        <ScrollBar enableThumbScale />
                    </TwoAxisLargeContent>
                }
            />
            <Ds.block
                title="fillMode"
                description="You can change the behavior of the thumb. When you enable this prop, the thumb will fill the entire track area. fillMode ignores minThumbLength, exactThumbSize props."
                code={`import { ScrollBar } from "${SYS.basePath}";

                        <TwoAxisLargeContent inProps={[{ width: 1500 }]}>
                            <ScrollBar fillMode />
                        </TwoAxisLargeContent>`}
                example={
                    <TwoAxisLargeContent>
                        <ScrollBar fillMode thumbColor="primary" />
                    </TwoAxisLargeContent>
                }
            />
            <Ds.block
                title="Scrolling an external element"
                description={`ScrollBar normally scrolls the parent container automatically. However, you can scroll an external element by using the sourceByRef or sourceById props.
                    
                    This gives you flexibility with the position of the ScrollBar. When either of these two props is enabled, automatic positioning props such as mirror and opposite, as well as positioning-related props like trackMargin and edgeMargin, are disabled.`}
                code={`import { ScrollBar } from "${SYS.basePath}";

                        <TwoAxisLargeContent inProps={[{ width: 1500 }]}>
                            <ScrollBar fillMode />
                        </TwoAxisLargeContent>`}
                example={
                    <Flex xAlign="start" gap={10}>
                        <Flex {...flexProps} ref={flexRef1}>
                            {longText}
                        </Flex>
                        <Flex {...flexProps} id={SOURCE_BY_ID}>
                            {longText}
                        </Flex>
                        <Flex
                            width={150}
                            height={150}
                            bgColor="aliceblue"
                            aria-label="source by ref"
                        >
                            <ScrollBar sourceByRef={flexRef1} />
                        </Flex>
                        <Flex width={20} height={200}>
                            <ScrollBar sourceById={SOURCE_BY_ID} />
                        </Flex>
                    </Flex>
                }
            />
            <Ds.block
                title="Variants"
                description="As in the rest of the Base library, you can change the variant using a prop, or by using the compound component pattern as Component.variantName."
                code={`import { ScrollBar } from "${SYS.basePath}";

                    <ScrollBar />
                    <ScrollBar variant="primary" />
                    <ScrollBar.fullTop />`}
                example={
                    <Ds.variant
                        variants={[
                            [
                                "default",
                                <TwoAxisLargeContent key="default">
                                    <ScrollBar />
                                </TwoAxisLargeContent>,
                            ],
                            [
                                "primary",
                                <TwoAxisLargeContent key="primary">
                                    <ScrollBar variant="primary" />
                                </TwoAxisLargeContent>,
                            ],
                            [
                                "fullTop",
                                <TwoAxisLargeContent key="fullTop">
                                    <ScrollBar.fullTop />
                                </TwoAxisLargeContent>,
                            ],
                        ]}
                    />
                }
            />
            <Ds.block
                title="Custom Variant"
                description={`As shown in the example code, you can fully style the track and thumb using your own custom CSS. Since some styles are set by the component itself, you may need to use !important to override them.
                
                I can't fully guarantee all behaviors when using custom variants. Therefore, please be careful and test thoroughly when creating your own variant.`}
                code={`import { ScrollBar, styled, css } from "${SYS.basePath}";

                    export const CustomVariant = styled.div\`
                        ${() => css`
                            &[data-slot="track"] {
                                background: skyblue;
                                overflow: visible !important;
                            }
                            & > [data-slot="thumb"] {
                                transform: scaleX(20);
                                background: blue;
                            }
                        `}
                    \`};

                    <TwoAxisLargeContent>
                        <ScrollBar variant={CustomVariant} />
                    </TwoAxisLargeContent>
`}
                example={
                    <Flex xAlign="start" gap={10}>
                        <TwoAxisLargeContent>
                            <ScrollBar variant={CustomVariant} thickness={2} enableThumbScale />
                        </TwoAxisLargeContent>
                    </Flex>
                }
            />
            <Ds.block
                title="Body Integration"
                description={`'body' prop can be used to integrate the ScrollBar into the body of the page.
                    
                    You should place it on layout level and enable 'body' prop. It will add a new scrollbar to the body of the page.`}
                code={`import { ScrollBar } from "${SYS.basePath}";

                    <AppLevelContainer>
                        <ScrollBar body />
                    </AppLevelContainer>`}
            />
            <Ds.api
                props={{
                    body: {
                        description:
                            "Uses the page/window scroll instead of the parent container scroll. Recommended for page-level custom scrollbar usage.",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                    sourceByRef: {
                        description: "Controls an external scroll element via ref.",
                        type: "React ref | HTMLElement",
                        required: false,
                        defaultValue: "undefined",
                    },
                    sourceById: {
                        description: "Controls an external scroll element via DOM id.",
                        type: "string",
                        required: false,
                        defaultValue: "undefined",
                    },
                    variant: {
                        description: "Visual variant component used to render the scrollbar track.",
                        type: "React component",
                        required: false,
                        defaultValue: "DefaultVariant",
                    },
                    disableX: {
                        description:
                            "Disables the horizontal scrollbar and prevents horizontal scrolling.",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                    disableY: {
                        description:
                            "Disables the vertical scrollbar and prevents vertical scrolling. If horizontal overflow exists, vertical wheel movement can still drive horizontal scroll.",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                    opposite: {
                        description:
                            "Swaps the visual orientation of the scrollbar. Y axis is shown as horizontal, X axis is shown as vertical.",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                    mirror: {
                        description:
                            "Mirrors scrollbar placement. Vertical bars move from right to left, horizontal bars move from bottom to top.",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                    truckColor: {
                        description: "Color of the scrollbar track.",
                        type: "string",
                        required: false,
                        defaultValue: "theme.foreground",
                    },
                    thumbColor: {
                        description: "Color of the scrollbar thumb.",
                        type: "string",
                        required: false,
                        defaultValue: "truckColor",
                    },
                    thickness: {
                        description: "Scrollbar thickness in rem.",
                        type: "number",
                        required: false,
                        defaultValue: "4",
                    },
                    maxLength: {
                        description:
                            "Maximum track length as a percentage of the scroll host. When provided, the track is centered on its main axis.",
                        type: "number",
                        required: false,
                        defaultValue: "undefined",
                    },
                    trackMargin: {
                        description:
                            "Spacing at both ends of the track, along the track direction. Formerly marginToSide.",
                        type: "number",
                        required: false,
                        defaultValue: "5",
                    },
                    edgeMargin: {
                        description:
                            "Distance between the scrollbar and the nearest container/page edge. Formerly marginToBorder.",
                        type: "number",
                        required: false,
                        defaultValue: "5",
                    },
                    minThumbLength: {
                        description:
                            "Minimum thumb length in pixels when the thumb size is calculated automatically.",
                        type: "number",
                        required: false,
                        defaultValue: "24",
                    },
                    exactThumbSize: {
                        description:
                            "Forces the thumb length to a fixed pixel value. Ignored when fillMode is enabled.",
                        type: "number",
                        required: false,
                        defaultValue: "undefined",
                    },
                    fillMode: {
                        description:
                            "Renders the thumb as a progress fill from the start of the track. Dragging is disabled, but clicking the track still scrolls.",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                    exportData: {
                        description:
                            "Exports internal ScrollBar state and handlers for advanced integrations.",
                        type: "string | object",
                        required: false,
                        defaultValue: "undefined",
                    },
                    enableThumbScale: {
                        description:
                            "Enables the thumb scale effect. This prop might be ignored if a variant uses inner scale effect.",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                    disableOpacityEffect: {
                        description:
                            "Disables the inactive opacity effect for variants that support it. This behavior is variant-based and custom variants may ignore it.",
                        type: "boolean",
                        required: false,
                        defaultValue: "false",
                    },
                }}
            />
        </Ds.page>
    );
};
export default X;

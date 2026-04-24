import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { ScrollBar } from "./";
import { generateRandom } from "../generateRandom";
import { Flex } from "../Flex";
import { Button } from "../Button";

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

// const SimpleIframe = () => {
//     const html = `
//         <html>
//             <body style="margin:0; min-height: 5000px;">
//                 <div style="height:2000px; background:linear-gradient(white, lightgray);">
//                     Scroll me
//                 </div>
//             </body>
//         </html>
//     `;

//     return (
//         <iframe
//             srcDoc={html}
//             style={{ width: "100%", height: "300px", border: "1px solid #ddd" }}
//         />
//     );
// };

//     return (
//         <iframe
//             style={{
//                 width: "100%",
//                 height: "400px",
//                 border: "1px solid #ccc",
//                 borderRadius: "8px",
//             }}
//             srcDoc={html}
//         />
//     );
// };

const X = () => {
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
                    cases, consider using ScrollBox instead. <br />
                    <br />
                    When you need to customize the page-level (body/window) scroll area, ScrollBar
                    should be used directly via the body prop, since that is its primary low-level
                    use case.
                    <br />
                    <br /> Check out
                    <Button.string to="/design-system/scrollBox" label="ScrollBox" /> to see common
                    usage.
                </>
            }
        >
            <Ds.block
                title="Basic Usage"
                description="ScrollBar hides the default browser scrollbar of its parent container and shows its own scrollbar for the x and y axis if needed. You don’t need to configure for x or y axis specifically."
                code={`import { ScrollBar } from "${SYS.basePath}";

                    /* Tools */
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

                    /* Usage */
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
                title="Body Integration"
                description={`'body' prop can be used to integrate the ScrollBar into the body of the page.
                    
                    You should place it on layout level and enable 'body' prop. It will add a new scrollbar to the body of the page.`}
                code={`import { ScrollBar } from "${SYS.basePath}";

                    <Flex xAlign="start" gap={10}>
                        <TwoAxisLargeContent inProps={[{ width: 1500 }]}>
                            <ScrollBar disableX />
                        </TwoAxisLargeContent>
                        <TwoAxisLargeContent inProps={[{ width: 1500 }]}>
                            <ScrollBar disableY />
                        </TwoAxisLargeContent>
                    </Flex>`}
            />
            <Ds.api
                props={{
                    props: {
                        description: "prop description",
                        type: "prop type",
                        required: true,
                        defaultValue: "prop default value",
                    },
                }}
            />
        </Ds.page>
    );
};
export default X;

/*

disableX
disableY

    trackMargin
    edgeMargin

    truckColor
    thumbColor
    variant
    thickness
    maxLength
    minThumbLength
    body
    variant
    
    
    */

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { PopTip } from "./";
import { Button } from "../Button";

const Template = ({ children }) => (
    <Flex padding={10} bgColor="foregrounds.tint80" color="foreground">
        {children}
    </Flex>
);
const X = () => {
    /* Return */
    return (
        <Ds.page
            title="<PopTip>"
            releasedOn="1.0.0"
            description={
                <>
                    FloatingUi renders floating content relative to a trigger element, with
                    controllable position and style. FloatingUi receives its open state from the
                    outside, making it a helper component. For detailed usage examples, you can
                    review components such as PopOver, PopTip, PopConfirm, and Button.
                    <br />
                    <br />
                    Check out <Button.string
                        to="/design-system/floatingUi"
                        label="FloatingUi"
                    />{" "}
                    for more details.
                </>
            }
        >
            <Ds.block
                title="Basic Usage"
                code={`import { PopTip } from "${SYS.basePath}";

                        <PopTip content="floating content">Content</PopTip>`}
                example={
                    <Flex padding={10}>
                        <PopTip content="floating content">Content</PopTip>
                    </Flex>
                }
            />
            <Ds.block
                title="Positioning"
                description="The position option defaults to 'auto', which determines the placement based on the element's position on the screen and the floating content. However, you can override its position if you wish."
                code={`import { PopTip } from "${SYS.basePath}";

                        <PopTip content="Top / Left" alignX="left" alignY="top">
                        <Template>T/L</Template>
                        </PopTip>
                        <PopTip content="Top / Center" alignX="center" alignY="top">
                        <Template>T/C</Template>
                        </PopTip>
                        <PopTip content="Top / Right" alignX="right" alignY="top">
                        <Template>T/R</Template>
                        </PopTip>
                        <PopTip content="Bottom / Left" alignX="left" alignY="bottom">
                        <Template>B/L</Template>
                        </PopTip>
                        <PopTip content="Bottom / Center" alignX="center" alignY="bottom">
                        <Template>B/C</Template>
                        </PopTip>
                        <PopTip content="Bottom / Right" alignX="right" alignY="bottom">
                        <Template>B/R</Template>
                        </PopTip>`}
                example={
                    <Flex gap={10}>
                        <PopTip content="Top / Left" alignX="left" alignY="top">
                            <Template>T/L</Template>
                        </PopTip>
                        <PopTip content="Top / Center" alignX="center" alignY="top">
                            <Template>T/C</Template>
                        </PopTip>
                        <PopTip content="Top / Right" alignX="right" alignY="top">
                            <Template>T/R</Template>
                        </PopTip>
                        <PopTip content="Bottom / Left" alignX="left" alignY="bottom">
                            <Template>B/L</Template>
                        </PopTip>
                        <PopTip content="Bottom / Center" alignX="center" alignY="bottom">
                            <Template>B/C</Template>
                        </PopTip>
                        <PopTip content="Bottom / Right" alignX="right" alignY="bottom">
                            <Template>B/R</Template>
                        </PopTip>
                    </Flex>
                }
            />
            <Ds.block
                title="Styling"
                description="bgColor prop is used to set the background color of the PopTip. It can be a theme color, a theme path, or a css color. color calculates automatically but you can override it via 'color' prop."
                code={`import { PopTip } from "${SYS.basePath}";

                        <PopTip content="theme" bgColor="success">
                        <Template>theme</Template>
                        </PopTip>
                        <PopTip content="theme path" bgColor="foregrounds.tint50">
                        <Template>theme.path</Template>
                        </PopTip>
                        <PopTip content="css colors" bgColor="skyblue">
                        <Template>css colors</Template>
                        </PopTip>
                        <PopTip content="override color" bgColor="skyblue" color="#fff">
                        <Template>override color</Template>
                        </PopTip>
                        <PopTip content="disable arrow" disableArrow>
                        <Template>disable arrow</Template>
                        </PopTip>`}
                example={
                    <Flex gap={10}>
                        <PopTip content="theme" bgColor="success">
                            <Template>theme</Template>
                        </PopTip>
                        <PopTip content="theme path" bgColor="foregrounds.tint50">
                            <Template>theme.path</Template>
                        </PopTip>
                        <PopTip content="css colors" bgColor="skyblue">
                            <Template>css colors</Template>
                        </PopTip>
                        <PopTip content="override color" bgColor="skyblue" color="#fff">
                            <Template>override color</Template>
                        </PopTip>
                        <PopTip content="disable arrow" disableArrow>
                            <Template>disable arrow</Template>
                        </PopTip>
                    </Flex>
                }
            />
            <Ds.block
                title="Enable Escaping"
                description="'esc' button closes the PopTip even if mouse is still on the PopTip."
                code={`import { PopTip } from "${SYS.basePath}";

                        <PopTip content="enable escaping" enableEscaping>
                        <Template>enable escaping</Template>
                        </PopTip>`}
                example={
                    <Flex gap={10}>
                        <PopTip content="enable escaping" enableEscaping>
                            <Template>enable escaping</Template>
                        </PopTip>
                    </Flex>
                }
            />
            <Ds.api
                args='<PopTip content="">{null}</PopTip>'
                props={{
                    children: {
                        description: "Trigger element.",
                        type: "ReactNode",
                        required: true,
                    },
                    content: {
                        description: "Floating panel body.",
                        type: "ReactNode",
                        required: true,
                    },
                    variant: {
                        description: "FloatingUi visual variant.",
                        type: "string | component",
                        defaultValue: '"default"',
                    },
                    alignX: {
                        description: "Horizontal placement passed to FloatingUi.",
                        type: "string",
                        defaultValue: '"center"',
                    },
                    alignY: {
                        description: "Vertical placement passed to FloatingUi (top | bottom).",
                        type: "string",
                        defaultValue: '"top"',
                    },
                    disableArrow: {
                        description: "Hides the floating arrow.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    bgColor: {
                        description: "Floating background color or theme token.",
                        type: "string",
                    },
                    color: {
                        description: "Floating text color override.",
                        type: "string",
                    },
                    padding: {
                        description: "FloatingUi padding shorthand.",
                        type: "number | string",
                    },
                    paddingTop: {
                        description: "Overrides top edge of padding shorthand.",
                        type: "number | string",
                    },
                    paddingRight: {
                        description: "Overrides right edge of padding shorthand.",
                        type: "number | string",
                    },
                    paddingBottom: {
                        description: "Overrides bottom edge of padding shorthand.",
                        type: "number | string",
                    },
                    paddingLeft: {
                        description: "Overrides left edge of padding shorthand.",
                        type: "number | string",
                    },
                    enableEscaping: {
                        description:
                            "When true, Escape closes the tip while pointer may still be over it (FloatingUi).",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    open: {
                        description: "Optional controlled open state (otherwise hover-driven internal state).",
                        type: "boolean",
                    },
                    closeHandler: {
                        description: "Optional close callback when using controlled open.",
                        type: "function",
                    },
                    onMouseEnter: {
                        description: "Trigger mouse/pointer enter; PopTip defaults open behavior if omitted.",
                        type: "function",
                    },
                    onMouseLeave: {
                        description: "Trigger mouse/pointer leave; PopTip defaults close behavior if omitted.",
                        type: "function",
                    },
                    exportData: {
                        description: "Debug/export passthrough.",
                        type: "boolean | function | object",
                        defaultValue: "false",
                    },
                }}
            />
        </Ds.page>
    );
};
export default X;

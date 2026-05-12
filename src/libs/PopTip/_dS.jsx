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
    /* RETURN */
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
                    variant: {
                        description: "Variant name or custom styled variant.",
                        type: "string | component",
                        defaultValue: '"default"',
                    },
                    content: {
                        description: "Floating content rendered inside PopTip.",
                        type: "ReactNode",
                        required: true,
                    },
                    children: {
                        description: "Trigger element.",
                        type: "ReactNode",
                        required: true,
                    },
                    exportData: {
                        description: "Debug/export callback passthrough.",
                        type: "boolean | function | object",
                        defaultValue: "false",
                    },
                }}
            />
        </Ds.page>
    );
};
export default X;

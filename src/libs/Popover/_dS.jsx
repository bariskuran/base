import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Popover } from ".";
import { Flex } from "../Flex";

const Panel = () => (
    <Flex.column xAlign="start" gap={6}>
        <div>Action A</div>
        <div>Action B</div>
    </Flex.column>
);

const X = () => (
    <Ds.page title="<Popover>" releasedOn="1.0.0" description="Click-triggered floating action panel.">
        <Ds.block
            title="Basic Usage"
            code={`import { Popover } from "${SYS.basePath}";

<Popover>
  <div>Panel content</div>
</Popover>`}
            example={
                <Flex xAlign="start" gap={12}>
                    <Popover>
                        <Panel />
                    </Popover>
                </Flex>
            }
        />
        <Ds.block
            title="Button and Panel Customization"
            code={`<Popover
  buttonProps={{ label: "Open menu", outlined: true }}
  scrollBoxProps={{ maxHeight: 200, padding: 8 }}
  alignX="left"
>
  <Panel />
</Popover>`}
            example={
                <Popover
                    buttonProps={{ label: "Open menu", outlined: true }}
                    scrollBoxProps={{ maxHeight: 140, padding: 8 }}
                    alignX="left"
                >
                    <Panel />
                </Popover>
            }
        />
        <Ds.api
            props={{
                children: { description: "Popover panel content.", type: "ReactNode", required: true, defaultValue: "null" },
                buttonProps: { description: "Props forwarded to internal trigger Button.", type: "object", required: false, defaultValue: "{}" },
                scrollBoxProps: { description: "Props forwarded to internal ScrollFlex panel.", type: "object", required: false, defaultValue: "{}" },
                variant: { description: "Popover/FloatingUi variant.", type: "string | component", required: false, defaultValue: '"default"' },
                alignX: { description: "Horizontal alignment.", type: "string", required: false, defaultValue: '"center"' },
                alignY: { description: "Vertical alignment (internally forced top by default).", type: "string", required: false, defaultValue: '"top"' },
                bgColor: { description: "Panel background color.", type: "string", required: false, defaultValue: "theme.background" },
                color: { description: "Panel text color override.", type: "string", required: false, defaultValue: "auto" },
                disableArrow: { description: "Hides arrow.", type: "boolean", required: false, defaultValue: "false" },
                primary: { description: "Theme primary style.", type: "boolean", required: false, defaultValue: "false" },
                secondary: { description: "Theme secondary style.", type: "boolean", required: false, defaultValue: "false" },
                exportData: { description: "Debug/export passthrough.", type: "boolean | function | object", required: false, defaultValue: "false" },
            }}
        />
    </Ds.page>
);

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { ButtonList } from ".";

const buttons = [
    {
        variant: "error",
        label: "test",
        hoverLabel: "test hover",
        prefix: { icon: "bullet" },
        onClick: () => console.log("click"),
    },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
];

const commonButtonProps = {
    variant: "success",
    prefix: {
        icon: "user",
    },
    size: 100,
};

const X = () => {
    return (
        <Ds.page
            title="<ButtonList>"
            releasedOn="1.0.0"
            description="Renders a list of buttons merged with commonButtonProps. Shows ScrollBar when needed."
        >
            <Ds.block
                title="Vertical Usage"
                code={`import { ButtonList } from "${SYS.basePath}";

                    const buttons = [
                        { 
                            variant: "error",
                            label: "test",
                            hoverLabel: "test hover",
                            prefix: { 
                                icon: "bullet"
                            },
                            onClick: () => console.log("click"),
                        },
                        { 
                            label: "test2",
                            onClick: () => console.log("click2")
                        },
                    ];

                    const commonButtonProps = {
                        variant: "success",
                        prefix: { icon: "user" },
                        size: 100,
                    };

                    <ButtonList.column 
                        buttons={buttons}
                        commonButtonProps={commonButtonProps}
                        flexProps={{ gap: 5, height: 280 }}
                        scrollBarProps={{ trackMargin: 0 }}
                    />`}
                example={
                    <ButtonList.column
                        buttons={buttons}
                        commonButtonProps={commonButtonProps}
                        flexProps={{ gap: 5, height: 280 }}
                        scrollBarProps={{ trackMargin: 0 }}
                    />
                }
            />
            <Ds.block
                title="Horizontal Usage"
                code={`import { ButtonList } from "${SYS.basePath}";

                    <ButtonList 
                        buttons={buttons}
                        commonButtonProps={commonButtonProps}
                        variant="plain"
                        flexProps={{ 
                            direction: "row",
                            wrap: false,
                            gap: 8,
                            width: "100%",
                            xAlign: "start",
                            paddingTop: 10,
                            padding: 0
                        }} 
                        scrollBarProps={{ trackMargin: 0 }}
                    />`}
                example={
                    <ButtonList
                        buttons={buttons}
                        commonButtonProps={commonButtonProps}
                        variant="plain"
                        flexProps={{
                            direction: "row",
                            wrap: false,
                            gap: 8,
                            width: "100%",
                            xAlign: "start",
                            paddingTop: 10,
                            padding: 0,
                        }}
                        scrollBarProps={{ trackMargin: 0 }}
                    />
                }
            />
            <Ds.api
                args="<ButtonList buttons={[]} />"
                props={{
                    buttons: {
                        description: "Array of prop objects; each entry is spread onto a Button.",
                        type: "array",
                        required: true,
                    },
                    commonButtonProps: {
                        description:
                            "Deep-merged into every item; per-item keys override these defaults.",
                        type: "object",
                    },
                    flexProps: {
                        description:
                            'Forwarded to the Flex content inside ScrollFlex. Without width/height, sizing follows content; the ScrollFlex shell limits overflow (e.g. max-width: 100%). ButtonList.column merges direction: "column" into flexProps.',
                        type: "object",
                    },
                    scrollBarProps: {
                        description: "Forwarded to ScrollBar inside ScrollFlex.",
                        type: "object",
                    },
                    variant: {
                        description:
                            "When variant matches a ScrollFlex preset string (`plain`, `border`, `shadow`, `hoverShadow`; aliases include `WithShadow`, `WithHoverShadow`), it is applied only to the inner ScrollFlex—the outer ButtonList wrapper still follows componentCreator rules (DefaultVariant or PlainVariant when nested). Any other string or component selects the outer wrapper Variant.",
                        type: "string | component",
                    },
                    exportData: {
                        description: "Debug / export-data passthrough for underlying hooks.",
                        type: "boolean | function | object",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

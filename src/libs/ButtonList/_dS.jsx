import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { ButtonList } from ".";

const buttons = [
    {
        bgColor: "error",
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

const buttons2 = [
    {
        bgColor: "error",
        label: "test",
        hoverLabel: "test hover",
        prefix: { icon: "bullet" },
        onClick: () => console.log("click"),
    },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
];

const commonButtonProps = {
    bgColor: "success",
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
                            bgColor: "error",
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
                        bgColor: "success",
                        prefix: { icon: "user" },
                        size: 100,
                    };

                    <Flex gap={10} height={200}>
                        <ButtonList.column
                            buttons={buttons}
                            commonButtonProps={commonButtonProps}
                            flexProps={{ gap: 5 }}
                            scrollBarProps={{ trackMargin: 0 }}
                        />
                        <ButtonList.column
                            buttons={buttons2}
                            commonButtonProps={commonButtonProps}
                            flexProps={{ gap: 5 }}
                            scrollBarProps={{ trackMargin: 0 }}
                        />
                    </Flex>`}
                example={
                    <Flex gap={10} height={200}>
                        <ButtonList.column
                            buttons={buttons}
                            commonButtonProps={commonButtonProps}
                            flexProps={{ gap: 5 }}
                            scrollBarProps={{ trackMargin: 0 }}
                        />
                        <ButtonList.column
                            buttons={buttons2}
                            commonButtonProps={commonButtonProps}
                            flexProps={{ gap: 5 }}
                            scrollBarProps={{ trackMargin: 0 }}
                        />
                    </Flex>
                }
            />
            <Ds.block
                title="Horizontal Usage"
                code={`import { ButtonList } from "${SYS.basePath}";

                    <Flex.column gap={10} height={200} full>
                        <ButtonList
                            buttons={buttons}
                            commonButtonProps={commonButtonProps}
                            flexProps={{
                                gap: 5,
                                padding: 10,
                                paddingBottom: 0,
                            }}
                            scrollBarProps={{
                                trackMargin: 0,
                                variant: "primary",
                                disableOpacityEffect: true,
                            }}
                        />
                        <ButtonList
                            buttons={buttons2}
                            commonButtonProps={commonButtonProps}
                            flexProps={{
                                gap: 5,
                                padding: 10,
                            }}
                            scrollBarProps={{ trackMargin: 0 }}
                        />
                    </Flex.column>`}
                example={
                    <Flex.column gap={10} height={200} full>
                        <ButtonList
                            buttons={buttons}
                            commonButtonProps={commonButtonProps}
                            flexProps={{
                                gap: 5,
                                padding: 10,
                                paddingBottom: 0,
                            }}
                            scrollBarProps={{
                                trackMargin: 0,
                                variant: "primary",
                                disableOpacityEffect: true,
                            }}
                        />
                        <ButtonList
                            buttons={buttons2}
                            commonButtonProps={commonButtonProps}
                            flexProps={{
                                gap: 5,
                                padding: 10,
                            }}
                            scrollBarProps={{ trackMargin: 0 }}
                        />
                    </Flex.column>
                }
            />
            <Ds.block
                title="flat (no ScrollFlex)"
                code={`import { ButtonList, Flex } from "${SYS.basePath}";

                    <Flex direction="row" gap={8}>
                        <ButtonList
                            flat
                            buttons={[
                                { label: "One", onClick: () => {} },
                                { label: "Two", onClick: () => {} },
                            ]}
                            commonButtonProps={{ variant: "plain" }}
                        />
                    </Flex>`}
                description="No outer Variant, no inner Flex or ScrollFlex: only Button nodes in a fragment so the parent (e.g. Popover ScrollFlex content Flex) owns gap, direction, and scroll."
                example={
                    <Flex direction="row" gap={8}>
                        <ButtonList
                            flat
                            buttons={[
                                { label: "One", onClick: () => {} },
                                { label: "Two", onClick: () => {} },
                                { label: "Three", onClick: () => {} },
                            ]}
                            commonButtonProps={{ variant: "plain" }}
                        />
                    </Flex>
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
                            'Forwarded to ScrollFlex content (inner Flex) when flat is false. Ignored when flat is true (buttons are direct children of the parent). Without width/height, sizing follows content; the ScrollFlex shell limits overflow (e.g. max-width: 100%). ButtonList.column merges direction: "column" into flexProps when flat is false.',
                        type: "object",
                    },
                    scrollBarProps: {
                        description:
                            "Forwarded to ScrollBar inside ScrollFlex when flat is false. Ignored when flat is true.",
                        type: "object",
                    },
                    variant: {
                        description:
                            "When variant matches a ScrollFlex preset string (`plain`, `border`, `shadow`, `hoverShadow`; aliases include `WithShadow`, `WithHoverShadow`), it is applied only to the inner ScrollFlex—the outer ButtonList wrapper still follows componentCreator rules (DefaultVariant or PlainVariant when nested). Any other string or component selects the outer wrapper Variant. Ignored when flat is true (no wrapper, no ScrollFlex).",
                        type: "string | component",
                    },
                    flat: {
                        description:
                            "When true, renders only Button nodes in a fragment: no DefaultVariant/PlainVariant wrapper, no ScrollFlex, no inner Flex, no row clamp grid. Layout (gap, direction, scroll) comes from the parent. flexProps, scrollBarProps, scrollFlex variant strings, and style/ref on the list wrapper have no effect.",
                        type: "boolean",
                        defaultValue: "false",
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

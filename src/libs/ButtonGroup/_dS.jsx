import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { ButtonGroup } from ".";

const items = [
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

const items2 = [
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

const groupProps = {
    bgColor: "success",
    prefix: {
        icon: "user",
    },
    size: 100,
};

const X = () => {
    return (
        <Ds.page
            title="<ButtonGroup>"
            releasedOn="1.0.0"
            description="Button list on Group: shared groupProps per item, ScrollFlex + ScrollBar when not flat."
        >
            <Ds.block
                title="Vertical Usage"
                code={`import { ButtonGroup } from "${SYS.basePath}";

                    const items = [
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

                    const groupProps = {
                        bgColor: "success",
                        prefix: { icon: "user" },
                        size: 100,
                    };

                    <Flex gap={10} height={200}>
                        <ButtonGroup.column
                            items={items}
                            groupProps={groupProps}
                            flexProps={{ gap: 5 }}
                            scrollBarProps={{ trackMargin: 0 }}
                            scrollEdgeShadow
                        />
                        <ButtonGroup.column
                            items={items2}
                            groupProps={groupProps}
                            flexProps={{ gap: 5 }}
                            scrollBarProps={{ trackMargin: 0 }}
                            scrollEdgeShadow
                        />
                    </Flex>`}
                example={
                    <Flex gap={10} height={200}>
                        <ButtonGroup.column
                            items={items}
                            groupProps={groupProps}
                            flexProps={{ gap: 5 }}
                            scrollBarProps={{ trackMargin: 0 }}
                            scrollEdgeShadow
                        />
                        <ButtonGroup.column
                            items={items2}
                            groupProps={groupProps}
                            flexProps={{ gap: 5 }}
                            scrollBarProps={{ trackMargin: 0 }}
                            scrollEdgeShadow
                        />
                    </Flex>
                }
            />
            <Ds.block
                title="Horizontal Usage"
                code={`import { ButtonGroup } from "${SYS.basePath}";

                    <Flex.column gap={10} height={200} full>
                        <ButtonGroup
                            items={items}
                            groupProps={groupProps}
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
                            scrollEdgeShadow
                        />
                        <ButtonGroup
                            items={items2}
                            groupProps={groupProps}
                            flexProps={{
                                gap: 5,
                                padding: 10,
                            }}
                            scrollBarProps={{ trackMargin: 0 }}
                            scrollEdgeShadow
                        />
                    </Flex.column>`}
                example={
                    <Flex.column gap={10} height={200} full>
                        <ButtonGroup
                            items={items}
                            groupProps={groupProps}
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
                            scrollEdgeShadow
                        />
                        <ButtonGroup
                            items={items2}
                            groupProps={groupProps}
                            flexProps={{
                                gap: 5,
                                padding: 10,
                            }}
                            scrollBarProps={{ trackMargin: 0 }}
                            scrollEdgeShadow
                        />
                    </Flex.column>
                }
            />
            <Ds.block
                title="flat (no ScrollFlex)"
                code={`import { ButtonGroup, Flex } from "${SYS.basePath}";

                    <Flex direction="row" gap={8}>
                        <ButtonGroup
                            flat
                            items={[
                                { label: "One", onClick: () => {} },
                                { label: "Two", onClick: () => {} },
                            ]}
                            groupProps={{ variant: "plain" }}
                        />
                    </Flex>`}
                description="No outer Variant, no inner Flex or ScrollFlex: only Button nodes in a fragment so the parent (e.g. PopOver ScrollFlex content Flex) owns gap, direction, and scroll."
                example={
                    <Flex direction="row" gap={8}>
                        <ButtonGroup
                            flat
                            items={[
                                { label: "One", onClick: () => {} },
                                { label: "Two", onClick: () => {} },
                                { label: "Three", onClick: () => {} },
                            ]}
                            groupProps={{ variant: "plain" }}
                        />
                    </Flex>
                }
            />
            <Ds.api
                args="<ButtonGroup items={[]} />"
                props={{
                    items: {
                        description: "Array of prop objects; each entry is spread onto a Button.",
                        type: "array",
                        required: true,
                    },
                    groupProps: {
                        description:
                            "Deep-merged into every item; per-item keys override these defaults.",
                        type: "object",
                    },
                    flexProps: {
                        description:
                            'Forwarded to ScrollFlex content (inner Flex) when flat is false. Ignored when flat is true (items are direct children of the parent). Without width/height, sizing follows content; the ScrollFlex shell limits overflow (e.g. max-width: 100%). ButtonGroup.column merges direction: "column" into flexProps when flat is false.',
                        type: "object",
                    },
                    scrollBarProps: {
                        description:
                            "Forwarded to ScrollBar inside ScrollFlex when flat is false. Ignored when flat is true.",
                        type: "object",
                    },
                    variant: {
                        description:
                            "When variant matches a ScrollFlex preset string (`plain`, `border`, `shadow`, `hoverShadow`; aliases include `WithShadow`, `WithHoverShadow`), it is applied only to the inner ScrollFlex—the outer ButtonGroup wrapper still follows componentCreator rules (DefaultVariant or PlainVariant when nested). Any other string or component selects the outer wrapper Variant. Ignored when flat is true (no wrapper, no ScrollFlex).",
                        type: "string | component",
                    },
                    flat: {
                        description:
                            "When true, renders only Button nodes in a fragment: no DefaultVariant/PlainVariant wrapper, no ScrollFlex, no inner Flex, no row clamp grid. Layout (gap, direction, scroll) comes from the parent. flexProps, scrollBarProps, scrollFlex variant strings, and style/ref on the list wrapper have no effect.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    scrollEdgeShadow: {
                        description:
                            "Optional inward edge shadows over the scroll area. Row layout: left/right; column layout: top/bottom. Start edge (left/top) appears only after scrolling; end edge (right/bottom) hides when scrolled to the end. Opacity transitions over 0.25s.",
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

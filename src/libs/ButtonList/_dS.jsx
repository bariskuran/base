import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { ButtonList } from ".";
import { Flex } from "../Flex";

const items = [
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
];

const commonProps = {
    variant: "success",
    prefix: {
        icon: "user",
    },
    size: 100,
};

const X = () => {
    return (
        <Ds.page title="<ButtonList>" releasedOn="1.0.0" description="Renders a list of buttons.">
            <Ds.block
                title="Basic Usage"
                code={`import { ButtonList } from "${SYS.basePath}";

                    <ButtonList items={[{ label: "Edit" }, { label: "Delete" }]} />`}
                example={<ButtonList items={items} />}
            />
            <Ds.block
                title="Common Props + Direction"
                code={`<ButtonList
                            direction="row"
                            gap={10}
                            commonProps={{ size: 90, outlined: true }}
                            items={items}
                        />`}
                example={
                    <Flex xAlign="start">
                        <ButtonList commonProps={commonProps} items={items} />
                    </Flex>
                }
            />
            <Ds.api
                props={{
                    items: {
                        description: "Button prop objects to render.",
                        type: "array",
                        required: true,
                        defaultValue: "[]",
                    },
                    commonProps: {
                        description: "Merged into each item.",
                        type: "object",
                        required: false,
                        defaultValue: "{}",
                    },
                    direction: {
                        description: "Layout direction: row | column.",
                        type: "string",
                        required: false,
                        defaultValue: '"column"',
                    },
                    gap: {
                        description: "Gap between buttons.",
                        type: "number",
                        required: false,
                        defaultValue: "5",
                    },
                    bgColor: {
                        description: "Container tone source color.",
                        type: "string",
                        required: false,
                        defaultValue: "theme.background",
                    },
                    maxHeight: {
                        description: "Forwards maxHeight to ScrollFlex.",
                        type: "number | string",
                        required: false,
                        defaultValue: "undefined",
                    },
                    maxWidth: {
                        description: "Forwards maxWidth to ScrollFlex.",
                        type: "number | string",
                        required: false,
                        defaultValue: "undefined",
                    },
                    scrollFlexProps: {
                        description: "Additional ScrollFlex props.",
                        type: "object",
                        required: false,
                        defaultValue: "{}",
                    },
                    variant: {
                        description: "Variant name or custom styled variant.",
                        type: "string | component",
                        required: false,
                        defaultValue: '"default"',
                    },
                    exportData: {
                        description: "Debug/export passthrough.",
                        type: "boolean | function | object",
                        required: false,
                        defaultValue: "false",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

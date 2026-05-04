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
        <Ds.page title="<ButtonList>" releasedOn="1.0.0" description="Renders a list of buttons.">
            <Ds.block
                title="Basic Usage"
                code={`import { ButtonList } from "${SYS.basePath}";

                    <ButtonList
                        buttons={[{ label: "Edit" }, { label: "Delete" }]}
                        flexProps={{ direction: "column", gap: 5 }}
                    />`}
                example={
                    <ButtonList.column
                        buttons={buttons}
                        commonButtonProps={commonButtonProps}
                        flexProps={{ gap: 5, maxHeight: 280, overflowY: "auto" }}
                    />
                }
            />
            <Ds.api
                props={{
                    buttons: {
                        description: "Her biri Button’a giden prop nesneleri.",
                        type: "array",
                        required: true,
                        defaultValue: "[]",
                    },
                    commonButtonProps: {
                        description: "Her butonla deepMerge edilir; öğe alanları bunun üzerine yazar.",
                        type: "object",
                        required: false,
                        defaultValue: "{}",
                    },
                    flexProps: {
                        description:
                            "İç Flex’e iletilir. width verilmezse varsayılan width: 100% uygulanır; direction/gap Flex sysDefaults (row, gap 0) veya bu nesne ile gelir. Dikey liste için ButtonList.column veya flexProps.direction: \"column\" kullanın.",
                        type: "object",
                        required: false,
                        defaultValue: "{}",
                    },
                    scrollBarProps: {
                        description: "ScrollBar’a iletilir; sourceByRef yoksa kaydırma alanı olarak iç Flex kullanılır.",
                        type: "object",
                        required: false,
                        defaultValue: "{}",
                    },
                    variant: {
                        description: "Variant adı veya özel styled variant.",
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

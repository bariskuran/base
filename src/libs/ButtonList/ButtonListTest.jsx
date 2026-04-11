import { ButtonList } from "./";

export const ButtonListTest = () => {
    return (
        <ButtonList.row
            // scrollBoxProps={{ scrollBarProps: { variant: "defaultVariant" } }}
            maxWidth="100%"
            items={[
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
            ]}
            commonProps={{
                variant: "success",
                prefix: {
                    icon: "user",
                },
                size: 100,
            }}
        />
    );
};

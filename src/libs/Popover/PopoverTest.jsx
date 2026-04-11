import { Popover } from "./";
import { ButtonList } from "../ButtonList";

export const PopoverTest = () => {
    return (
        <Popover>
            <ButtonList
                scrollBoxProps={
                    {
                        // variant: "threeD",
                        // disableShadow: true,
                        // scrollBarProps: { variant: "defaultVariant" }
                    }
                }
                maxHeight={200}
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
        </Popover>
    );
};

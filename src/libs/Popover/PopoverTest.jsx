import { Popover } from "./";
import { ButtonList } from "../ButtonList";

export const PopoverTest = () => {
    return (
        <Popover>
            <ButtonList
                flexProps={{
                    direction: "column",
                    maxHeight: 200,
                    overflowY: "auto",
                }}
                buttons={[
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
                commonButtonProps={{
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

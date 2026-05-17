import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { PopConfirm } from ".";
import { Button } from "../Button";
import { getText } from "../getText";
import { notifier } from "../notifier";

const X = () => (
    <Ds.page
        title="<PopConfirm>"
        releasedOn="1.0.0"
        description={
            <>
                PopConfirm is a component used to confirm an action. After the initial action is
                triggered, it is halted; it will only be executed upon confirmation or ignored if
                cancelled.
                <br />
                <br />
                PopConfirm is built on top of PopOver and Button components. The three buttons are
                managed with 'contentButtonProps', 'confirmButtonProps', and 'cancelButtonProps'.
                All other props are passed to PopOver.
                <br />
                <br />
                Detailed usage examples:
                <br />
                <Button.string to="/design-system/popOver" label="PopOver" />
                <br />
                <Button.string to="/design-system/button" label="Button" />
            </>
        }
    >
        <Ds.block
            title="Basic Usage"
            code={`import { PopConfirm } from "${SYS.basePath}";

                <PopConfirm
                    contentButtonProps={{
                        label: "Delete",
                        onClick: () => notifier.add("deleted"),
                    }}
                    confirmButtonProps={{
                        onClick: () => notifier.add("confirmed."),
                    }}
                    cancelButtonProps={{
                        onClick: () => notifier.add("cancelled"),
                    }}
                />`}
            example={
                <PopConfirm
                    contentButtonProps={{
                        label: "Delete",
                        onClick: () => notifier.add("deleted"),
                    }}
                    confirmButtonProps={{
                        onClick: () => notifier.add("confirmed."),
                    }}
                    cancelButtonProps={{
                        onClick: () => notifier.add("cancelled"),
                    }}
                />
            }
        />
        <Ds.api
            args="<PopConfirm />"
            props={{
                confirmationContent: {
                    description: "The confirmation message to be displayed.",
                    type: "React Node",
                    defaultValue: getText("areYouSure"),
                },
                contentButtonProps: {
                    description:
                        "Props for the trigger <Button> component. See <Button> API for details.",
                    type: "object",
                },
                confirmButtonProps: {
                    description:
                        "Confirm button. The onClick is merged with the trigger; if both href/to/url and a trigger are set, the trigger takes precedence.",
                    type: "object",
                    defaultValue: '{ label: "Confirm", prefix: { icon: "check" } }',
                },
                cancelButtonProps: {
                    description:
                        "Cancel button. Closes the panel when clicked. When clicking outside, onClick/href/to/url props here are triggered.",
                    type: "object",
                    defaultValue: '{ label: "Cancel", prefix: { icon: "close" } }',
                },
                _rest: {
                    description:
                        "All other props are passed to PopOver. See the PopOver API for more details.",
                    type: "object",
                },
            }}
        />
    </Ds.page>
);

export default X;

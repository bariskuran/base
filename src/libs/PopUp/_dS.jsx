import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { PopUp } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { notifier } from "../notifier";
import { baseStore } from "../baseStore";
import { generateRandom } from "../generateRandom";

const longText = generateRandom.loremIpsum(1000);

const X = () => {
    const { open, open2, open3, open4, open5, setByPath } = baseStore.useLocal({});

    return (
        <Ds.page
            title="<PopUp>"
            releasedOn="1.0.0"
            description={
                <>
                    PopUp renders a centered modal in a portal on <code>document.body</code> (fixed
                    overlay). Open state is controlled from outside with <code>open</code> and{" "}
                    <code>onClose</code> — same pattern as Material UI Modal: the trigger lives next
                    to PopUp, not inside it.
                    <br />
                    <br />
                    <code>cancelButtonProps</code> and <code>confirmButtonProps</code> are optional;
                    omit a prop to hide that button. The top-right close icon is always shown
                    (customize with <code>closeButtonProps</code>).
                    <br />
                    <br />
                    <Button.string to="/design-system/button" label="Button" />
                    <br />
                    <Button.string to="/design-system/scrollFlex" label="ScrollFlex" />
                </>
            }
        >
            <Ds.block
                title="Controlled open (recommended)"
                description="Keep isOpen in parent state. PopUp only renders the overlay when open is true."
                code={`import { PopUp, Button, baseStore } from "${SYS.basePath}";

                        const { isOpen, set } = baseStore.useLocal({
                            isOpen: false,
                        });

                        <Button label="Open modal" onClick={() => set((s) => { s.isOpen = true; })} />
                        <PopUp
                            open={isOpen}
                            onClose={() => set((s) => { s.isOpen = false; })}
                            cancelButtonProps={{ onClick: () => console.log("cancel") }}
                            confirmButtonProps={{ onClick: () => console.log("confirm") }}
                        >
                            Modal content
                        </PopUp>`}
                example={
                    <>
                        <Button label="Open modal" onClick={() => setByPath("open", true)} />
                        <PopUp
                            open={open}
                            onClose={() => setByPath("open", false)}
                            cancelButtonProps={{
                                onClick: () => notifier.add("cancelled"),
                            }}
                            confirmButtonProps={{
                                onClick: () => notifier.add("confirmed"),
                            }}
                        >
                            <Typo>Modal content</Typo>
                        </PopUp>
                    </>
                }
            />
            <Ds.block
                title="Content only"
                description="Omit cancelButtonProps and confirmButtonProps — only the close icon closes the modal (plus backdrop / Escape)."
                code={`<PopUp open={open} onClose={() => set((s) => { s.open = false; })}>
                            <Typo>Informational content</Typo>
                        </PopUp>`}
                example={
                    <>
                        <Button
                            label="Open minimal"
                            onClick={() => setByPath("open2", true)}
                        />
                        <PopUp open={open2} onClose={() => setByPath("open2", false)}>
                            <Flex.column gap={8}>
                                <Typo weight={600}>Notice</Typo>
                                <Typo size="sm" color="foregrounds.tint60">
                                    No cancel/confirm row — use the close icon or click outside.
                                </Typo>
                            </Flex.column>
                        </PopUp>
                    </>
                }
            />
            <Ds.block
                title="disable backdrop close & esc close"
                description="When true, clicking the backdrop and pressing Escape does not close."
                code={`<PopUp open={open} onClose={() => set((s) => { s.open = false; })} disableBackdropClose disableEscClose>
                            <Typo>Informational content</Typo>
                        </PopUp>`}
                example={
                    <>
                        <Button
                            label={undefined}
                            secondary
                            icon={{ icon: "duplicate" }}
                            onClick={() => setByPath("open3", true)}
                        />
                        <PopUp
                            open={open3}
                            disableBackdropClose
                            disableEscClose
                            onClose={() => setByPath("open3", false)}
                        >
                            <Flex>
                                Backdrop close disabled.
                                <br />
                                Close icon still active.
                                <br />
                                Footer buttons are optional.
                            </Flex>
                        </PopUp>
                    </>
                }
            />
            <Ds.block
                title="ScrollFlex integration"
                description="By default PopUp uses native overflow. Set useScrollFlex for ScrollFlex on large content."
                code={`<PopUp
                            open={open}
                            useScrollFlex
                            onClose={() => set((s) => { s.open = false; })}
                        >
                            {longText}
                        </PopUp>`}
                example={
                    <>
                        <Button
                            label="Open long text"
                            outlined
                            color="error"
                            prefix={{ icon: "description" }}
                            onClick={() => setByPath("open4", true)}
                        />
                        <PopUp
                            open={open4}
                            useScrollFlex
                            onClose={() => setByPath("open4", false)}
                        >
                            <Flex>{longText}</Flex>
                        </PopUp>
                    </>
                }
            />
            <Ds.api
                args="<PopUp />"
                props={{
                    open: {
                        description:
                            "Controlled visibility. When provided, parent owns open state (use with onClose / onOpenChange).",
                        type: "boolean",
                    },
                    defaultOpen: {
                        description:
                            "Initial open state when open is not provided (uncontrolled). Rare; prefer controlled open.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    onClose: {
                        description:
                            "Called when the modal closes. Receives { reason }: close | cancel | confirm | backdrop | esc.",
                        type: "fn",
                    },
                    onOpenChange: {
                        description: "Called with false when the modal closes.",
                        type: "fn",
                    },
                    children: {
                        description: "Modal body content.",
                        type: "React Node",
                        required: true,
                    },
                    closeButtonProps: {
                        description: "Top-right close control (Button API). Always rendered.",
                        type: "object",
                    },
                    cancelButtonProps: {
                        description: "Cancel button. Omit to hide.",
                        type: "object",
                    },
                    confirmButtonProps: {
                        description: "Confirm button. Omit to hide.",
                        type: "object",
                    },
                    disableBackdropClose: {
                        description: "When true, clicking the backdrop does not close.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    disableEscClose: {
                        description: "When true, Escape does not close.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    lockScroll: {
                        description: "Locks document scroll while open.",
                        type: "boolean",
                        defaultValue: "true",
                    },
                    zIndex: {
                        description: "Stacking order of the modal root.",
                        type: "number",
                        defaultValue: "100000",
                    },
                    useScrollFlex: {
                        description:
                            "When true, body scroll uses ScrollFlex + ScrollBar. Default false uses native overflow (no scrollbar on short content).",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    scrollFlexProps: {
                        description:
                            "Passed to ScrollFlex when useScrollFlex is true (flexProps, scrollBarProps, maxHeight, etc.). trackMargin defaults to 0.",
                        type: "object",
                    },
                    _rest: {
                        description: "Remaining props are spread onto the panel element.",
                        type: "object",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

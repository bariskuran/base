import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { PopUp } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { notifier } from "../notifier";
import { baseStore } from "../baseStore";
import { generateRandom } from "../generateRandom";
import { t } from "../getText";

const longText = generateRandom.loremIpsum(1000);

const X = () => {
    const { open, open2, open3, open4, open5, setByPath } = baseStore.useLocal({});

    return (
        <Ds.page
            title="<PopUp>"
            releasedOn="1.0.0"
            description={
                <>
                    {t({ tr: "PopUp, document.body üzerinde bir portalda ortalanmış modal render eder (fixed overlay). Açık durumu open ve ", en: "PopUp renders a centered modal in a portal on document.body (fixed overlay). Its open state is controlled externally with open and " })}<code>onClose</code>{t({ tr: " ile dışarıdan yönetilir — Material UI Modal ile aynı desen: tetikleyici PopUp'ın içinde değil, yanında bulunur.", en: " — following the Material UI Modal pattern: the trigger lives next to PopUp, not inside it." })}
                    <br />
                    <br />
                    <code>cancelButtonProps</code>{t({ tr: " ve ", en: " and " })}<code>confirmButtonProps</code>{t({ tr: " isteğe bağlıdır; bir prop'u vermeyerek ilgili butonu gizleyebilirsiniz. Sağ üstteki kapatma ikonu her zaman gösterilir (", en: " are optional; omit either prop to hide that button. The top-right close icon is always shown (customise it with " })}<code>closeButtonProps</code>{t({ tr: " ile özelleştirilir).", en: ")." })}
                    <br />
                    <br />
                    <Button.string to="/design-system/button" label="Button" />
                    <br />
                    <Button.string to="/design-system/scrollFlex" label="ScrollFlex" />
                </>
            }
        >
            <Ds.block
                title={{ tr: "Kontrollü open (önerilir)", en: "Controlled Open (Recommended)" }}
                description={{ tr: "isOpen değerini parent state'te tutun. PopUp overlay'i yalnızca open true olduğunda render eder.", en: "Keep isOpen in parent state. PopUp renders the overlay only when open is true." }}
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
                title={{ tr: "Yalnızca içerik", en: "Content Only" }}
                description={{ tr: "cancelButtonProps ve confirmButtonProps'u vermeyin — modalı yalnızca kapatma ikonu (ayrıca backdrop / Escape) kapatır.", en: "Omit cancelButtonProps and confirmButtonProps — only the close icon closes the modal (along with backdrop / Escape)." }}
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
                title={{ tr: "Backdrop ve Escape ile kapatmayı devre dışı bırakma", en: "Disable Backdrop and Escape Close" }}
                description={{ tr: "true olduğunda backdrop'a tıklamak ve Escape'e basmak modalı kapatmaz.", en: "When true, clicking the backdrop and pressing Escape do not close the modal." }}
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
                title={{ tr: "ScrollFlex entegrasyonu", en: "ScrollFlex Integration" }}
                description={{ tr: "PopUp varsayılan olarak native overflow kullanır. Büyük içerikte ScrollFlex için useScrollFlex verin.", en: "PopUp uses native overflow by default. Set useScrollFlex to use ScrollFlex for large content." }}
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
                        description: { tr: "Kontrollü görünürlük. Verildiğinde open state parent'a aittir (onClose / onOpenChange ile kullanın).", en: "Controlled visibility. When provided, the parent owns open state (use with onClose / onOpenChange)." },
                        type: "boolean",
                    },
                    defaultOpen: {
                        description: { tr: "open verilmediğinde başlangıç açık durumu (uncontrolled). Nadiren kullanılır; kontrollü open tercih edin.", en: "Initial open state when open is not provided (uncontrolled). Rare; prefer controlled open." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    onClose: {
                        description: { tr: "Modal kapandığında çağrılır. { reason } alır: close | cancel | confirm | backdrop | esc.", en: "Called when the modal closes. Receives { reason }: close | cancel | confirm | backdrop | esc." },
                        type: "fn",
                    },
                    onOpenChange: {
                        description: { tr: "Modal kapandığında false ile çağrılır.", en: "Called with false when the modal closes." },
                        type: "fn",
                    },
                    children: {
                        description: { tr: "Modal gövde içeriği.", en: "Modal body content." },
                        type: "React Node",
                        required: true,
                    },
                    closeButtonProps: {
                        description: { tr: "Sağ üst kapatma kontrolü (Button API). Her zaman render edilir.", en: "Top-right close control (Button API). Always rendered." },
                        type: "object",
                    },
                    cancelButtonProps: {
                        description: { tr: "İptal butonu. Gizlemek için vermeyin.", en: "Cancel button. Omit to hide." },
                        type: "object",
                    },
                    confirmButtonProps: {
                        description: { tr: "Onay butonu. Gizlemek için vermeyin.", en: "Confirm button. Omit to hide." },
                        type: "object",
                    },
                    disableBackdropClose: {
                        description: { tr: "true olduğunda backdrop'a tıklamak kapatmaz.", en: "When true, clicking the backdrop does not close." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    disableEscClose: {
                        description: { tr: "true olduğunda Escape kapatmaz.", en: "When true, Escape does not close." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    lockScroll: {
                        description: { tr: "Açıkken document scroll'unu kilitler.", en: "Locks document scrolling while open." },
                        type: "boolean",
                        defaultValue: "true",
                    },
                    zIndex: {
                        description: { tr: "Modal kökünün stacking sırası.", en: "Stacking order of the modal root." },
                        type: "number",
                        defaultValue: "100000",
                    },
                    useScrollFlex: {
                        description: { tr: "true olduğunda gövde scroll'u ScrollFlex + ScrollBar kullanır. Varsayılan false native overflow kullanır (kısa içerikte scrollbar yoktur).", en: "When true, body scrolling uses ScrollFlex + ScrollBar. Default false uses native overflow (no scrollbar on short content)." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                    scrollFlexProps: {
                        description: { tr: "useScrollFlex true olduğunda ScrollFlex'e aktarılır (flexProps, scrollBarProps, maxHeight vb.). trackMargin varsayılanı 0'dır.", en: "Passed to ScrollFlex when useScrollFlex is true (flexProps, scrollBarProps, maxHeight, etc.). trackMargin defaults to 0." },
                        type: "object",
                    },
                    _rest: {
                        description: { tr: "Kalan proplar panel elementine spread edilir.", en: "Remaining props are spread onto the panel element." },
                        type: "object",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

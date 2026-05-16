import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { PopConfirm } from ".";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { getText } from "../getText";

const X = () => (
    <Ds.page
        title="<PopConfirm>"
        releasedOn="1.0.0"
        description={
            <>
                PopConfirm, Popover üzerine kuruludur: panelde üstte onay mesajı, altta Vazgeç ve
                Onayla butonları vardır. ScrollFlex ve tetikleyici buton Popover tarafından
                yönetilir; kalan tüm prop&apos;lar Popover&apos;a iletilir.
                <br />
                <br />
                <Button.string to="/design-system/popover" label="Popover" />
                {" · "}
                <Button.string to="/design-system/button" label="Button" />
            </>
        }
    >
        <Ds.block
            title="Basic Usage"
            description="Varsayılan metin ve butonlar (getText) kullanılır. Onay veya vazgeçince panel kapanır."
            code={`import { PopConfirm } from "${SYS.basePath}";

<PopConfirm buttonProps={{ label: "Delete", outlined: true }} />`}
            example={
                <PopConfirm
                    cancelButtonProps={{ onClick: () => console.log("cancelled") }}
                    confirmButtonProps={{ onClick: () => console.log("confirmed") }}
                    buttonProps={{ label: "Delete", onClick: () => console.log("deleted") }}
                />
            }
        />
        {/* <Ds.block
            title="Custom confirmation"
            description="Mesaj ve onay butonu özelleştirilebilir."
            code={`import { PopConfirm } from "${SYS.basePath}";

<PopConfirm
    buttonProps={{ label: "Remove", outlined: true }}
    confirmationContent="Remove this item permanently?"
    confirmButtonProps={{ label: "Remove", bgColor: "error" }}
/>`}
            example={
                <PopConfirm
                    buttonProps={{ label: "Remove", outlined: true }}
                    confirmationContent="Remove this item permanently?"
                    confirmButtonProps={{ label: "Remove", bgColor: "error" }}
                />
            }
        />
        <Ds.block
            title="Extra panel content"
            description="children, mesaj ile aksiyon butonları arasına eklenir."
            code={`import { PopConfirm } from "${SYS.basePath}";

<PopConfirm buttonProps={{ label: "Archive", outlined: true }}>
    <Typo size="sm" color="foregrounds.tint60">
        Archived items can be restored within 30 days.
    </Typo>
</PopConfirm>`}
            example={
                <PopConfirm buttonProps={{ label: "Archive", outlined: true }}>
                    <Typo size="sm" color="foregrounds.tint60">
                        Archived items can be restored within 30 days.
                    </Typo>
                </PopConfirm>
            }
        />
        <Ds.block
            title="onClick handlers"
            description="Buton onClick çalışır; ardından panel kapanır."
            code={`import { PopConfirm } from "${SYS.basePath}";

<PopConfirm
    buttonProps={{ label: "Submit", outlined: true }}
    confirmButtonProps={{
        onClick: () => console.log("confirmed"),
    }}
    cancelButtonProps={{
        onClick: () => console.log("cancelled"),
    }}
/>`}
            example={
                <PopConfirm
                    buttonProps={{ label: "Submit", outlined: true }}
                    confirmButtonProps={{
                        onClick: () => console.log("confirmed"),
                    }}
                    cancelButtonProps={{
                        onClick: () => console.log("cancelled"),
                    }}
                />
            }
        /> */}
        <Ds.api
            args="<PopConfirm />"
            props={{
                confirmationContent: {
                    description: "Panelin üst kısmında gösterilen onay mesajı.",
                    type: "React Node",
                    defaultValue: getText("areYouSure"),
                },
                confirmButtonProps: {
                    description:
                        "Onay butonu prop'ları. Varsayılanlarla birleştirilir; onClick sonrası panel kapanır.",
                    type: "object",
                    defaultValue: '{ label: "Confirm", prefix: { icon: "check" } }',
                },
                cancelButtonProps: {
                    description:
                        "Vazgeç butonu prop'ları. Varsayılanlarla birleştirilir; onClick sonrası panel kapanır.",
                    type: "object",
                    defaultValue: '{ label: "Cancel", prefix: { icon: "close" } }',
                },
                children: {
                    description: "Mesaj ile aksiyon butonları arasına yerleştirilen ek içerik.",
                    type: "React Node",
                },
                buttonProps: {
                    description: "Popover tetikleyici butonu. Button API'sine bakın.",
                    type: "object",
                },
                scrollFlexProps: {
                    description: "Popover panel ScrollFlex ayarları.",
                    type: "object",
                },
                _rest: {
                    description:
                        "Diğer tüm prop'lar Popover / FloatingUi'ye iletilir (konum, offset, exportData, vb.).",
                    type: "object",
                },
            }}
        />
    </Ds.page>
);

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { PopConfirm } from ".";
import { Button } from "../Button";
import { getText, t } from "../getText";
import { notifier } from "../notifier";
import { Flex } from "../Flex";
import { DEFAULT_TRIGGER_DELAY_MS } from "./tools/defaultPopConfirmProps";

const X = () => (
    <Ds.page
        title="<PopConfirm>"
        releasedOn="1.0.0"
        description={
            <>
                {t({ tr: "PopConfirm, bir action'ı onaylamak için kullanılan componenttir. İlk action tetiklendikten sonra durdurulur; yalnızca onay verildiğinde çalışır, iptal edildiğinde yok sayılır.", en: "PopConfirm is a component used to confirm an action. After the initial action is triggered, it is held; it executes only after confirmation and is ignored when cancelled." })}
                <br />
                <br />
                {t({ tr: "PopConfirm, PopOver ve Button componentleri üzerine kuruludur. Üç buton contentButtonProps, confirmButtonProps ve cancelButtonProps ile yönetilir. Diğer tüm proplar PopOver'a aktarılır.", en: "PopConfirm is built on PopOver and Button. Its three buttons are managed through contentButtonProps, confirmButtonProps, and cancelButtonProps. All other props are passed to PopOver." })}
                <br />
                <br />
                {t({ tr: "Ayrıntılı kullanım örnekleri:", en: "Detailed usage examples:" })}
                <br />
                <Button.string to="/design-system/popOver" label="PopOver" />
                <br />
                <Button.string to="/design-system/button" label="Button" />
            </>
        }
    >
        <Ds.block
            title={{ tr: "Temel Kullanım", en: "Basic Usage" }}
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
        <Ds.block
            title={{ tr: "Gelişmiş Kullanım", en: "Advanced Usage" }}
            code={`import { PopConfirm } from "${SYS.basePath}";

                   <PopConfirm
                    content="Warning: This action is irreversible."
                    contentButtonProps={{
                        icon: { icon: "trash", hoverIcon: "warning", activeIcon: "warning" },
                        bgColor: "error",
                        hoverBgColor: "foreground",
                        activeBgColor: "success",
                        onClick: () => notifier.add("action triggered."),
                    }}
                    confirmButtonProps={{
                        label: undefined,
                        prefix: undefined,
                        icon: { icon: "download" },
                        onClick: () => notifier.add("confirmed."),
                    }}
                    cancelButtonProps={{
                        label: undefined,
                        prefix: undefined,
                        icon: { icon: "arrowLeft" },
                        onClick: () => notifier.add("cancelled"),
                    }}
                   />`}
            example={
                <PopConfirm
                    content="Warning: This action is irreversible."
                    contentButtonProps={{
                        icon: { icon: "trash", hoverIcon: "warning", activeIcon: "warning" },
                        bgColor: "error",
                        hoverBgColor: "foreground",
                        activeBgColor: "success",
                        onClick: () => notifier.add("action triggered."),
                    }}
                    confirmButtonProps={{
                        label: undefined,
                        prefix: undefined,
                        icon: { icon: "download" },
                        onClick: () => notifier.add("confirmed."),
                    }}
                    cancelButtonProps={{
                        label: undefined,
                        prefix: undefined,
                        icon: { icon: "arrowLeft" },
                        onClick: () => notifier.add("cancelled"),
                    }}
                />
            }
        />
        <Ds.api
            args="<PopConfirm />"
            props={{
                content: {
                    description: { tr: "Gösterilecek onay mesajı.", en: "The confirmation message to display." },
                    type: "React Node",
                    defaultValue: getText("areYouSure"),
                },
                contentButtonProps: {
                    description: { tr: "Tetikleyici Button componentinin propları. Ayrıntılar için Button API'sine bakın.", en: "Props for the trigger Button component. See the Button API for details." },
                    type: "object",
                },
                confirmButtonProps: {
                    description: { tr: "Onay butonu. onClick tetikleyiciyle birleştirilir; hem href/to/url hem de tetikleyici verilirse tetikleyici önceliklidir.", en: "Confirm button. Its onClick is merged with the trigger; if both href/to/url and a trigger are set, the trigger takes precedence." },
                    type: "object",
                    defaultValue: '{ label: "Confirm", prefix: { icon: "check" } }',
                },
                cancelButtonProps: {
                    description: { tr: "İptal butonu. Tıklandığında paneli kapatır. Dışarı tıklanınca buradaki onClick/href/to/url propları tetiklenir.", en: "Cancel button. Closes the panel when clicked. On outside clicks, its onClick/href/to/url props are triggered." },
                    type: "object",
                    defaultValue: '{ label: "Cancel", prefix: { icon: "close" } }',
                },
                triggerDelayMs: {
                    description: { tr: "Onaydan sonra ertelenmiş action'lar çalışıp panel kapanmadan önce content butonunun click animasyonunu oynatacağı süre (ms).", en: "After confirmation, how long (ms) the content button plays its click animation before deferred actions run and the panel closes." },
                    type: "number",
                    defaultValue: String(DEFAULT_TRIGGER_DELAY_MS),
                },
                _rest: {
                    description: { tr: "Diğer tüm proplar PopOver'a aktarılır. Ayrıntılar için PopOver API'sine bakın.", en: "All other props are passed to PopOver. See the PopOver API for details." },
                    type: "object",
                },
            }}
        />
    </Ds.page>
);

export default X;

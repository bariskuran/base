import Ds from "../DesignSystem";
import { t } from "../getText";

const settingsExample = `// projectSettings (PROJECT_SETTINGS)
idleManagerSettings: {
    enabled: true,
    allowedIdleTime: 30, // minutes — default when omitted or invalid
    onIdle: ({ baseStore, nowTs, idleForMs, allowedIdleMinutes }) => {
        // e.g. dim UI, pause media, show screensaver
    },
    onActive: ({ baseStore, nowTs, reason }) => {
        // e.g. restore UI after user returns (reason: mousemove, keydown, …)
    },
},`;

const X = () => (
    <Ds.page
        title="IdleManager"
        releasedOn="1.0.0"
        description={
            <>
                {t({ tr: "Uygulama hazır olduğunda Base tarafından mount edilen yerleşik alt sistemdir. IdleManager'ı kendiniz import veya render etmezsiniz; routing ile birlikte çalışır ve isIdle değerini global veriye eşitler.", en: "Built-in subsystem mounted by Base when the app is ready. You do not import or render IdleManager yourself; it runs alongside routing and syncs isIdle into global data." })}
                <br />
                <br />
                {t({ tr: "Davranışı projectSettings.idleManagerSettings ile yapılandırın (globalData._idleManager içine birleştirilir). Varsayılan boşta kalma eşiği, ", en: "Configure behaviour through projectSettings.idleManagerSettings (merged into globalData._idleManager). The default idle threshold is " })}<strong>30 {t({ tr: "dakika", en: "minutes" })}</strong>{t({ tr: " kullanıcı etkinliği olmamasıdır.", en: " without user activity." })}
                <br />
                <br />
                {t({ tr: "Etkinlik, throttle uygulanmış mousemove, scroll, pointerdown, keydown ve visibilitychange ile sekme odağından algılanır. Ana özelleştirme yüzeyi onIdle ve onActive'tir; bunları uygulamaya özgü efektler (overlay, analitik, işi duraklatma vb.) için kullanın.", en: "Activity is detected from throttled mousemove, scroll, pointerdown, keydown, and tab focus through visibilitychange. The main customisation surface is onIdle and onActive; use them for app-specific effects such as overlays, analytics, or pausing work." })}
                <br />
                <br />
                {t({ tr: "Idle durumu global isIdle verisini de günceller ve uygulamanın her yerinden erişilebilir.", en: "Idle status also updates global isIdle data and can be accessed from anywhere in the app." })}
            </>
        }
    >
        <Ds.block
            title={{ tr: "Ayarlar", en: "Settings" }}
            description={{ tr: "Bu nesneyi uygulamanızdaki PROJECT_SETTINGS üzerinden Base'e aktarın. Callback'ler isteğe bağlıdır; verilmediklerinde yalnızca console logları ve global isIdle güncellemeleri çalışır.", en: "Pass this object from your app PROJECT_SETTINGS into Base. Callbacks are optional; when omitted, only console logs and global isIdle updates run." }}
            code={settingsExample}
        />
        <Ds.block
            title="onIdle / onActive"
            description={
                <>
                    <code>onIdle</code>{t({ tr: " son etkinlikten sonra boşta kalma sayacı dolduğunda bir kez çalışır. ", en: " runs once when the idle timer elapses after the last activity. " })}<code>onActive</code>{t({ tr: " kullanıcı boşta kaldıktan sonra yeniden etkileşime geçtiğinde çalışır (zaten active iken her etkinlikte çalışmaz). Efektiniz içinde global state okumak veya güncellemek için ikisi de ", en: " runs when the user interacts again after being idle (not on every activity while already active). Both receive " })}<code>baseStore</code>{t({ tr: " alır.", en: " when you need to read or update global state inside your effect." })}
                </>
            }
        />
        <Ds.api
            args="PROJECT_SETTINGS.idleManagerSettings: { enabled, allowedIdleTime, onIdle, onActive }"
            props={{
                enabled: {
                    description: { tr: "Idle takibini açar veya kapatır. false olduğunda sayaç durur ve isIdle false kalır.", en: "Turns idle tracking on or off. When false, the timer stops and isIdle remains false." },
                    type: "boolean",
                    defaultValue: "true",
                },
                allowedIdleTime: {
                    description: { tr: "onIdle çalışmadan önce etkinlik olmadan geçecek dakika. Geçersiz veya pozitif olmayan değerler 30'a döner.", en: "Minutes without activity before onIdle fires. Invalid or non-positive values fall back to 30." },
                    type: "number",
                    defaultValue: "30",
                },
                onIdle: {
                    description: { tr: "Idle eşiğine ulaşıldığında çağrılır. Argümanlar: { baseStore, nowTs, idleForMs, allowedIdleMinutes }.", en: "Called when the idle threshold is reached. Args: { baseStore, nowTs, idleForMs, allowedIdleMinutes }." },
                    type: "fn",
                },
                onActive: {
                    description: { tr: "Kullanıcı boşta kaldıktan sonra geri döndüğünde çağrılır. Argümanlar: { baseStore, nowTs, reason } (reason ör. mousemove, keydown, visibilitychange).", en: "Called when the user returns after being idle. Args: { baseStore, nowTs, reason } (reason e.g. mousemove, keydown, visibilitychange)." },
                    type: "fn",
                },
            }}
        />
    </Ds.page>
);

export default X;

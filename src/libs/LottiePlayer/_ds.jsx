import { useState } from "react";
import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { Space } from "../Space";
import { LottiePlayer } from ".";
import testAnimation from "./test.json";

const DemoFrame = ({ children, minHeight = 240 }) => (
    <Flex
        full
        minHeight={minHeight}
        xAlign="center"
        yAlign="center"
        style={{ overflow: "hidden", borderRadius: 12, background: "#111827" }}
    >
        {children}
    </Flex>
);

const DeveloperDemo = () => {
    const [progress, setProgress] = useState(0);

    return (
        <Flex.column gap={12} full>
            <DemoFrame>
                <LottiePlayer
                    mode="byDeveloper"
                    src={testAnimation}
                    w={180}
                    manualPerc={progress}
                />
            </DemoFrame>
            <input
                aria-label="Animation progress"
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(event) => setProgress(Number(event.target.value))}
            />
        </Flex.column>
    );
};

const UserDemo = () => (
    <DemoFrame>
        <LottiePlayer mode="byUser" src={testAnimation} w={180} h={180} />
    </DemoFrame>
);

const PlaybackPropsDemo = () => {
    const [autoplay, setAutoplay] = useState(true);
    const [loop, setLoop] = useState(false);
    const [hover, setHover] = useState(false);
    const [speed, setSpeed] = useState(1);

    return (
        <Flex.column gap={12} full>
            <DemoFrame>
                <LottiePlayer
                    mode="byUser"
                    src={testAnimation}
                    w={180}
                    h={180}
                    autoplay={autoplay}
                    loop={loop}
                    hover={hover}
                    speed={speed}
                />
            </DemoFrame>
            <Flex gap={8} wrap xAlign="center">
                <button type="button" aria-pressed={autoplay} onClick={() => setAutoplay((value) => !value)}>
                    Autoplay: {autoplay ? "on" : "off"}
                </button>
                <button
                    type="button"
                    aria-pressed={!!loop}
                    onClick={() => setLoop((value) => value === false ? true : value === true ? "boomerang" : false)}
                >
                    Loop: {loop === "boomerang" ? "boomerang" : loop ? "on" : "off"}
                </button>
                <button type="button" aria-pressed={hover} onClick={() => setHover((value) => !value)}>
                    Hover: {hover ? "on" : "off"}
                </button>
                <button type="button" onClick={() => setSpeed((value) => value === 1 ? 2 : 1)}>
                    Speed: {speed}×
                </button>
            </Flex>
        </Flex.column>
    );
};

const ViewportDemo = () => (
    <Flex.column gap={0} full>
        <Space size={80} />
        <DemoFrame>
            <LottiePlayer mode="byViewport" src={testAnimation} w={180} viewportRange={[25, 75]} />
        </DemoFrame>
        <Space size={100} />
    </Flex.column>
);

const ScrollDemo = () => (
    <Flex.column gap={0} full>
        <Space size={160} />
        <DemoFrame minHeight="100vh">
            <LottiePlayer mode="byScroll" src={testAnimation} w={180} scrollLength={1.5} />
        </DemoFrame>
        <Space size={160} />
    </Flex.column>
);

const X = () => (
    <Ds.page
        title="<LottiePlayer>"
        releasedOn="Beta"
        description={{
            tr: "lottie-web JSON animasyonlarını Base playback modlarıyla oynatır. src bir URL, import edilmiş JSON veya katman sırasını belirleyen JSON dizisi olabilir.",
            en: "Plays lottie-web JSON animations with Base playback modes. src may be a URL, imported JSON, or an ordered array of JSON animations.",
        }}
    >
        <Ds.block
            title={{ tr: "byDeveloper", en: "byDeveloper" }}
            description={{
                tr: "İlerlemeyi manualPerc ile 0–100 aralığında kontrol edin. isPaused oynatmayı duraklatır; isWorking bileşeni etkinleştirir.",
                en: "Control progress with manualPerc from 0 to 100. isPaused freezes playback; isWorking enables the player.",
            }}
            code={`import { LottiePlayer } from "${SYS.basePath}";

<LottiePlayer
    mode="byDeveloper"
    src={animationJson}
    manualPerc={progress}
    isWorking
    isPaused={isPaused}
/>`}
            example={<DeveloperDemo />}
        />
        <Ds.block
            title={{ tr: "byUser", en: "byUser" }}
            description={{
                tr: "Sağ alt köşede play/pause ve stop kontrolleri gösterir.",
                en: "Shows play/pause and stop controls in the lower-right corner.",
            }}
            code={`<LottiePlayer mode="byUser" src={animationJson} w={320} h={320} />`}
            example={<UserDemo />}
        />
        <Ds.block
            title={{ tr: "Oynatma prop'ları", en: "Playback props" }}
            description={{
                tr: "Autoplay, loop, hover ve speed ayarlarını değiştirerek davranışlarını deneyin. Hover açıkken player üzerine gelin; loop kapalıysa pointer çıkınca animasyon geri sarar.",
                en: "Change autoplay, loop, hover, and speed to try their behavior. With hover enabled, move the pointer over the player; when looping is off, the animation reverses as the pointer leaves.",
            }}
            code={`<LottiePlayer
    mode="byUser"
    src={animationJson}
    autoplay
    loop="boomerang"
    speed={1}
/>`}
            example={<PlaybackPropsDemo />}
        />
        <Ds.block
            title={{ tr: "byViewport", en: "byViewport" }}
            description={{
                tr: "Animasyonun kutusu viewport üzerindeki eşik bandına girince oynar, tamamen çıkınca duraklar. Her iki scroll yönünde de çalışır.",
                en: "Plays when the animation box enters the viewport threshold band and pauses after it leaves. Works in either scroll direction.",
            }}
            code={`<LottiePlayer
    mode="byViewport"
    src={animationJson}
    viewportRange={[25, 75]}
/>`}
            example={<ViewportDemo />}
        />
        <Ds.block
            title={{ tr: "byScroll", en: "byScroll" }}
            description={{
                tr: "Player bir viewport boyunca sticky kalır; scrollLength kaç viewport boyunca ilerleyeceğini belirler. Scroll başlangıç/bitiş konumları, player'ın sayfadaki konumundan hesaplanır.",
                en: "The player stays sticky for a viewport-length track. scrollLength sets how many viewport lengths it spans. Scroll start/end are derived from the player's page position.",
            }}
            code={`<LottiePlayer
    mode="byScroll"
    src={animationJson}
    w={420}
    scrollDirection="y"
    startAt={0}
    stopAt={100}
    scrollLength={1.5}
/>`}
            example={<ScrollDemo />}
        />
        <Ds.api
            args="<LottiePlayer />"
            props={{
                mode: {
                    description: { tr: "Playback modu.", en: "Playback mode." },
                    type: '"byDeveloper" | "byUser" | "byViewport" | "byScroll"',
                    defaultValue: '"byDeveloper"',
                },
                src: {
                    description: { tr: "JSON URL'i, import edilmiş Lottie JSON'u veya üst üste çizilecek JSON dizisi.", en: "JSON URL, imported Lottie JSON, or an ordered array of JSON animations to overlay." },
                    type: "string | object | Array<string | object>",
                    required: true,
                },
                w: {
                    description: { tr: "Animasyon alanının genişliği. width ve size alternatif prop'lardır.", en: "Animation box width. width and size are aliases." },
                    type: "string | number",
                    defaultValue: '"100%"',
                },
                h: {
                    description: { tr: "Animasyon alanının yüksekliği. height alternatiftir; auto olduğunda JSON oranı korunur.", en: "Animation box height. height is an alias; auto preserves the JSON aspect ratio." },
                    type: "string | number",
                    defaultValue: '"auto"',
                },
                fit: {
                    description: { tr: "Kompozisyonu kutuya sığdırma biçimi.", en: "How the composition fits its box." },
                    type: '"contain" | "cover"',
                    defaultValue: '"contain"',
                },
                align: {
                    description: { tr: "Sığdırma sırasında kompozisyonun yatay/dikey hizası.", en: "Horizontal/vertical alignment while fitting the composition." },
                    type: '"center" | "top" | "bottom" | "left" | "right"',
                    defaultValue: '"center"',
                },
                autoplay: {
                    description: { tr: "byUser modunda yükleme sonrası oynatır. byDeveloper modunda oynatma isPaused ve isWorking ile kontrol edilir.", en: "Autoplays after load in byUser mode. In byDeveloper mode, playback is controlled by isPaused and isWorking." },
                    type: "boolean",
                    defaultValue: "false",
                },
                isWorking: {
                    description: { tr: "byDeveloper modunda player'ın etkin olup olmadığını belirler.", en: "Enables or disables the player in byDeveloper mode." },
                    type: "boolean",
                    defaultValue: "true",
                },
                isPaused: {
                    description: { tr: "byDeveloper modunda oynatmayı duraklatır.", en: "Pauses playback in byDeveloper mode." },
                    type: "boolean",
                    defaultValue: "true",
                },
                manualPerc: {
                    description: { tr: "byDeveloper modunda animasyon ilerlemesi; 0–100 aralığında kare seçer.", en: "Animation progress in byDeveloper mode; seeks to a frame from 0 to 100." },
                    type: "number",
                },
                viewportRange: {
                    description: { tr: "byViewport modunda viewport'un aktif eşik bandı, yüzde olarak [başlangıç, bitiş].", en: "Active viewport band in byViewport mode, in percentages [start, end]." },
                    type: "[number, number]",
                    defaultValue: "[25, 75]",
                },
                scrollDirection: {
                    description: { tr: "byScroll/byViewport için dinlenecek eksen.", en: "Axis observed by byScroll/byViewport." },
                    type: '"x" | "y" | "left" | "top"',
                    defaultValue: '"y"',
                },
                startAt: {
                    description: { tr: "byScroll modunda kullanılacak ilk Lottie karesi.", en: "First Lottie frame used in byScroll mode." },
                    type: "number",
                    defaultValue: "JSON başlangıç karesi",
                },
                stopAt: {
                    description: { tr: "byScroll modunda kullanılacak son Lottie karesi.", en: "Last Lottie frame used in byScroll mode." },
                    type: "number",
                    defaultValue: "JSON son karesi",
                },
                scrollLength: {
                    description: { tr: "byScroll sticky alanının scroll uzunluğu, viewport katı olarak.", en: "Scroll length of the byScroll sticky track, in viewport lengths." },
                    type: "number",
                    defaultValue: "1",
                },
                loop: {
                    description: { tr: "Döngüyü kapatır, açar, tekrar sayısını belirler veya animasyonu ileri-geri oynatır.", en: "Disables/enables looping, sets a repeat count, or alternates playback forward and backward." },
                    type: 'boolean | number | "boomerang"',
                    defaultValue: "false",
                },
                speed: {
                    description: { tr: "Oynatma hızı çarpanı.", en: "Playback speed multiplier." },
                    type: "number",
                    defaultValue: "1",
                },
                hover: {
                    description: { tr: "Hover'da ileri, çıkışta ters yönde oynatır (byScroll/byViewport hariç).", en: "Plays forward on hover and reverses on leave (except byScroll/byViewport)." },
                    type: "boolean",
                    defaultValue: "false",
                },
                controls: {
                    description: { tr: "byUser kontrollerini gösterir.", en: "Shows controls in byUser mode." },
                    type: "boolean",
                    defaultValue: "true",
                },
                onReady: {
                    description: { tr: "Tüm overlay animasyonları yüklendiğinde instance dizisini verir.", en: "Receives the instance array when all overlay animations are loaded." },
                    type: "(instances) => void",
                },
                onComplete: {
                    description: { tr: "Bir animasyon tamamlandığında çağrılır.", en: "Called when an animation completes." },
                    type: "(instance) => void",
                },
                onError: {
                    description: { tr: "Bir animasyon yüklenemezse çağrılır.", en: "Called when an animation fails to load." },
                    type: "(error, source) => void",
                },
            }}
        />
    </Ds.page>
);

export default X;

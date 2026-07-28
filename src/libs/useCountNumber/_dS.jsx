import { useState } from "react";
import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { useCountNumber } from ".";

const FiniteDemo = () => {
    const [currentNumber, ref, { start, pause, stop, isRunning, isPaused, isCompleted }] =
        useCountNumber({
            endNumber: 1250,
            duration: 3,
            decimal: 0,
            enableLocale: true,
            startOnViewport: true,
            restartOnView: true,
        });

    return (
        <Flex.column gap={12} ref={ref} padding={20} bgColor="greys.shade10" minHeight={120}>
            <Typo.h3>{currentNumber}</Typo.h3>
            <Typo.span>
                {`running: ${isRunning} · paused: ${isPaused} · completed: ${isCompleted}`}
            </Typo.span>
            <Flex gap={8}>
                <Button label="Start" onClick={() => start()} />
                <Button label="Pause" onClick={() => pause()} />
                <Button label="Stop" onClick={() => stop()} />
            </Flex>
        </Flex.column>
    );
};

const DecimalDemo = () => {
    const [currentNumber, ref] = useCountNumber({
        startNumber: 0,
        endNumber: 2,
        duration: 2.5,
        decimal: 2,
        enableLocale: true,
        startOnViewport: true,
    });

    return (
        <Flex.column gap={8} ref={ref} padding={20} bgColor="greys.shade10">
            <Typo.h3>{currentNumber}</Typo.h3>
            <Typo.span>decimal: 2 → always fixed fraction digits (e.g. 2.00)</Typo.span>
        </Flex.column>
    );
};

const InfiniteDemo = () => {
    const [currentNumber, ref, { start, pause, stop, isRunning }] = useCountNumber({
        startNumber: 0,
        duration: 1,
        step: 1,
        startOnViewport: false,
        enableLocale: true,
    });
    const [mounted, setMounted] = useState(true);

    return (
        <Flex.column gap={12} padding={20} bgColor="greys.shade10">
            {mounted ? (
                <Flex.column gap={8} ref={ref}>
                    <Typo.h3>{currentNumber}</Typo.h3>
                    <Typo.span>{`infinite · running: ${isRunning}`}</Typo.span>
                </Flex.column>
            ) : null}
            <Flex gap={8}>
                <Button label="Start" onClick={() => start()} />
                <Button label="Pause" onClick={() => pause()} />
                <Button label="Stop" onClick={() => stop()} />
                <Button label={mounted ? "Unmount" : "Mount"} onClick={() => setMounted((v) => !v)} />
            </Flex>
        </Flex.column>
    );
};

const MultiDemo = () => {
    const [[centerMin, centerKm, airportMin, airportKm], ref] = useCountNumber({
        endNumber: [45, 12, 30, 28],
        startNumber: 0,
        duration: 2.5,
        enableLocale: true,
        startOnViewport: true,
        restartOnView: true,
    });

    return (
        <Flex.column gap={10} ref={ref} padding={20} bgColor="greys.shade10">
            <Typo.span>{`Center: ${centerMin} min · ${centerKm} km`}</Typo.span>
            <Typo.span>{`Airport: ${airportMin} min · ${airportKm} km`}</Typo.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="useCountNumber()"
        releasedOn="1.0.0"
        description={{
            tr: "Viewport’ta başlayan sayı sayacı. endNumber varsa süre sonunda durur; yoksa step ile sonsuz sayar. decimal > 0 iken sabit basamaklı string döner (2.00).",
            en: "Viewport-aware number counter. With endNumber it stops at the target; without it, it counts forever by step. When decimal > 0, returns a fixed-fraction string (e.g. 2.00).",
        }}
    >
        <Ds.block
            title={{ tr: "Sonlu sayaç (endNumber)", en: "Finite counter (endNumber)" }}
            description={{
                tr: "0 → 1250, 3 saniye. Viewport’a girince başlar; çıkınca reset, tekrar girince yeniden sayar (restartOnView).",
                en: "0 → 1250 over 3s. Starts on enter; resets on leave and replays on re-enter (restartOnView).",
            }}
            code={`import { useCountNumber } from "${SYS.basePath}";

const [currentNumber, ref, { start, pause, stop }] = useCountNumber({
    endNumber: 1250,
    duration: 3,
    enableLocale: true,
    startOnViewport: true,
    restartOnView: true,
});

return <div ref={ref}>{currentNumber}</div>;`}
            example={<FiniteDemo />}
        />

        <Space size={24} />

        <Ds.block
            title={{ tr: "Decimal pad", en: "Decimal pad" }}
            description={{
                tr: "decimal: 2 → 0.00 … 2.00 (string, basamak kaybı yok).",
                en: "decimal: 2 → 0.00 … 2.00 (string, no trailing digit loss).",
            }}
            code={`const [currentNumber, ref] = useCountNumber({
    endNumber: 2,
    duration: 2.5,
    decimal: 2,
});`}
            example={<DecimalDemo />}
        />

        <Space size={24} />

        <Ds.block
            title={{ tr: "Çoklu sayaç (endNumber[])", en: "Multi counter (endNumber[])" }}
            description={{
                tr: "Tek ref, senkron animasyon. currentNumber array döner; startNumber scalar veya paralel array olabilir.",
                en: "One shared ref, synced animation. currentNumber is an array; startNumber can be scalar or a parallel array.",
            }}
            code={`const [[centerMin, centerKm, airportMin, airportKm], ref] = useCountNumber({
    endNumber: [45, 12, 30, 28],
    duration: 2.5,
});

return (
    <div ref={ref}>
        Center: {centerMin} min / {centerKm} km
        Airport: {airportMin} min / {airportKm} km
    </div>
);`}
            example={<MultiDemo />}
        />

        <Space size={24} />

        <Ds.block
            title={{ tr: "Sonsuz sayaç", en: "Infinite counter" }}
            description={{
                tr: "endNumber yok; startNumber + step. duration = tick aralığı (sn). startOnViewport: false → manuel start.",
                en: "No endNumber; startNumber + step. duration = tick interval (seconds). startOnViewport: false → manual start.",
            }}
            code={`const [currentNumber, ref, { start, pause, stop }] = useCountNumber({
    startNumber: 0,
    step: 1,
    duration: 1,
    startOnViewport: false,
});`}
            example={<InfiniteDemo />}
        />

        <Ds.api
            disableLastBlock
            args="const [currentNumber, ref, { start, pause, stop, isRunning, isPaused, isCompleted }] = useCountNumber(options);"
            props={{
                endNumber: {
                    description:
                        "Hedef değer veya hedef listesi. Array ise currentNumber aynı uzunlukta array döner; tek ref ile senkron anime olur.",
                    type: "number | number[]",
                },
                startNumber: {
                    description:
                        "Başlangıç. Scalar ise tüm hedefler için ortak; array ise index eşleşmeli. endNumber yoksa zorunlu; varsa default 0.",
                    type: "number | number[]",
                },
                duration: {
                    description:
                        "Saniye. Sonlu modda toplam animasyon süresi; sonsuz modda her step arası süre.",
                    type: "number",
                    defaultValue: "3",
                },
                step: {
                    description:
                        "Artış adımı. Sonsuz modda default 1. Sonlu modda verilirse ara değerler step’e hizalanır.",
                    type: "number",
                },
                decimal: {
                    description:
                        "Ondalık basamak. > 0 ise currentNumber her zaman sabit basamaklı string (2.00).",
                    type: "number",
                    defaultValue: "0",
                },
                enableLocale: {
                    description: "baseStore diline göre toLocaleString formatı.",
                    type: "boolean",
                    defaultValue: "true",
                },
                startOnViewport: {
                    description: "true ise ref viewport’a girince idle → start.",
                    type: "boolean",
                    defaultValue: "true",
                },
                restartOnView: {
                    description:
                        "Yalnızca sonlu sayaç. true ise viewport’tan çıkınca stop/reset; tekrar girince (startOnViewport ile) yeniden sayar.",
                    type: "boolean",
                    defaultValue: "true",
                },
            }}
        />
    </Ds.page>
);

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../baseStore";
import { useDelayedFunction } from "../useDelayedFunction";
import { t } from "../getText";

const X = () => {
    const { count, set } = baseStore.useLocal({ count: 0 });
    const { run, cancel, runNow, isPending } = useDelayedFunction(
        () => {
            set((s) => {
                s.count += 1;
            });
        },
        { delay: 1500, autoCancel: true },
    );

    return (
        <Ds.page
            title="delayedFunction()"
            releasedOn="1.0.0"
            description={
                <>
                    {t({
                        tr: "Gecikmeli çalıştırılabilen fonksiyon sarmalayıcıları oluşturur.",
                        en: "Creates delayed executable function wrappers.",
                    })}
                    <br />
                    <br />
                    {t({ tr: "Hook kullanımını görmek için ", en: "See " })}
                    <Button.string
                        to="/design-system/useDelayedFunction"
                        label="useDelayedFunction"
                    />{" "}
                    {t({ tr: " sayfasına bakın.", en: " for hook usage." })}
                </>
            }
        >
            <Ds.block
                title={{ tr: "Temel Kullanım", en: "Basic Usage" }}
                code={`import { delayedFunction } from "${SYS.basePath}";

                       const delayed = delayedFunction(fn, { delay: 500 });
                       delayed.run();
                       delayed.cancel();
                       delayed.runNow();
                       delayed.isPending();`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Button.plain
                            label="Run delayed"
                            onClick={() => {
                                run();
                            }}
                            skipClickCooldown
                            skipOnClickHold
                        />
                        <Button.plain
                            label="Run now"
                            onClick={() => {
                                runNow();
                            }}
                            skipClickCooldown
                            skipOnClickHold
                        />
                        <Button.plain
                            label="Cancel"
                            onClick={() => {
                                cancel();
                            }}
                            skipClickCooldown
                            skipOnClickHold
                        />
                        <Flex gap={20} marginTop={20}>
                            <Typo.span children={`count: ${count}`} />
                            <Typo.span children={`isPending: ${String(isPending)}`} />
                        </Flex>
                    </Flex.column>
                }
            />
            <Ds.api
                disableLastBlock
                args="const { run, cancel, runNow, isPending } = delayedFunction(fn, { autoCancel, delay });"
                props={{
                    fn: {
                        description: { tr: "Geciktirilecek fonksiyon.", en: "Function to delay." },
                        type: "fn",
                        required: true,
                    },
                    delay: {
                        description: { tr: "Milisaniye cinsinden gecikme.", en: "Delay in milliseconds." },
                        type: "number",
                        defaultValue: "500",
                    },
                    autoCancel: {
                        description: { tr: "Yeni bir çalıştırma planlamadan önce bekleyen önceki çalıştırmayı iptal eder.", en: "Cancels the previous pending run before scheduling a new one." },
                        type: "boolean",
                        defaultValue: "true",
                    },
                }}
                returnProps={{
                    run: {
                        description: { tr: "Gecikmeli fonksiyonu çalıştırır.", en: "Runs the delayed function." },
                        type: "fn",
                    },
                    runNow: {
                        description: { tr: "Gecikmeli fonksiyonu hemen çalıştırır.", en: "Runs the delayed function immediately." },
                        type: "fn",
                    },
                    cancel: {
                        description: { tr: "Gecikmeli fonksiyonu iptal eder.", en: "Cancels the delayed function." },
                        type: "fn",
                    },
                    isPending: {
                        description: { tr: "Gecikmeli fonksiyon bekliyorsa true döndürür. Hook tarafında çalışır.", en: "Returns true when the delayed function is pending. Works on the hook side." },
                        type: "boolean",
                    },
                }}
            />
            <Ds.api
                disableLastBlock
                title="run"
                args="run(...args);"
                props={{
                    args: {
                        description: { tr: "Gecikmeden sonra fn fonksiyonuna iletilir.", en: "Forwarded to fn after the delay." },
                        type: "any[]",
                    },
                }}
            />
            <Ds.api
                title="runNow"
                args="runNow(...args);"
                props={{
                    args: {
                        description: { tr: "fn için isteğe bağlı argümanlar; verilmezse son run() argümanlarını kullanır.", en: "Optional arguments for fn; when omitted, uses the latest run() arguments." },
                        type: "any[]",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

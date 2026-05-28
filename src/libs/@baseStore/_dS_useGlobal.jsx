import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { baseStore } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { formatJsonForDisplay } from "../DesignSystem/formatJsonForDisplay";

const PATH_GLOBAL = "baseStore-global";

const X = () => {
    const globalData = baseStore.useGlobal((s) => s);
    const language = baseStore.useGlobal((s) => s.language);
    const isLoading = baseStore.useGlobal((s) => s.isLoading);
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    return (
        <Ds.page
            title="baseStore.globalData"
            releasedOn="1.0.0"
            description={
                <>
                    Global ve ortak uygulama verilerinin tutulduğu singleton store&apos;dur.
                    Sayfadaki tüm componentler kolayca erişebilir.
                    <br />
                    <br />
                    React içinde <Typo.code>useGlobal(selector)</Typo.code>, React dışında{" "}
                    <Typo.code>baseStore.globalData.get()</Typo.code> ve{" "}
                    <Typo.code>baseStore.globalData.set()</Typo.code> kullanılır.
                </>
            }
        >
            <Ds.block
                title="React Component içinde useGlobal"
                code={`import { baseStore } from "${SYS.basePath}";

                    const language = baseStore.useGlobal((s) => s.language);
                    const isLoading = baseStore.useGlobal((s) => s.isLoading);
                            
                    // selector vermezsen tüm globalData + set döner
                    const global = baseStore.useGlobal();`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Typo.span>
                            language: <Typo.code>{language ?? "—"}</Typo.code> · isLoading:{" "}
                            <Typo.code>{String(isLoading ?? false)}</Typo.code>
                        </Typo.span>
                        <Flex wrap gap={10}>
                            <Button.plain
                                label='set language = "tr"'
                                onClick={() =>
                                    baseStore.globalData.set((s) => {
                                        s.language = "tr";
                                    })
                                }
                            />
                            <Button.plain
                                label='set language = "en"'
                                onClick={() =>
                                    baseStore.globalData.set((s) => {
                                        s.language = "en";
                                    })
                                }
                            />
                            <Button.plain
                                label="toggle isLoading"
                                onClick={() =>
                                    baseStore.globalData.set((s) => {
                                        s.isLoading = !s.isLoading;
                                    })
                                }
                            />
                        </Flex>
                    </Flex.column>
                }
            />
            <Ds.block
                title="İzole Fonksiyon (Non-React)"
                code={`import { baseStore } from "${SYS.basePath}";

const getCurrentLanguage = () => baseStore.globalData.get().language;

const setLanguage = (language) => {
    baseStore.globalData.set((s) => {
        s.language = language;
    });
};`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex wrap gap={10}>
                            <Button.plain
                                label="globalData.get()"
                                {...outputButtonProps({
                                    path: PATH_GLOBAL,
                                    activeLabel: "get",
                                    fn: () => baseStore.globalData.get(),
                                })}
                            />
                            <Button.plain
                                label='setLanguage("de")'
                                {...outputButtonProps({
                                    path: PATH_GLOBAL,
                                    activeLabel: "setLanguage",
                                    fn: () => {
                                        const setLanguage = (nextLanguage) => {
                                            baseStore.globalData.set((s) => {
                                                s.language = nextLanguage;
                                            });
                                            return baseStore.globalData.get();
                                        };
                                        return setLanguage("de");
                                    },
                                })}
                            />
                        </Flex>
                        <Output path={PATH_GLOBAL} />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Anlık globalData"
                description="GlobalDataProvider ve uygulama akışı tarafından güncellenen mevcut globalData snapshot."
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Typo.code codeFormat={false}>{formatJsonForDisplay(globalData ?? {})}</Typo.code>
                    </Flex.column>
                }
            />
            <Ds.api
                title="useGlobal"
                disableLastBlock
                args="const selected = baseStore.useGlobal(selector?);"
                props={{
                    selector: {
                        description:
                            "Opsiyonel selector. Verilen alt state'e subscribe olur. Verilmezse tüm state döner.",
                        type: "function",
                    },
                }}
                returnProps={{
                    selected: {
                        description: "Seçilen globalData alanı (veya tüm state).",
                        type: "any",
                    },
                }}
            />
            <Ds.api
                title="globalData.get / globalData.set"
                args={[
                    "const snapshot = baseStore.globalData.get();",
                    "const next = baseStore.globalData.set(updaterOrObject);",
                ]}
                props={{
                    updaterOrObject: {
                        description:
                            "set; updater fn, partial object veya doğrudan value kabul eder.",
                        type: "function | object | any",
                    },
                }}
                returnProps={{
                    snapshot: {
                        description: "Anlık globalData state.",
                        type: "object",
                    },
                    next: {
                        description: "Güncellenmiş globalData state.",
                        type: "object",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { copyToClipboard } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Space } from "../Space";
import { baseStore } from "../baseStore";

const X = () => {
    const { lastBasic, set } = baseStore.useLocal({ lastBasic: null });

    return (
        <Ds.page
            title="copyToClipboard()"
            releasedOn="1.0.0"
            description={
                <>
                    Copies text/ReactNode content to clipboard.
                    <br />
                    <br /> Check out <Button.string
                        to="/design-system/notifier"
                        label="Notifier"
                    />{" "}
                    to see notifier props.
                </>
            }
        >
            <Ds.block
                title={{ tr: "Temel Kullanım", en: "Basic usage" }}
                code={`import { copyToClipboard } from "${SYS.basePath}";

                       copyToClipboard("Hello world");`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Button.plain
                            label="Copy text"
                            onClick={() => {
                                const ok = copyToClipboard("Hello world");
                                set((s) => {
                                    s.lastBasic = ok ? "success" : "failed";
                                });
                            }}
                        />
                        <Space size="s" />
                        {lastBasic != null && (
                            <Typo.span balance>Last result: {lastBasic}</Typo.span>
                        )}
                    </Flex.column>
                }
            />
            <Ds.block
                title={{ tr: "Seçenekler", en: "Options" }}
                description={{ tr: "copyToClipboard davranışını özelleştiren seçenekler. Notifier'ı devre dışı bırakabilir, özel başarı ve hata callback'leri verebilirsiniz.", en: "Options to customize the copyToClipboard behavior. You can disable the notifier, and provide custom success and error callbacks." }}
                code={`import { copyToClipboard } from "${SYS.basePath}";

                       copyToClipboard("Hello world",
                        {
                            disableNotifier: true,
                            onSuccess: ()=> console.log("success"),
                            onError: (err)=> console.error("error", err)
                        });`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Button.plain
                            label="Copy text"
                            onClick={() => {
                                copyToClipboard("Hello world", {
                                    disableNotifier: true,
                                    onSuccess: () => console.log("success"),
                                    onError: (err) => console.error("error", err),
                                });
                            }}
                        />
                    </Flex.column>
                }
            />
            <Ds.block
                title={{ tr: "Desteklenen Formatlar", en: "Supported Formats" }}
                description={{ tr: "copyToClipboard şu formatları kopyalayabilir: string, number, boolean, object, array, function, date, regex, symbol, error, null, undefined.", en: "copyToClipboard can copy the following formats: string, number, boolean, object, array, function, date, regex, symbol, error, null, undefined." }}
                code={`import { copyToClipboard } from "${SYS.basePath}";

                       copyToClipboard({ a: 1, b: 2, c: 3, d: { e: 4 } });
                       copyToClipboard([1, 2, 3, 4]);
                       copyToClipboard(new Date());
                       copyToClipboard(new Error("test"));
                       copyToClipboard(null);
                       copyToClipboard(undefined);
                       copyToClipboard(Symbol("test"));
                       copyToClipboard(function() {});
`}
                example={
                    <Flex gap={10} padding={10} wrap>
                        <Button.plain
                            label="Obj"
                            onClick={() => {
                                copyToClipboard({ a: 1, b: 2, c: 3, d: { e: 4 } });
                            }}
                        />
                        <Button.plain
                            label="Arr"
                            onClick={() => {
                                copyToClipboard([1, 2, 3, 4]);
                            }}
                        />
                        <Button.plain
                            label="Date"
                            onClick={() => {
                                copyToClipboard(new Date());
                            }}
                        />
                        <Button.plain
                            label="Err"
                            onClick={() => {
                                copyToClipboard(new Error("test"));
                            }}
                        />
                        <Button.plain
                            label="Null"
                            onClick={() => {
                                copyToClipboard(null);
                            }}
                        />
                        <Button.plain
                            label="Undefined"
                            onClick={() => {
                                copyToClipboard(undefined);
                            }}
                        />
                        <Button.plain
                            label="Sym"
                            onClick={() => {
                                copyToClipboard(Symbol("test"));
                            }}
                        />
                        <Button.plain
                            label="Fn"
                            onClick={() => {
                                copyToClipboard(function () {});
                            }}
                        />
                    </Flex>
                }
            />
            <Ds.api
                disableLastBlock
                args="const copied = await copyToClipboard(value, { disableNotifier, errorMessage, onError, onSuccess, successMessage });"
                props={{
                    value: {
                        description: { tr: "Kopyalanacak değer.", en: "Value to copy." },
                        type: "any",
                        required: true,
                    },
                    onSuccess: {
                        description: { tr: "Başarılı olduğunda kopyalanan metinle çağrılır.", en: "Called on success with copied text." },
                        type: "fn",
                    },
                    onError: {
                        description: { tr: "Başarısız olduğunda hata ile çağrılır.", en: "Called on failure with error." },
                        type: "fn",
                    },
                    successMessage: {
                        description: { tr: "Notifier başarı mesajı.", en: "Notifier success message." },
                        type: "string",
                        defaultValue: '"Copied to clipboard."',
                    },
                    errorMessage: {
                        description: { tr: "Notifier hata mesajı.", en: "Notifier error message." },
                        type: "string",
                        defaultValue: '"Failed to copy text."',
                    },
                    disableNotifier: {
                        description: { tr: "Notifier'ı devre dışı bırakır.", en: "Disable notifier." },
                        type: "boolean",
                        defaultValue: false,
                    },
                    notifierProps: {
                        description:
                            "Props to pass to the notifier. Check the notifier documentation for available props.",
                        type: "object",
                    },
                }}
                returnProps={{
                    copied: {
                        description: { tr: "Değer başarıyla kopyalandığında true olur.", en: "True when the value was copied successfully." },
                        type: "boolean",
                    },
                }}
            />
            <Ds.api
                disableLastBlock
                title={{ tr: "onSuccess", en: "onSuccess" }}
                args="onSuccess(text);"
                props={{
                    text: {
                        description: { tr: "Kopyalanan string değeri.", en: "Copied string value." },
                        type: "string",
                    },
                }}
            />
            <Ds.api
                title={{ tr: "onError", en: "onError" }}
                args="onError(err);"
                props={{
                    err: {
                        description: { tr: "Yakalanan hata.", en: "Caught error." },
                        type: "Error",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

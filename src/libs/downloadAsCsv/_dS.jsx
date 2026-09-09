import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { downloadAsCsv } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Space } from "../Space";
import { baseStore } from "../baseStore";

const sample = [
    ["id", "name", "score"],
    [1, "Ada", 95],
    [2, "Linus", 88],
];

const X = () => {
    const { lastBasic, lastOpts, set } = baseStore.useLocal({
        lastBasic: null,
        lastOpts: null,
    });

    return (
        <Ds.page
            title="downloadAsCsv()"
            releasedOn="1.0.0"
            description={{ tr: "Tablo verisini CSV olarak indirir.", en: "Downloads table data as CSV." }}
        >
            <Ds.block
                title={{ tr: "Veri Yapısı", en: "Data structure" }}
                description={{ tr: "data parametresi satır ve sütunlardan oluşan iki boyutlu bir dizi olmalıdır. Örnek için kod bölümüne bakın.", en: "The data parameter must be a 2D array of rows and columns. Check out code section for an example" }}
                code={`const data = [
                            ["id", "name", "score"],
                            [1, "Ada", 95],
                            [2, "Linus", 88],
                        ];`}
            />
            <Ds.block
                title={{ tr: "Temel Kullanım", en: "Basic usage" }}
                code={`import { downloadAsCsv } from "${SYS.basePath}";

                       downloadAsCsv(data, "users");`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Button.plain
                            label="Download CSV"
                            onClick={() => {
                                const ok = downloadAsCsv(sample, "scores");
                                set((s) => {
                                    s.lastBasic = ok ? "download triggered" : "failed";
                                });
                            }}
                        />
                        {lastBasic != null && <Typo.span balance>Last: {lastBasic}</Typo.span>}
                    </Flex.column>
                }
            />
            <Ds.block
                title={{ tr: "Seçeneklerle Kullanım", en: "With options" }}
                code={`import { downloadAsCsv } from "${SYS.basePath}";

                        downloadAsCsv(data, "users", {
                          separator: ";",
                          includeBom: true,
                          preventExcelInjection: true,
                          onSuccess: () => {},
                          onError: (e) => {},
                        });`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Button
                            label="Download ; separated"
                            onClick={() => {
                                const ok = downloadAsCsv(sample, "scores-sc", { separator: ";" });
                                set((s) => {
                                    s.lastOpts = ok ? "download (;)" : "failed";
                                });
                            }}
                        />
                        <Space size="s" />
                        {lastOpts != null && <Typo.span balance>Last: {lastOpts}</Typo.span>}
                    </Flex.column>
                }
            />
            <Ds.api
                disableLastBlock
                args="const ok = downloadAsCsv(data, fileName, { includeBom, onError, onSuccess, preventExcelInjection, separator });"
                props={{
                    data: {
                        description: { tr: "Satır/sütunlardan oluşan iki boyutlu dizi.", en: "2D array rows/columns." },
                        type: "any[][]",
                        required: true,
                    },
                    fileName: {
                        description: { tr: "Çıktı dosyası adı (uzantısız).", en: "Output file name (without extension)." },
                        type: "string",
                        defaultValue: '"data"',
                    },
                    onSuccess: {
                        description: { tr: "İndirme başarılı olduğunda çağrılır.", en: "Called when the download is successful." },
                        type: "fn",
                    },
                    onError: {
                        description: { tr: "İndirme başarısız olduğunda çağrılır.", en: "Called when the download fails." },
                        type: "fn",
                    },
                    separator: {
                        description: { tr: "CSV ayıracı.", en: "CSV separator." },
                        type: "string",
                        defaultValue: ",",
                    },
                    includeBom: {
                        description: { tr: "Excel uyumluluğu için UTF-8 BOM ekler.", en: "Adds UTF-8 BOM for Excel compatibility." },
                        type: "boolean",
                        defaultValue: true,
                    },
                    preventExcelInjection: {
                        description: { tr: "Excel injection'ı önler.", en: "Prevents Excel injection." },
                        type: "boolean",
                        defaultValue: true,
                    },
                }}
                returnProps={{
                    ok: {
                        description: { tr: "CSV indirmesi başarıyla tetiklendiğinde true olur.", en: "True when the CSV download was triggered successfully." },
                        type: "boolean",
                    },
                }}
            />
            <Ds.api
                title={{ tr: "onError", en: "onError" }}
                args="onError(error);"
                props={{
                    error: {
                        description: { tr: "Yakalanan hata.", en: "Caught error." },
                        type: "Error",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

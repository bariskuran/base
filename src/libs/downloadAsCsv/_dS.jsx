import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { downloadAsCsv } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

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
            description="Downloads table data as CSV."
        >
            <Ds.block
                title="Data structure"
                description="The data parameter must be a 2D array of rows and columns. Check out code section for an example"
                code={`const data = [
                            ["id", "name", "score"],
                            [1, "Ada", 95],
                            [2, "Linus", 88],
                        ];`}
            />
            <Ds.block
                title="Basic usage"
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
                title="With options"
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
                args="const ok = downloadAsCsv(data, fileName, { includeBom, onError, onSuccess, preventExcelInjection, separator });"
                props={{
                    data: {
                        description: "2D array rows/columns.",
                        type: "any[][]",
                        required: true,
                    },
                    fileName: {
                        description: "Output file name (without extension).",
                        type: "string",
                        defaultValue: '"data"',
                    },
                    onSuccess: {
                        description: "Called when the download is successful.",
                        type: "function",
                    },
                    onError: {
                        description: "Called when the download fails.",
                        type: "function",
                    },
                    separator: {
                        description: "CSV separator.",
                        type: "string",
                        defaultValue: ",",
                    },
                    includeBom: {
                        description: "Adds UTF-8 BOM for Excel compatibility.",
                        type: "boolean",
                        defaultValue: true,
                    },
                    preventExcelInjection: {
                        description: "Prevents Excel injection.",
                        type: "boolean",
                        defaultValue: true,
                    },
                }}
                returnProps={{
                    ok: {
                        description: "True when the CSV download was triggered successfully.",
                        type: "boolean",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

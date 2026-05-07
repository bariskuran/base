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
    const { lastBasic, lastOpts, setLocal } = baseStore.useLocal({ lastBasic: null, lastOpts: null });

    return (
        <Ds.page title="downloadAsCsv()" releasedOn="1.0.0" description="Downloads table data as CSV.">
            <Ds.block
                title="Basic usage"
                code={`import { downloadAsCsv } from "${SYS.basePath}";

downloadAsCsv(
  [["id", "name"], [1, "Ada"]],
  "users"
);`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button
                            label="Download CSV"
                            onClick={() => {
                                const ok = downloadAsCsv(sample, "scores");
                                setLocal((s) => {
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
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button
                            label="Download ; separated"
                            onClick={() => {
                                const ok = downloadAsCsv(sample, "scores-sc", { separator: ";" });
                                setLocal((s) => {
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
                args="downloadAsCsv(data, fileName, options);"
                returns="Boolean indicating whether the download was triggered successfully."
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
                    options: {
                        description:
                            "{ onSuccess, onError, separator, includeBom, preventExcelInjection }",
                        type: "object",
                        defaultValue:
                            '{ separator: ",", includeBom: true, preventExcelInjection: true }',
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

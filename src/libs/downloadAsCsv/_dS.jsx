import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { downloadAsCsv } from ".";
import { Button } from "../Button";

const sample = [
    ["id", "name", "score"],
    [1, "Ada", 95],
    [2, "Linus", 88],
];

const X = () => (
    <Ds.page title="<downloadAsCsv>" releasedOn="1.0.0" description="Downloads table data as CSV.">
        <Ds.block
            title="Basic Usage"
            code={`import { downloadAsCsv } from "${SYS.basePath}";

downloadAsCsv(
  [["id", "name"], [1, "Ada"]],
  "users"
);`}
            example={<Button label="Download CSV" onClick={() => downloadAsCsv(sample, "scores")} />}
        />
        <Ds.block
            title="With Options"
            code={`downloadAsCsv(data, "users", {
  separator: ";",
  includeBom: true,
  preventExcelInjection: true,
  onSuccess: () => {},
  onError: (e) => {},
});`}
            example={
                <Button
                    label="Download ; separated"
                    onClick={() => downloadAsCsv(sample, "scores-sc", { separator: ";" })}
                />
            }
        />
        <Ds.api
            props={{
                data: {
                    description: "2D array rows/columns.",
                    type: "any[][]",
                    required: true,
                    defaultValue: "undefined",
                },
                fileName: {
                    description: "Output file name (without extension).",
                    type: "string",
                    required: false,
                    defaultValue: '"data"',
                },
                options: {
                    description:
                        "{ onSuccess, onError, separator, includeBom, preventExcelInjection }",
                    type: "object",
                    required: false,
                    defaultValue:
                        '{ separator: ",", includeBom: true, preventExcelInjection: true }',
                },
                return: {
                    description: "Boolean success state.",
                    type: "boolean",
                    required: true,
                    defaultValue: "computed",
                },
            }}
        />
    </Ds.page>
);

export default X;

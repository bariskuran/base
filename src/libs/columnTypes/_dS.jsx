import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { COLUMN_SIZES, columnTypes } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";

const X = () => {
    const typeNames = Object.keys(columnTypes || {});

    return (
        <Ds.page
            title="columnTypes"
            releasedOn="1.0.0"
            description={`columnTypes is a helper configuration object for Table cell behaviors.

Use it with <Table /> (Beta) to define column width, alignment, sorting, and render presets.`}
        >
            <Ds.block
                title="Purpose"
                code={`import { columnTypes, COLUMN_SIZES } from "${SYS.basePath}";

                       // planned usage (when Table is ready)
                       const columns = [
                       { key: "id", type: columnTypes.id },
                       { key: "name", type: columnTypes.name },
                       { key: "amount", type: columnTypes.money, width: COLUMN_SIZES.m },
                       ];`}
                example={
                    <Flex.column gap={10}>
                        <Typo.p>
                            Reusable cell-level behavior metadata: default width, align, sorter, and
                            optional render/renderData handlers. See{" "}
                            <Button.string to="/design-system/table" label="Table" /> (Beta).
                        </Typo.p>
                        <Typo.code>{JSON.stringify(typeNames, null, 2)}</Typo.code>
                    </Flex.column>
                }
            />

            <Ds.block
                title="Current shape summary"
                example={
                    <Typo.code>{`{
  columnTypes: {
    [typeName]: {
      typeName: string,
      width?: number | "auto",
      align?: "left" | "center" | "right",
      sorter?: false | ((a, b) => number),
      render?: (value) => ReactNode,
      renderData?: (value) => string
    }
  },
  COLUMN_SIZES: {
    auto | xxs | xs | s | m | l | xl | xxl
  }
}`}</Typo.code>
                }
            />

            <Ds.api
                args='import { columnTypes, COLUMN_SIZES } from "@bariskuran/base";'
                props={{
                    COLUMN_SIZES: {
                        description: "Shared width size map for column presets.",
                        type: "object",
                    },
                    columnTypes: {
                        description: "Type-based column preset map used by future Table implementation.",
                        type: "object",
                        required: true,
                    },
                }}
                returnProps={{
                    columnTypes: {
                        description: "Dictionary of column behavior presets for Table.",
                        type: "object",
                    },
                    COLUMN_SIZES: {
                        description: "Named width tokens for column presets.",
                        type: "object",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

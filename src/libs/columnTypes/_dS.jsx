import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { COLUMN_SIZES, columnTypes } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";

const X = () => {
    const typeNames = Object.keys(columnTypes || {});

    return (
        <Ds.page
            title="columnTypes"
            releasedOn="1.0.0"
            description={`columnTypes is a helper configuration object prepared for future Table cell behaviors.

At this stage, Table is not implemented yet, so this is currently a supporting content only for the upcoming Table module. When Table is ready, this dS page will be updated with real integration examples.`}
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
                            This object stores reusable cell-level behavior metadata such as default width,
                            align, sorter, and optional render/renderData handlers.
                        </Typo.p>
                        <Typo.p>
                            It exists so we do not forget the intent before Table implementation is complete.
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
                args="columnTypes"
                returns="Dictionary object for planned Table column behavior presets."
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
            />
        </Ds.page>
    );
};

export default X;

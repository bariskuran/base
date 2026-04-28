import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorPickHigherContrast } from ".";
import { Typography } from "../Typography";

const sample = colorPickHigherContrast("#ffffff", "#111111", "#3b82f6");

const X = () => (
    <Ds.page
        title="<colorPickHigherContrast>"
        releasedOn="1.0.0"
        description="Picks the better contrast candidate color."
    >
        <Ds.block
            title="Basic Usage"
            code={`import { colorPickHigherContrast } from "${SYS.basePath}";

const { winner, ratioA, ratioB } = colorPickHigherContrast(
  "#ffffff",
  "#111111",
  "#3b82f6"
);`}
            example={<Typography.span children={JSON.stringify(sample)} />}
        />
        <Ds.api
            props={{
                optionA: {
                    description: "First candidate color.",
                    type: "string | object | null",
                    required: false,
                    defaultValue: "theme.foreground",
                },
                optionB: {
                    description: "Second candidate color.",
                    type: "string | object | null",
                    required: false,
                    defaultValue: "theme.background",
                },
                background: {
                    description: "Background color.",
                    type: "string | object",
                    required: true,
                    defaultValue: "undefined",
                },
                return: {
                    description: "{ winner, ratioA, ratioB }",
                    type: "object",
                    required: true,
                    defaultValue: "computed",
                },
            }}
        />
    </Ds.page>
);

export default X;

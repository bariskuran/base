import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorContrastRatio } from ".";
import { Typography } from "../Typography";

const ratio1 = colorContrastRatio("#ffffff", "#111111");
const ratio2 = colorContrastRatio("#ffbf00", "#ffffff");

const X = () => (
    <Ds.page
        title="<colorContrastRatio>"
        releasedOn="1.0.0"
        description="Returns WCAG contrast ratio between two colors."
    >
        <Ds.block
            title="Basic Usage"
            code={`import { colorContrastRatio } from "${SYS.basePath}";

const ratio = colorContrastRatio("#ffffff", "#111111");`}
            example={
                <Typography.span children={`#fff vs #111 => ${ratio1} | #ffbf00 vs #fff => ${ratio2}`} />
            }
        />
        <Ds.api
            props={{
                colorA: {
                    description: "First color.",
                    type: "string | object",
                    required: true,
                    defaultValue: "undefined",
                },
                colorB: {
                    description: "Second color.",
                    type: "string | object",
                    required: true,
                    defaultValue: "undefined",
                },
                return: {
                    description: "WCAG contrast ratio.",
                    type: "number",
                    required: true,
                    defaultValue: "0",
                },
            }}
        />
    </Ds.page>
);

export default X;

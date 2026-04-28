import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorContrast } from ".";
import { Typography } from "../Typography";

const result = colorContrast("#ffffff", "#0077ff", 4.5);

const X = () => (
    <Ds.page
        title="<colorContrast>"
        releasedOn="1.0.0"
        description="Finds a tone variant that meets target contrast."
    >
        <Ds.block
            title="Basic Usage"
            code={`import { colorContrast } from "${SYS.basePath}";

const result = colorContrast("#ffffff", "#0077ff", 4.5);`}
            example={<Typography.span children={JSON.stringify(result)} />}
        />
        <Ds.block
            title="With Options"
            code={`colorContrast("#111111", "#00aaff", 7, { tolerance: 0.1, step: 2 });`}
            example={
                <Typography.span
                    children={JSON.stringify(
                        colorContrast("#111111", "#00aaff", 7, { tolerance: 0.1, step: 2 }),
                    )}
                />
            }
        />
        <Ds.api
            props={{
                background: {
                    description: "Background color.",
                    type: "string",
                    required: true,
                    defaultValue: "undefined",
                },
                expectedTone: {
                    description: "Base tone whose hue/saturation are preserved.",
                    type: "string",
                    required: true,
                    defaultValue: "undefined",
                },
                expectedRatio: {
                    description: "Target contrast ratio.",
                    type: "number",
                    required: true,
                    defaultValue: "undefined",
                },
                opts: {
                    description: "Search options: tolerance, step.",
                    type: "object",
                    required: false,
                    defaultValue: "{ tolerance: 0.05, step: 1 }",
                },
                return: {
                    description: "{ color, colorFormats, finalRatio, lightness }",
                    type: "object",
                    required: true,
                    defaultValue: "computed",
                },
            }}
        />
    </Ds.page>
);

export default X;

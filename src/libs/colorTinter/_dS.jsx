import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorTinter } from ".";
import { Flex } from "../Flex";
import { Typography } from "../Typography";

const b = "#4f46e5";
const t20 = colorTinter(b, 20);
const t50 = colorTinter(b, 50);

const X = () => (
    <Ds.page title="<colorTinter>" releasedOn="1.0.0" description="Tints color toward white.">
        <Ds.block
            title="Basic Usage"
            code={`import { colorTinter } from "${SYS.basePath}";

const tint20 = colorTinter("#4f46e5", 20);
const tint50 = colorTinter("#4f46e5", 50);`}
            example={
                <Flex xAlign="start" gap={12}>
                    <div style={{ width: 70, height: 24, background: b }} />
                    <div style={{ width: 70, height: 24, background: t20 }} />
                    <div style={{ width: 70, height: 24, background: t50 }} />
                </Flex>
            }
        />
        <Ds.api
            props={{
                hex: {
                    description: "Input color.",
                    type: "string",
                    required: false,
                    defaultValue: '"#f00"',
                },
                percent: {
                    description: "Tint amount (0..100).",
                    type: "number",
                    required: false,
                    defaultValue: "0",
                },
                return: {
                    description: "Hex color string.",
                    type: "string",
                    required: true,
                    defaultValue: "computed",
                },
            }}
        />
        <Typography.span children={`base: ${b} / tint20: ${t20} / tint50: ${t50}`} />
    </Ds.page>
);

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorShader } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";

const b = "#4f46e5";
const s20 = colorShader(b, 20);
const s50 = colorShader(b, 50);

const X = () => (
    <Ds.page
        title="<colorShader>"
        releasedOn="1.0.0"
        description="Darkens color or increases alpha."
    >
        <Ds.block
            title="Basic Usage"
            code={`import { colorShader } from "${SYS.basePath}";

const dark20 = colorShader("#4f46e5", 20);
const dark50 = colorShader("#4f46e5", 50);`}
            example={
                <Flex xAlign="start" gap={12}>
                    <div style={{ width: 70, height: 24, background: b }} />
                    <div style={{ width: 70, height: 24, background: s20 }} />
                    <div style={{ width: 70, height: 24, background: s50 }} />
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
                    description: "Darken amount (0..100).",
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
        <Typo.span children={`base: ${b} / shade20: ${s20} / shade50: ${s50}`} />
    </Ds.page>
);

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorAlpha } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";

const c20 = colorAlpha("#0077ff", 20);
const c80 = colorAlpha("#0077ff", 80);

const Swatch = ({ color, label }) => (
    <Flex.column xAlign="start" gap={4}>
        <div style={{ width: 60, height: 24, borderRadius: 6, background: color }} />
        <Typo.span children={`${label}: ${color}`} />
    </Flex.column>
);

const X = () => (
    <Ds.page title="<colorAlpha>" releasedOn="1.0.0" description="Applies alpha to a color.">
        <Ds.block
            title="Basic Usage"
            code={`import { colorAlpha } from "${SYS.basePath}";

const hex8 = colorAlpha("#0077ff", 35); // alpha as percent
const hex8b = colorAlpha("#0077ff", 0.35); // alpha as 0..1`}
            example={
                <Flex xAlign="start" gap={20}>
                    <Swatch color={c20} label="20%" />
                    <Swatch color={c80} label="80%" />
                </Flex>
            }
        />
        <Ds.api
            props={{
                color: {
                    description: "Base color input.",
                    type: "string | object",
                    required: true,
                    defaultValue: "undefined",
                },
                alpha: {
                    description: "Opacity ratio (0..1) or percent (0..100).",
                    type: "number",
                    required: false,
                    defaultValue: "50",
                },
                return: {
                    description: "Hex8 color string.",
                    type: "string",
                    required: true,
                    defaultValue: "computed",
                },
            }}
        />
    </Ds.page>
);

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorAlpha } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Space } from "../Space";
import { colorGet } from "../colorGet";

const Swatch = ({ source, alpha }) => {
    const color = colorAlpha(source, alpha);
    const sourceColor = colorGet(source).color;

    return (
        <Flex.column>
            <Typo.span children={`source: ${source}`} />
            <Typo.span children={`alpha: ${alpha}`} />
            <Typo.span children={`result: ${color}`} />
            <Flex gap={4} marginTop={20}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: sourceColor }} />
                <div style={{ width: 24, height: 24, borderRadius: 6, background: color }} />
            </Flex>
        </Flex.column>
    );
};

const X = () => {
    return (
        <Ds.page
            title="colorAlpha()"
            releasedOn="1.0.0"
            description="Applies alpha to a color. This function can also be found under the theme or imported from base."
        >
            <Ds.block
                title="Basic usage"
                description="Accepts any kind of color string. hex, hexa, rgb, rgba, theme, theme.path. string etc."
                code={`import { colorAlpha } from "${SYS.basePath}";

                        colorAlpha("#07f", 35);
                        colorAlpha("#0077ff", 0.35);
                        colorAlpha("red", 0.35);
                        colorAlpha("primary", 50);
                        colorAlpha(theme.primary, 0.5);

                        // or inside styled-component =>
                        
                        \`\${({ theme }) => css\`
                            color: \${theme.colorAlpha(theme.primary, 35)};
                        \`}\``}
                example={
                    <Flex.column xAlign="start" gap={16} padding={10}>
                        <Flex xAlign="start" gap={20}>
                            <Swatch source="#07f" alpha={0.2} />
                            <Swatch source="#0077ff" alpha={60} />
                            <Swatch source="red" alpha={50} />
                            <Swatch source="primary" alpha={50} />
                            <Swatch source="#0077ff99" alpha={50} />
                        </Flex>
                        <Space size="l" />
                    </Flex.column>
                }
            />
            <Ds.api
                args="colorAlpha(color, alpha);"
                props={{
                    color: {
                        description: "Base color input.",
                        type: "string | object",
                        required: true,
                    },
                    alpha: {
                        description: "Opacity ratio (0..1) or percent (1..100).",
                        type: "number",
                        defaultValue: "50",
                    },
                }}
                returns="Hex8 color string."
            />
        </Ds.page>
    );
};

export default X;

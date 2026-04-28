import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorGet } from ".";
import { Flex } from "../Flex";
import { Typography } from "../Typography";

const c1 = colorGet("primary");
const c2 = colorGet("foregrounds.tint50");

const Swatch = ({ label, color, opposite }) => (
    <Flex.column xAlign="start" gap={4}>
        <div style={{ width: 80, height: 26, borderRadius: 6, background: color, color: opposite }}>
            {label}
        </div>
        <Typography.span children={`${color} / opposite: ${opposite}`} />
    </Flex.column>
);

const X = () => (
    <Ds.page title="<colorGet>" releasedOn="1.0.0" description="Theme/css color resolver + helpers.">
        <Ds.block
            title="Basic Usage"
            code={`import { colorGet } from "${SYS.basePath}";

const c = colorGet("primary");
// c.color, c.opposite, c.colorApi, c.oppositeApi`}
            example={
                <Flex xAlign="start" gap={16}>
                    <Swatch label="primary" color={c1?.color} opposite={c1?.opposite} />
                    <Swatch label="path" color={c2?.color} opposite={c2?.opposite} />
                </Flex>
            }
        />
        <Ds.block
            title="Shade / Tint API"
            code={`const c = colorGet("#3388ff");
const a = c.colorApi.shade20;
const b = c.colorApi.tint30;`}
            example={
                <Typography.span
                    children={`shade20: ${c1?.colorApi?.shade20} | tint30: ${c1?.colorApi?.tint30}`}
                />
            }
        />
        <Ds.api
            props={{
                color: {
                    description: "Input color token/path/css color.",
                    type: "string",
                    required: true,
                    defaultValue: "undefined",
                },
                return: {
                    description: "{ color, opposite, colorApi, oppositeApi }",
                    type: "object | undefined",
                    required: true,
                    defaultValue: "undefined",
                },
            }}
        />
    </Ds.page>
);

export default X;

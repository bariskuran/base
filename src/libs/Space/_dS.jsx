import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Space } from ".";
import { Card } from "../Card";
import { Typography } from "../Typography";

const X = () => (
    <Ds.page title="<Space>" releasedOn="1.0.0" description="Vertical spacer component.">
        <Ds.block
            title="Preset and Custom Size"
            code={`import { Space } from "${SYS.basePath}";

<Typography>Top</Typography>
<Space size="xl" />
<Typography>Bottom</Typography>`}
            example={
                <Card padding={12}>
                    <Typography.span children="Top" />
                    <Space size="xl" />
                    <Typography.span children="Bottom" />
                </Card>
            }
        />
        <Ds.api
            props={{
                size: {
                    description: "Spacer size token or css size value.",
                    type: `"xs" | "s" | "m" | "l" | "xl" | "xxl" | "xxxl" | "xxxxl" | string | number`,
                    required: false,
                    defaultValue: '"m"',
                },
            }}
        />
    </Ds.page>
);

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Space } from ".";
import { Card } from "../Card";
import { Typo } from "../Typo";

const X = () => (
    <Ds.page title="<Space>" releasedOn="1.0.0" description="Vertical spacer component.">
        <Ds.block
            title="Preset and Custom Size"
            code={`import { Space } from "${SYS.basePath}";

                        <Typo>Top</Typo>
                        <Space size="xl" />
                        <Typo>Bottom</Typo>`}
            example={
                <Card padding={12}>
                    <Typo.span children="Top" />
                    <Space size="xl" />
                    <Typo.span children="Bottom" />
                </Card>
            }
        />
        <Ds.api
            args="<Space />"
            props={{
                size: {
                    description: "Spacer size token or css size value.",
                    type: `"xs" | "s" | "m" | "l" | "xl" | "xxl" | "xxxl" | "xxxxl" | string | number`,
                    defaultValue: '"m"',
                },
            }}
        />
    </Ds.page>
);

export default X;

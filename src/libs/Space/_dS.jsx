import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Space } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";

const X = () => (
    <Ds.page title="<Space>" releasedOn="1.0.0" description={{ tr: "Dikey boşluk componenti.", en: "Vertical spacer component." }}>
        <Ds.block
            title={{ tr: "Ön ayarlı ve özel boyut", en: "Preset and Custom Size" }}
            code={`import { Space } from "${SYS.basePath}";

                        <Typo>Top</Typo>
                        <Space size="xl" />
                        <Typo>Bottom</Typo>`}
            example={
                <Flex wrap gap={10} padding={10} full>
                    <Ex size="xs" />
                    <Ex size="s" />
                    <Ex size="m" />
                    <Ex size="l" />
                    <Ex size="xl" />
                    <Ex size="xxl" />
                    <Ex size="xxxl" />
                    <Ex size="xxxxl" />
                    <Ex size={100} description="number" />
                </Flex>
            }
        />
        <Ds.api
            args="<Space />"
            props={{
                size: {
                    description: { tr: "Spacer boyut token'ı veya CSS boyut değeri.", en: "Spacer size token or CSS size value." },
                    type: `"xs" | "s" | "m" | "l" | "xl" | "xxl" | "xxxl" | "xxxxl" | string | number`,
                    defaultValue: '"m"',
                },
            }}
        />
    </Ds.page>
);

export default X;

const Ex = ({ size, description }) => (
    <Flex.column>
        <Typo.span>
            {size} {description}
        </Typo.span>
        <Flex bgColor="greys.shade20" width={50}>
            <Space size={size} />
        </Flex>
    </Flex.column>
);

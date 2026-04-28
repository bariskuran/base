import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { get3DShadow } from ".";
import styled from "styled-components";
import { Flex } from "../Flex";

const Card = styled.div`
    width: 120rem;
    height: 60rem;
    border-radius: 8rem;
    background: white;
    display: grid;
    place-items: center;
`;

const Depth1 = styled(Card)`
    ${get3DShadow({ depth: 1 })}
`;

const Depth3 = styled(Card)`
    ${get3DShadow({ depth: 3 })}
`;

const X = () => (
    <Ds.page
        title="<colorGet3dShadow>"
        releasedOn="1.0.0"
        description="Generates reusable 3D box-shadow CSS."
    >
        <Ds.block
            title="Basic Usage"
            code={`import { get3DShadow } from "${SYS.basePath}";

const Box = styled.div\`
  \${get3DShadow({ depth: 1 })}
\`;`}
            example={
                <Flex xAlign="start" gap={12}>
                    <Depth1 children="depth 1" />
                    <Depth3 children="depth 3" />
                </Flex>
            }
        />
        <Ds.api
            props={{
                depth: {
                    description: "Base shadow depth level.",
                    type: "number",
                    required: false,
                    defaultValue: "1",
                },
                hoverDepth: {
                    description: "Shadow depth on hover.",
                    type: "number | null",
                    required: false,
                    defaultValue: "null",
                },
                transition: {
                    description: "Adds transition for hover shadow.",
                    type: "boolean",
                    required: false,
                    defaultValue: "true",
                },
                color: {
                    description: "Shadow source color (defaults theme.foreground).",
                    type: "string",
                    required: false,
                    defaultValue: "theme.foreground",
                },
                return: {
                    description: "styled-components css fragment.",
                    type: "css",
                    required: true,
                    defaultValue: "computed",
                },
            }}
        />
    </Ds.page>
);

export default X;

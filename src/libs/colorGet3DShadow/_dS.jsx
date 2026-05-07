import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { get3DShadow } from ".";
import styled from "styled-components";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

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

const X = () => {
    const { note, setLocal } = baseStore.useLocal({
        note: null,
    });

    return (
        <Ds.page
            title="get3DShadow()"
            releasedOn="1.0.0"
            description="Generates reusable 3D box-shadow CSS."
        >
            <Ds.block
                title="Basic usage"
                code={`import { get3DShadow } from "${SYS.basePath}";
import styled from "styled-components";

const Box = styled.div\`
  \${get3DShadow({ depth: 1 })}
\`;`}
                example={
                    <Flex.column xAlign="start" gap={12} padding={10}>
                        <Flex xAlign="start" gap={12}>
                            <Depth1 children="depth 1" />
                            <Depth3 children="depth 3" />
                        </Flex>
                        <Button.string
                            label="Note: return value is a styled-components css fragment"
                            onClick={() =>
                                setLocal((s) => {
                                    s.note =
                                        "get3DShadow returns interpolated CSS (see cards). Use inside styled.div template.";
                                })
                            }
                        />
                        <Space size="l" />
                        {note != null && <Typo.span balance>{note}</Typo.span>}
                    </Flex.column>
                }
            />
            <Ds.api
                args="get3DShadow({ depth, hoverDepth, transition, color });"
                returns="styled-components css interpolable fragment."
                props={{
                    depth: {
                        description: "Base shadow depth level.",
                        type: "number",
                        defaultValue: "1",
                    },
                    hoverDepth: {
                        description: "Shadow depth on hover.",
                        type: "number | null",
                    },
                    transition: {
                        description: "Adds transition for hover shadow.",
                        type: "boolean",
                        defaultValue: "true",
                    },
                    color: {
                        description: "Shadow source color (defaults theme.foreground).",
                        type: "string",
                        defaultValue: "theme.foreground",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { get3DShadow } from ".";
import styled from "styled-components";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";

const Card = styled.div`
    width: 120rem;
    height: 60rem;
    border-radius: 8rem;
    background: white;
    display: grid;
    place-items: center;
`;

const PreviewCard = styled(Card)`
    ${({ $depth, $hoverDepth, $transition, $color }) =>
        get3DShadow({
            depth: $depth,
            hoverDepth: $hoverDepth,
            transition: $transition,
            color: $color,
        })}
`;

const X = () => {
    const { depth, hoverDepth, transition, color, set } = baseStore.useLocal({
        depth: 1,
        hoverDepth: 3,
        transition: true,
        color: "#0f172a",
    });

    return (
        <Ds.page
            title="get3DShadow()"
            releasedOn="1.0.0"
            description={`Generates reusable 3D box-shadow CSS fragment for styled-components.

                    You can use get3DShadow via direct import from base, or via the theme helper in styled usage (theme.get3DShadow if attached in your setup).`}
        >
            <Ds.block
                title="Interactive preview"
                code={`import { get3DShadow } from "${SYS.basePath}";

                        const Box = styled.div\`
                          \${get3DShadow({ depth: 1 })}
                        \`;
                        
                        const Box = styled.div\`
                          \${get3DShadow({ depth: 1, hoverDepth: 3 })}
                        \`;
                        `}
                example={
                    <Flex.column gap={12} full>
                        <Flex gap={10}>
                            <Flex.column gap={4}>
                                <Typo.span>depth: {depth}</Typo.span>
                                <input
                                    type="range"
                                    min={1}
                                    max={10}
                                    value={depth}
                                    onChange={(e) =>
                                        set((s) => {
                                            s.depth = Number(e.target.value);
                                        })
                                    }
                                />
                            </Flex.column>
                            <Flex.column gap={4}>
                                <Typo.span>hoverDepth: {hoverDepth}</Typo.span>
                                <input
                                    type="range"
                                    min={1}
                                    max={15}
                                    value={hoverDepth}
                                    onChange={(e) =>
                                        set((s) => {
                                            s.hoverDepth = Number(e.target.value);
                                        })
                                    }
                                />
                            </Flex.column>
                            <Flex.column gap={4}>
                                <Typo.span>shadow color:</Typo.span>
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) =>
                                        set((s) => {
                                            s.color = e.target.value;
                                        })
                                    }
                                />
                            </Flex.column>
                        </Flex>
                        <label>
                            <input
                                type="checkbox"
                                checked={transition}
                                onChange={(e) =>
                                    set((s) => {
                                        s.transition = e.target.checked;
                                    })
                                }
                            />{" "}
                            transition
                        </label>
                        <Flex gap={12}>
                            <PreviewCard
                                children="preview"
                                $depth={depth}
                                $hoverDepth={hoverDepth}
                                $transition={transition}
                                $color={color}
                            />
                            <PreviewCard
                                children="static"
                                $depth={depth}
                                $hoverDepth={null}
                                $transition={transition}
                                $color={color}
                            />
                        </Flex>
                        <Ds.output directValue={{ depth, hoverDepth, transition, color }} />
                    </Flex.column>
                }
            />
            <Ds.api
                args="const shadowCss = get3DShadow({ color, depth, hoverDepth, transition });"
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
                returnProps={{
                    shadowCss: {
                        description: "styled-components css fragment for box-shadow layers.",
                        type: "css",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

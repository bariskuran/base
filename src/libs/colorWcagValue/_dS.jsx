import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorWcagValue } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";
import styled, { css } from "styled-components";
import { useMemo } from "react";

const ResultDiv = styled.div`
    ${({ $colorA, $colorB }) => css`
        width: 160px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background: ${$colorA};
        color: ${$colorB};
        font-weight: 700;
    `}
`;

const ColorPicker = ({ value, onChange, label }) => {
    return (
        <Flex.column gap={2}>
            <Typo.span>{label}:</Typo.span>
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: 34,
                    height: 34,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                }}
            />
        </Flex.column>
    );
};

const X = () => {
    const { colorA, colorB, setLocal } = baseStore.useLocal({
        colorA: "#ffffff",
        colorB: "#111111",
    });

    const value = useMemo(() => colorWcagValue(colorA, colorB), [colorA, colorB]);
    return (
        <Ds.page
            title="colorWcagValue()"
            releasedOn="1.0.0"
            description={`Returns the WCAG contrast value between two colors.

                        Use this as a reminder for common WCAG targets: normal text AA >= 4.5:1, AAA >= 7:1; large text AA >= 3:1, AAA >= 4.5:1; non-text UI elements/icons/borders >= 3:1.

                        You can use colorWcagValue via direct import from base, or via the theme helper in styled usage (theme.colorWcagValue).`}
        >
            <Ds.block
                title="Basic usage"
                code={`import { colorWcagValue } from "${SYS.basePath}";`}
                example={
                    <Flex.column gap={10}>
                        <Flex gap={10} marginBottom={10}>
                            <ColorPicker
                                value={colorA}
                                onChange={(newValue) =>
                                    setLocal((s) => {
                                        s.colorA = newValue;
                                    })
                                }
                                label="Color A"
                            />
                            <ColorPicker
                                value={colorB}
                                onChange={(newValue) =>
                                    setLocal((s) => {
                                        s.colorB = newValue;
                                    })
                                }
                                label="Color B"
                            />
                        </Flex>
                        <ResultDiv $colorA={colorA} $colorB={colorB}>
                            Contrast: {value}
                        </ResultDiv>
                        <Typo.span>AA (normal text): {value >= 4.5 ? "pass" : "fail"}</Typo.span>
                        <Typo.span>AA (large text): {value >= 3 ? "pass" : "fail"}</Typo.span>
                    </Flex.column>
                }
            />
            <Ds.api
                args="colorWcagValue(colorA, colorB);"
                returns="WCAG contrast ratio number (0 if input missing/invalid)."
                props={{
                    colorA: {
                        description: "First color input.",
                        type: "string | object",
                        required: true,
                    },
                    colorB: {
                        description: "Second color input.",
                        type: "string | object",
                        required: true,
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

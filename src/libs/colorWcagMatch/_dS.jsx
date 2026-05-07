import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorWcagMatch } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";
import styled, { css } from "styled-components";
import { colorAlpha } from "../colorAlpha";

const RangeInput = styled.input`
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    padding: 0;
    border-radius: 999px;
    background: ${({ $trackColor }) => $trackColor};
    outline: none;

    &::-webkit-slider-runnable-track {
        height: 6px;
        border-radius: 999px;
        background: ${({ $trackColor }) => $trackColor};
    }

    &::-moz-range-track {
        height: 6px;
        border-radius: 999px;
        background: ${({ $trackColor }) => $trackColor};
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 999px;
        border: 0;
        background: ${({ theme }) => theme?.primary || "#0077ff"};
        margin-top: -5px;
        cursor: pointer;
    }

    &::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 999px;
        border: 0;
        background: ${({ theme }) => theme?.primary || "#0077ff"};
        cursor: pointer;
    }
`;

const ResultDiv = styled.div`
    ${({ $background, $color }) => css`
        background: ${$background};
        width: 150px;
        height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;

        &:after {
            content: "${$color}";
            width: 75px;
            height: 75px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: ${$background};
            background: ${$color};
        }
    `}
`;

const AimedDiv = styled.div`
    ${({ $color, $background }) => css`
        background: ${$background};
        color: ${$color};
        width: 60px;
        height: 60px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
    `}
`;
const Swatch = ({ background, targetColor, wcag, tolerance, step }) => {
    const result = colorWcagMatch(background, targetColor, wcag, { tolerance, step });

    return (
        <Flex.column>
            <AimedDiv $background={targetColor} $color={background}>
                aim
            </AimedDiv>
            <ResultDiv $background={background} $color={result?.color} />
            <Typo.span children={`Color: ${result?.color}`} />
            <Typo.span children={`Final Ratio: ${result?.finalRatio}`} />
            <Typo.span children={`Lightness: ${result?.lightness}`} />
        </Flex.column>
    );
};

const Slider = ({ value, onChange, label, min, max, step }) => {
    const [theme] = baseStore.useGlobal((s) => [s.theme]);
    const trackColor = colorAlpha(theme?.primary, 20);

    return (
        <Flex.column gap={2}>
            <Typo.span>
                {label}: <b>{value}</b>
            </Typo.span>
            <RangeInput
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                $trackColor={trackColor}
                onChange={(e) => {
                    const newValue = parseFloat(e.target.value);
                    onChange(newValue);
                }}
                style={{
                    width: 180,
                    verticalAlign: "middle",
                    accentColor: theme?.primary || "#0077ff",
                }}
            />
        </Flex.column>
    );
};

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
    const { wcag, tolerance, step, setLocal, background, targetColor } = baseStore.useLocal({
        outBasic: null,
        outOpts: null,
        wcag: 4.5,
        tolerance: 0.05,
        step: 1,
        background: "#ffffff",
        targetColor: "#0077ff",
    });

    return (
        <Ds.page
            title="colorWcagMatch()"
            releasedOn="1.0.0"
            description={`Adjusts targetColor lightness (while preserving its hue and saturation) to reach the target WCAG contrast ratio against the background.

                Use this as a reminder for common WCAG targets: normal text AA >= 4.5:1, AAA >= 7:1; large text AA >= 3:1, AAA >= 4.5:1; non-text UI elements/icons/borders >= 3:1.

                You can use colorWcagMatch via direct import from base, or via the theme helper in styled usage (theme.colorWcagMatch).`}
        >
            <Ds.block
                title="Basic usage"
                code={`import { colorWcagMatch } from "${SYS.basePath}";

                //result
                
                {
                    "color": "#0072f5",
                    "colorFormats": {
                            "hex6": "#0072f5",
                            "hex8": "#0072f5ff",
                            "rgbArray": [ 0, 114, 245 ],
                            "rgbString": "rgb(0, 114, 245)",
                            "rgbaArray": [ 0, 114, 245, 1 ],
                            "rgbaString": "rgba(0, 114, 245, 1)",
                            "hsbArray": [ 212, 100, 96 ],
                            "hsbString": "hsb(212, 100%, 96%)",
                            "hsbaArray": [ 212, 100, 96, 1 ],
                            "hsbaString": "hsba(212, 100%, 96% / 1)",
                            "hslArray": [ 212, 100, 48 ],
                            "hslString": "hsl(212, 100%, 48%)",
                            "hslaArray": [ 212, 100, 48, 1 ],
                            "hslaString": "hsla(212, 100%, 48% / 1)",
                            "luminance": 0.18627,
                            "linearRgbaArray": [ 0, 0.16826940018969075, 0.9130986517934192, 1 ]
                    },
                    "finalRatio": 4.44,
                    "lightness": 48
                }`}
                example={
                    <Flex.column gap={10}>
                        <Flex gap={10}>
                            <Slider
                                label="WCAG"
                                value={wcag}
                                min={1}
                                max={21}
                                step={0.1}
                                onChange={(newValue) => {
                                    setLocal((s) => {
                                        s.wcag = newValue;
                                    });
                                }}
                            />
                            <Slider
                                label="tolerance"
                                value={tolerance}
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={(newValue) => {
                                    setLocal((s) => {
                                        s.tolerance = newValue;
                                    });
                                }}
                            />
                            <Slider
                                label="step"
                                value={step}
                                min={1}
                                max={10}
                                step={0.5}
                                onChange={(newValue) => {
                                    setLocal((s) => {
                                        s.step = newValue;
                                    });
                                }}
                            />
                        </Flex>
                        <Flex gap={10} marginBottom={20}>
                            <ColorPicker
                                value={background}
                                onChange={(newValue) => {
                                    setLocal((s) => {
                                        s.background = newValue;
                                    });
                                }}
                                label="Background"
                            />
                            <ColorPicker
                                value={targetColor}
                                onChange={(newValue) => {
                                    setLocal((s) => {
                                        s.targetColor = newValue;
                                    });
                                }}
                                label="Target color"
                            />
                        </Flex>
                        <Typo.bold>Result:</Typo.bold>
                        <Swatch
                            background={background}
                            targetColor={targetColor}
                            wcag={wcag}
                            tolerance={tolerance}
                            step={step}
                        />
                    </Flex.column>
                }
            />
            <Ds.api
                args="colorWcagMatch(background, targetColor, wcagRatio, { tolerance, step });"
                returns="Object with color, colorFormats, finalRatio, lightness."
                props={{
                    background: {
                        description: "Background color.",
                        type: "string",
                        required: true,
                    },
                    targetColor: {
                        description: "Base color whose hue/saturation are preserved.",
                        type: "string",
                        required: true,
                    },
                    wcagRatio: {
                        description: "Target contrast ratio.",
                        type: "number",
                        defaultValue: "4.5",
                    },
                    tolerance: {
                        description:
                            "Accepted ratio band around expectedRatio (expectedRatio ± tolerance). Min/Max (code): no hard limit. Practical range: 0..1.",
                        type: "number",
                        defaultValue: "0.05",
                    },
                    step: {
                        description:
                            "Lightness scan increment (0..100 scale). Min/Max (code): > 0, no hard upper limit. Practical range: 1..10.",
                        type: "number",
                        defaultValue: "1",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

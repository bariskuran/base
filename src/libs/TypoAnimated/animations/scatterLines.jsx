import styled from "styled-components";
import { Flex } from "../../Flex";
import { Typo } from "../../Typo";
import { AnimationSlot } from "../tools/AnimationSlot";
import {
    pseudo,
    parseMultilineText,
    buildWordEntries,
    TIGHT_LINE_HEIGHT,
} from "../tools/animationUtils";

const FADE_MS = 420;

const WordShell = styled.span`
    display: inline-block;
    line-height: ${TIGHT_LINE_HEIGHT};
    vertical-align: baseline;
    font-size: ${({ $fontSize }) => $fontSize};
    opacity: ${({ $opacity }) => $opacity};
    transition:
        opacity ${FADE_MS}ms ease,
        font-size ${FADE_MS}ms ease;
`;

const wordFontSizePct = (seed) => `${Math.round(80 + pseudo(seed) * 40)}%`;

const ScatterLinesLines = ({
    lines,
    entries,
    step,
    color,
    typoProps,
    ghost = false,
}) => {
    const visibleKeys = new Set(
        entries.slice(0, step + 1).map((e) => `${e.lineIndex}-${e.wordIndex}`),
    );

    return (
    <Typo.span lineHeight={TIGHT_LINE_HEIGHT} color={color} {...typoProps}>
        <Flex.column gap={0} style={{ lineHeight: TIGHT_LINE_HEIGHT }}>
            {lines.map((line, lineIndex) => {
                const words = line.split(/\s+/).filter(Boolean);

                return (
                    <Flex
                        key={lineIndex}
                        gap={4}
                        wrap
                        style={{ lineHeight: TIGHT_LINE_HEIGHT }}
                        alignItems="baseline"
                    >
                        {words.map((word, wordIndex) => {
                            const key = `${lineIndex}-${wordIndex}`;
                            const seed = lineIndex * 1000 + wordIndex;
                            const fontSize = ghost ? "120%" : wordFontSizePct(seed);
                            const targetOpacity = 0.7 + pseudo(seed + 2) * 0.3;

                            const visible = ghost || visibleKeys.has(key);

                            return (
                                <WordShell
                                    key={key}
                                    $fontSize={fontSize}
                                    $opacity={visible ? (ghost ? 1 : targetOpacity) : 0}
                                >
                                    <Typo.span
                                        color={color}
                                        lineHeight={TIGHT_LINE_HEIGHT}
                                        weight={pseudo(seed + 1) > 0.5 ? 600 : 400}
                                        content={word}
                                    />
                                </WordShell>
                            );
                        })}
                    </Flex>
                );
            })}
        </Flex.column>
    </Typo.span>
    );
};

export default {
    id: "scatterLines",
    createPlan: ({ text, duration }) => {
        const lines = parseMultilineText(text);
        const entries = buildWordEntries(lines);
        const totalSteps = Math.max(1, entries.length);
        const refreshTime = Math.max(80, Math.floor(duration / totalSteps));

        return {
            totalSteps,
            chunk: 1,
            refreshTime,
            lines,
            entries,
            charCount: text.length,
        };
    },
    getFrame: ({ step, plan, color, typoProps }) => ({
        mode: "custom",
        node: (
            <AnimationSlot
                ghost={
                    <ScatterLinesLines
                        lines={plan.lines}
                        entries={plan.entries}
                        step={plan.entries.length - 1}
                        color={color}
                        typoProps={typoProps}
                        ghost
                    />
                }
            >
                <ScatterLinesLines
                    lines={plan.lines}
                    entries={plan.entries}
                    step={step}
                    color={color}
                    typoProps={typoProps}
                />
            </AnimationSlot>
        ),
    }),
};

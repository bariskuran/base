import { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Flex } from "../../Flex";
import { Typo } from "../../Typo";
import { generateRandom } from "../../generateRandom";
import { AnimationSlot } from "../tools/AnimationSlot";
import { parseMultilineText, buildWordEntries, TIGHT_LINE_HEIGHT } from "../tools/animationUtils";

const FS_MIN = 80;
const FS_MAX = 120;
const OP_MIN = 0.7;
const OP_MAX = 1;

const randFontSize = () => generateRandom.number(FS_MIN, FS_MAX, 0, true);
const randOpacity = () => generateRandom.number(OP_MIN, OP_MAX, 2, true);

const createWordState = (fromFs, fromOp) => ({
    fromFs: fromFs ?? randFontSize(),
    fromOp: fromOp ?? randOpacity(),
    toFs: randFontSize(),
    toOp: randOpacity(),
});

const WordShell = styled.span`
    display: inline-block;
    line-height: ${TIGHT_LINE_HEIGHT};
    vertical-align: middle;
    font-size: ${({ $fs }) => $fs}%;
    opacity: ${({ $op }) => $op};
    transition: ${({ $transition }) => $transition};
`;

const WordCell = ({ state, playing, halfMs, color, content }) => {
    const [display, setDisplay] = useState({
        fs: state.fromFs,
        op: state.fromOp,
    });
    const [transition, setTransition] = useState("none");

    useLayoutEffect(() => {
        if (!playing) {
            setDisplay({ fs: state.toFs, op: state.toOp });
            setTransition("none");
            return;
        }

        setDisplay({ fs: state.fromFs, op: state.fromOp });
        setTransition("none");

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setDisplay({ fs: state.toFs, op: state.toOp });
                setTransition(
                    `font-size ${halfMs}ms ease-in-out, opacity ${halfMs}ms ease-in-out`,
                );
            });
        });
    }, [playing, state.fromFs, state.fromOp, state.toFs, state.toOp, halfMs]);

    return (
        <WordShell $fs={display.fs} $op={display.op} $transition={transition}>
            <Typo.span
                color={color}
                lineHeight={TIGHT_LINE_HEIGHT}
                weight={700}
                content={content}
            />
        </WordShell>
    );
};

const buildInitialStates = (lines) => {
    const states = {};
    lines.forEach((line, lineIndex) => {
        line.split(/\s+/).filter(Boolean).forEach((word, wordIndex) => {
            states[`${lineIndex}-${wordIndex}`] = createWordState();
        });
    });
    return states;
};

const StackedWordsLines = ({
    lines,
    wordStates,
    halfMs,
    step,
    color,
    typoProps,
    ghost = false,
}) => {
    const playing = !ghost && step % 2 === 0;

    return (
        <Typo.span lineHeight={TIGHT_LINE_HEIGHT} color={color} whiteSpace="pre-wrap" {...typoProps}>
            <Flex.column gap={0} style={{ lineHeight: TIGHT_LINE_HEIGHT }}>
                {lines.map((line, lineIndex) => {
                    const words = line.split(/\s+/).filter(Boolean);

                    return (
                        <Flex
                            key={lineIndex}
                            gap={4}
                            wrap
                            style={{ lineHeight: TIGHT_LINE_HEIGHT }}
                            alignItems="center"
                        >
                            {words.map((word, wordIndex) => {
                                const key = `${lineIndex}-${wordIndex}`;

                                if (ghost) {
                                    return (
                                        <Typo.span
                                            key={key}
                                            color={color}
                                            lineHeight={TIGHT_LINE_HEIGHT}
                                            weight={700}
                                            size="120%"
                                            content={word}
                                        />
                                    );
                                }

                                const state = wordStates[key];
                                if (!state) return null;

                                return (
                                    <WordCell
                                        key={key}
                                        state={state}
                                        playing={playing}
                                        halfMs={halfMs}
                                        color={color}
                                        content={word}
                                    />
                                );
                            })}
                        </Flex>
                    );
                })}
            </Flex.column>
        </Typo.span>
    );
};

const StackedWordsAnimated = ({ lines, halfMs, step, color, typoProps }) => {
    const [wordStates, setWordStates] = useState(() => buildInitialStates(lines));
    const prevStepRef = useRef(step);

    useLayoutEffect(() => {
        if (step === 0 && prevStepRef.current === 1) {
            setWordStates((prev) => {
                const next = { ...prev };
                Object.keys(next).forEach((key) => {
                    const w = next[key];
                    next[key] = createWordState(w.toFs, w.toOp);
                });
                return next;
            });
        }
        prevStepRef.current = step;
    }, [step]);

    return (
        <StackedWordsLines
            lines={lines}
            wordStates={wordStates}
            halfMs={halfMs}
            step={step}
            color={color}
            typoProps={typoProps}
        />
    );
};

/** Words stay visible; each cycle transitions to a new random target, then pauses at that value. */
export default {
    id: "stackedWords",
    defaultLoop: true,
    createPlan: ({ text, duration }) => {
        const lines = parseMultilineText(text);
        const entries = buildWordEntries(lines);
        const cycleMs = Math.max(800, duration);
        const halfMs = Math.max(200, Math.floor(cycleMs / 2));

        return {
            totalSteps: 2,
            chunk: 1,
            refreshTime: halfMs,
            lines,
            entries,
            charCount: text.length,
            cycleMs,
            halfMs,
        };
    },
    getFrame: ({ step, plan, color, typoProps }) => ({
        mode: "custom",
        node: (
            <AnimationSlot
                ghost={
                    <StackedWordsLines
                        lines={plan.lines}
                        wordStates={{}}
                        color={color}
                        typoProps={typoProps}
                        ghost
                    />
                }
            >
                <StackedWordsAnimated
                    lines={plan.lines}
                    halfMs={plan.halfMs}
                    step={step}
                    color={color}
                    typoProps={typoProps}
                />
            </AnimationSlot>
        ),
    }),
};

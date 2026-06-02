import styled, { css, keyframes } from "styled-components";
import { Typo } from "../../Typo";
import { AnimationSlot } from "../tools/AnimationSlot";
import {
    buildRevealPlan,
    getRevealCorrectCount,
    resolveAnimatedWriterWhiteSpace,
} from "../tools/animationUtils";

const dropIn = keyframes`
    from {
        transform: translateY(-4px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
`;

const Char = styled.span`
    display: inline-block;
    vertical-align: baseline;
    ${({ $animate, $ms, $hidden }) =>
        $hidden
            ? css`
                  opacity: 0;
              `
            : $animate
              ? css`
                    animation: ${dropIn} ${$ms}ms ease forwards;
                `
              : css`
                    opacity: 1;
                `}
`;

const AnimatedWriterView = ({ text, step, plan, color, typoProps = {} }) => {
    const correct = getRevealCorrectCount(step, plan);
    const prevCorrect = step > 0 ? getRevealCorrectCount(step - 1, plan) : 0;
    const stepMs = Math.max(120, Math.min(400, plan.refreshTime * 1.4));
    const whiteSpace = resolveAnimatedWriterWhiteSpace(text);

    return (
        <Typo.span color={color} whiteSpace={whiteSpace} {...typoProps}>
            {text.split("").map((char, index) => {
                const hidden = index >= correct;
                const animate = !hidden && index >= prevCorrect;
                return (
                    <Char
                        key={`${index}-${step}`}
                        $hidden={hidden}
                        $animate={animate}
                        $ms={stepMs}
                    >
                        {char}
                    </Char>
                );
            })}
        </Typo.span>
    );
};

export default {
    id: "animatedWriter",
    createPlan: ({ text, duration }) => buildRevealPlan(text, duration),
    getFrame: ({ text, step, plan, color, typoProps }) => {
        const whiteSpace = resolveAnimatedWriterWhiteSpace(text);

        return {
            mode: "custom",
            node: (
                <AnimationSlot
                    ghost={
                        <Typo.span
                            color={color}
                            whiteSpace={whiteSpace}
                            {...typoProps}
                            content={text}
                        />
                    }
                >
                    <AnimatedWriterView
                        text={text}
                        step={step}
                        plan={plan}
                        color={color}
                        typoProps={typoProps}
                    />
                </AnimationSlot>
            ),
        };
    },
};

import { useMemo, useEffect, useState } from "react";
import styled from "styled-components";
import { generateRandomNumber } from "../../generateRandomNumber";

const LineBase = styled.div`
    width: 100%;
    line-height: 0.1;
    display: flex;
    transition: all ${(p) => p.$animationDuration}s ease-in-out;
    margin-left: ${(p) => p.$marginLeft}px;
    white-space: nowrap;
`;
const SpanBase = styled.span`
    color: ${(p) => p.$color};
    transition: all ${(p) => p.$animationDuration}s ease-in-out;
    pointer-events: none;
    mix-blend-mode: overlay;
    white-space: nowrap;
    margin-right: 10rem;
`;

export const TA1 = (p = {}) => {
    const {
        arr,
        fontSize = [40, 60],
        lineHeight = [0.5, 1],
        marginLeft = [0, 20],
        color = "#fff",
        reRender = 0,
        animationDuration = 1.5,
    } = p;
    const [initialRender, setInitialRender] = useState();

    const randomValues = useMemo(() => {
        return arr.map((line) => ({
            lineMargin: generateRandomNumber(...marginLeft),
            words: line.split(" ").map(() => ({
                fontSize: generateRandomNumber(...fontSize),
                lineHeight: generateRandomNumber(...lineHeight, 2),
            })),
        }));
    }, [reRender, initialRender]);

    useEffect(() => {
        setInitialRender((p) => !p);
    }, []);

    return randomValues.map((lineData, lineIndex) => (
        <LineBase key={lineIndex} $marginLeft={lineData.lineMargin} $animationDuration={animationDuration}>
            {arr[lineIndex].split(" ").map((word, wordIndex) => (
                <SpanBase
                    key={wordIndex}
                    $color={color}
                    $animationDuration={animationDuration}
                    style={{
                        fontSize: lineData.words[wordIndex].fontSize + "rem",
                        lineHeight: lineData.words[wordIndex].lineHeight,
                        opacity: lineData.words[wordIndex].lineHeight,
                    }}
                >
                    {word}
                </SpanBase>
            ))}
        </LineBase>
    ));
};

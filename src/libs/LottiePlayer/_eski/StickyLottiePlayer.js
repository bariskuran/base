import { useEffect, useRef } from "react";
import { Player as OriginalLottiePlayer } from "@lottiefiles/react-lottie-player";
import { useEventListener } from "../useEventListener";
import { useBase } from "../useBase";
import styled, { css } from "styled-components";

const StyledContainer = styled.div`
    ${(p) => {
        return css`
            width: ${p.width || "max-content"};
            max-width: max-content;
        `;
    }}
`;

export const StickyLottiePlayer = ({
    name = "myLottiePlayer",
    width = "300",
    src = "https://assets3.lottiefiles.com/packages/lf20_XZ3pkn.json",
    scrollDirection = "top", // left
    // stopBeforeLastFrame = 0,
    scrollValueToStart = 0,
    scrollValueToEnd = 1000,
    // ...props
}) => {
    const [winW, winH] = useBase((p) => [p.winW, p.winH]);
    const lottieContainer = useRef();
    const myLottie = useRef();
    const myLottieData = useRef();
    const lastFrame = useRef();
    const scrollLeft = useRef();
    const scrollTop = useRef();

    /**
     * onEvent Handler
     */
    const onEvent = (e) => {
        if (!myLottieData || !myLottieData.current) return;

        switch (e) {
            case "load":
                lastFrame.current = myLottieData.current.animationData.op - 1;
                myLottie.current.setSeeker(0.0000000001);
                defineCurrentScroll();
                onScrollCalculateNewCurrentFrame(lottieContainer);
                break;
            default:
                break;
        }
    };

    /**
     * onScroll Handler
     */
    const onScroll = () => {
        onScrollCalculateNewCurrentFrame(lottieContainer);
        defineCurrentScroll();
    };
    const defineCurrentScroll = () => {
        scrollLeft.current = document.documentElement.scrollLeft || document.body.scrollLeft || window.pageXOffset;
        scrollTop.current = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
    };
    useEventListener("scroll", onScroll);
    useEffect(() => onScrollCalculateNewCurrentFrame(lottieContainer), [winW, winH]);
    const onScrollCalculateNewCurrentFrame = (lottieContainer) => {
        let scroll = scrollDirection === "left" ? scrollLeft.current : scrollTop.current;
        if (!lottieContainer.current) return;
        if (scroll <= scrollValueToStart) myLottie.current.setSeeker(0);
        else if (scroll >= scrollValueToEnd) myLottie.current.setSeeker(lastFrame.current);
        else {
            const unit = lastFrame.current / (scrollValueToEnd - scrollValueToStart);
            myLottie.current.setSeeker((scroll - scrollValueToStart) * unit);
        }
    };

    /** Return */
    return (
        <StyledContainer aria-label={name} width={width} ref={lottieContainer}>
            <OriginalLottiePlayer
                lottieRef={(instance) => (myLottieData.current = instance)}
                onEvent={(e) => onEvent(e)}
                ref={myLottie}
                autoplay={false}
                loop={false}
                src={src}
                direction={1}
                style={{ width: width }}
            ></OriginalLottiePlayer>
        </StyledContainer>
    );
};

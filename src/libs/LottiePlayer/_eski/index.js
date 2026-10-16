import { useState, useEffect, useRef } from "react";
import { Player as OriginalLottiePlayer } from "@lottiefiles/react-lottie-player";
import { Container } from "./_styled";
import { useEventListener } from "../useEventListener";
import { useBase } from "../useBase";

export const LottiePlayer = ({
    name = "myLottiePlayer",
    transform = ["50", "50"], // percentage -> 50,50 is center,center
    size = "100%",
    height = "auto",
    src = "https://assets3.lottiefiles.com/packages/lf20_XZ3pkn.json",
    autoplay = false,
    hover = false,
    loop = false,
    speed = "1",
    direction = "1",
    scroll = false,
    scrollDirection = "top", // left
    scrollEnterExit = [25, 75],
    customLastFrame,
    stopBeforeLastFrame = 0,
    afterLastFrame,
    reStartByManually,
    playPauseManually,
    manualPerc,
}) => {
    const [winW, winH] = useBase((p) => [p.winW, p.winH]);
    const lottieContainer = useRef(null);
    const myLottie = useRef(null);
    const myLottieData = useRef(null);
    const lastFrame = useRef(null);
    const lastFrameFreezerMarg =
        customLastFrame ||
        (() => {
            let speedNumber = Number(speed) || 1;
            return speedNumber < 2 ? 1 : speedNumber < 4 ? 2 : speedNumber < 6 ? 3 : 4;
        })();
    const isMouseOver = useRef(false);

    // Manual percentage effect
    useEffect(() => {
        if (manualPerc === undefined || !myLottieData?.current || !lastFrame.current) return;
        const targetFrame = Math.floor((manualPerc * lastFrame.current) / 100);
        if (targetFrame >= 0 && targetFrame <= lastFrame.current) {
            myLottie.current.setSeeker(targetFrame);
        }
    }, [manualPerc]);

    /**
     * Play Pause Manually By Parent Component
     */
    useEffect(() => {
        if (!myLottieData?.current) return;
        else if (playPauseManually) myLottie.current.play();
        else myLottie.current.pause();
    }, [playPauseManually]);

    /**
     *  Restart Manully By Parent Component
     */
    useEffect(() => {
        if (reStartByManually !== 0 && myLottieData?.current) {
            myLottie.current.setSeeker(1);
            myLottie.current.play();
        }
    }, [reStartByManually]);
    /**
     *  onEvent Handler
     */
    const onEvent = (e) => {
        if (!myLottieData || !myLottieData.current) return;
        switch (e) {
            case "load":
                lastFrame.current = myLottieData.current.animationData.op - 1;
                if (hover || scroll) myLottie.current.setSeeker(0.0000000001);
                myLottie.current.setPlayerSpeed(speed);
                onScrollCalculateNewCurrentFrame(lottieContainer);
                break;
            case "frame":
                if (loop) break;
                if (
                    myLottieData.current.currentFrame >=
                    lastFrame.current - lastFrameFreezerMarg - stopBeforeLastFrame
                ) {
                    if (afterLastFrame) afterLastFrame();
                    myLottie.current.pause();
                    myLottie.current.setSeeker(lastFrame.current - lastFrameFreezerMarg - stopBeforeLastFrame - 0.1);
                }
                break;
            default:
                break;
        }
    };
    /**
     * onMouseOver Handler
     */
    const onMouseOver = () => {
        isMouseOver.current = true;
        if (!hover || scroll) return;
        myLottie.current.setPlayerSpeed(speed);
        myLottie.current.setPlayerDirection(1);
        myLottie.current.play();
    };

    /**
     * onMouseOut Handler
     */
    const onMouseOut = () => {
        isMouseOver.current = false;
        if (!hover || scroll) return;

        if (loop) {
            myLottie.current.pause();
            return;
        }

        myLottie.current.setPlayerSpeed(Number(speed) * 2);
        myLottie.current.setPlayerDirection(-1);
        myLottie.current.play();
    };

    /**
     * onScroll Handler
     */
    const startPercentage = !isNaN(scrollEnterExit[0]) ? scrollEnterExit[0] : 25;
    const endPercentage = !isNaN(scrollEnterExit[1]) ? scrollEnterExit[1] : 75;

    const onScroll = () => onScrollCalculateNewCurrentFrame(lottieContainer);
    useEventListener("scroll", onScroll);
    useEffect(() => onScrollCalculateNewCurrentFrame(lottieContainer), [winW, winH]);
    const onScrollCalculateNewCurrentFrame = (lottieContainer) => {
        if (!lottieContainer.current || !scroll) return;
        const rect = lottieContainer.current.getBoundingClientRect();
        let dimension, distance, screenSize, zeroPercentPoint, hundredPercentPoint, startPoint, endPoint;

        if (scrollDirection === "left") {
            dimension = rect.width;
            distance = rect.left;
            screenSize = winW;
        } else {
            dimension = rect.height;
            distance = rect.top;
            screenSize = winH;
        }
        // console.log(dimension, distance, screenSize);

        if (screenSize > dimension) {
            zeroPercentPoint = (screenSize * startPercentage) / 100;
            hundredPercentPoint = (screenSize * endPercentage) / 100;

            startPoint = distance - screenSize + zeroPercentPoint;
            endPoint = distance - screenSize + hundredPercentPoint;
        } else {
            zeroPercentPoint = (dimension / 100) * startPercentage;
            hundredPercentPoint = (dimension / 100) * endPercentage;

            startPoint = distance - screenSize + zeroPercentPoint;
            endPoint = distance + hundredPercentPoint;
        }

        if (startPoint >= 0) {
            myLottie?.current?.setSeeker(0);
        } else if (endPoint <= 0) {
            myLottie?.current?.setSeeker(lastFrame.current);
        } else {
            const artificialWidth = hundredPercentPoint - zeroPercentPoint;
            const unit = lastFrame.current / artificialWidth;
            myLottie?.current?.setSeeker(startPoint * -1 * unit);
        }
    };

    /**
     * calculateTransform for big sized lotties
     * margins are calculated here!!!
     */
    const [lottieMargins, setLottieMargins] = useState({ l: 0, t: 0 });
    useEffect(() => {
        if (!lottieContainer.current || !myLottieData.current) return;
        const sizeNumber = parseInt(size);
        const sizeParam = size.split(sizeNumber)[1];
        const lottieOriginalW = myLottieData.current.animationData.w;
        const lottieOriginalH = myLottieData.current.animationData.h;
        const containerRect = lottieContainer.current.getBoundingClientRect();
        const areaW = containerRect.width;
        // const areaH = containerRect.height;
        const lottieCurrentW = sizeParam === "%" ? (areaW * sizeNumber) / 100 : size;
        const lottieCurrentH = (lottieCurrentW * lottieOriginalH) / lottieOriginalW;

        setLottieMargins({
            l: ((-1 * (lottieCurrentW - areaW)) / 100) * transform[0],
            t: ((transform[1] - 50) * lottieCurrentH) / 100,
        });
    }, [lottieContainer.current, myLottieData.current, winW, winH]);

    //-------------------------------------------------------------
    // 		RETURN
    //-------------------------------------------------------------
    return (
        <Container
            ref={lottieContainer}
            aria-label={name + " lottieContainer"}
            onMouseEnter={onMouseOver}
            onMouseLeave={onMouseOut}
        >
            <OriginalLottiePlayer
                lottieRef={(instance) => (myLottieData.current = instance)}
                onEvent={(e) => onEvent(e)}
                ref={myLottie}
                autoplay={hover || scroll ? false : autoplay}
                loop={scroll ? false : loop}
                src={src}
                direction={direction}
                style={{
                    marginLeft: lottieMargins.l / 2 + "px",
                    marginRight: lottieMargins.l / 2 + "px",
                    marginTop: lottieMargins.t + "px",
                    width: size,
                    height: height || "auto",
                }}
            />
        </Container>
    );
};

import { Typo } from "../../Typo";
import useAnimations from "./useAnimations";
import { resolveAnimation } from "./animationRegistry";
import { AnimationSlot } from "./AnimationSlot";

export const TypoAnimatedBase = (props = {}) => {
    const {
        variant = "typewriter",
        duration,
        loop,
        useTimerProps = {},
        children,
        content,
        contentArray,
        color,
        ...typoProps
    } = props;

    const animation = resolveAnimation(variant);
    const resolvedLoop =
        animation.defaultLoop === true
            ? true
            : loop !== undefined
              ? loop
              : true;

    const typoCommon = { ...typoProps, ...(color != null ? { color } : {}) };
    const resolvedColor = typoCommon.color;

    const { frame, sourceText } = useAnimations({
        variant,
        duration,
        loop: resolvedLoop,
        useTimerProps,
        content,
        children,
        color: resolvedColor,
        typoProps: typoCommon,
    });

    if (contentArray?.length) {
        return (
            <>
                {contentArray.map((item, index) => (
                    <TypoAnimatedBase
                        key={index}
                        variant={variant}
                        duration={duration}
                        loop={resolvedLoop}
                        useTimerProps={useTimerProps}
                        content={item}
                        color={color}
                        {...typoProps}
                    />
                ))}
            </>
        );
    }

    if (frame?.mode === "custom") {
        return frame.node;
    }

    const displayText = frame?.text ?? sourceText;

    return (
        <AnimationSlot
            ghost={<Typo {...typoCommon} content={sourceText} whiteSpace="pre-wrap" />}
        >
            <Typo {...typoCommon} content={displayText} whiteSpace="pre-wrap" />
        </AnimationSlot>
    );
};

export default TypoAnimatedBase;

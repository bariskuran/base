import { forwardRef } from "react";
import { TypoAnimatedBase } from "./tools/Base";
import { resolveAnimation } from "./tools/animationRegistry";
import { useAnimations } from "./tools/useAnimations";
import { autoDuration, resolveDuration } from "./tools/autoDuration";

export const TypoAnimated = forwardRef(function TypoAnimated(props, _ref) {
    return <TypoAnimatedBase {...props} />;
});

TypoAnimated.displayName = "TypoAnimated";

export { useAnimations, resolveAnimation, autoDuration, resolveDuration };
export default TypoAnimated;

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useTimer } from "../../useTimer";
import { resolveAnimation } from "./animationRegistry";
import { resolveTextSource } from "./animationUtils";
import { resolveDuration } from "./autoDuration";

export const useAnimations = ({
    variant = "typewriter",
    duration,
    loop = true,
    useTimerProps = {},
    content,
    children,
    color,
    typoProps = {},
}) => {
    const sourceText = resolveTextSource(children, content);
    const animation = useMemo(() => resolveAnimation(variant), [variant]);

    const resolvedDuration = useMemo(
        () => resolveDuration(variant, sourceText, duration),
        [variant, sourceText, duration],
    );

    const { loop: _timerLoopIgnored, ...restTimerProps } = useTimerProps;

    const plan = useMemo(
        () => animation.createPlan({ text: sourceText, duration: resolvedDuration, color }),
        [animation, sourceText, resolvedDuration, color],
    );

    const [step, setStep] = useState(0);
    const stepRef = useRef(0);
    const loopRef = useRef(loop);
    const planRef = useRef(plan);
    const timerRef = useRef(null);
    const setStepRef = useRef(setStep);

    setStepRef.current = setStep;
    loopRef.current = loop;
    planRef.current = plan;

    const onEndRef = useRef(null);
    if (!onEndRef.current) {
        onEndRef.current = function typoAnimatedOnEnd() {
            const currentPlan = planRef.current;
            const next = stepRef.current + 1;

            if (next >= currentPlan.totalSteps) {
                if (loopRef.current) {
                    stepRef.current = 0;
                    setStepRef.current(0);
                    timerRef.current?.start({
                        refreshTime: currentPlan.refreshTime,
                        loop: false,
                    });
                } else {
                    stepRef.current = currentPlan.totalSteps - 1;
                    setStepRef.current(stepRef.current);
                    timerRef.current?.stop();
                }
                return;
            }

            stepRef.current = next;
            setStepRef.current(next);
            timerRef.current?.start({
                refreshTime: currentPlan.refreshTime,
                loop: false,
            });
        };
    }

    const runStep = useCallback(() => {
        timerRef.current?.start({
            refreshTime: planRef.current.refreshTime,
            loop: false,
        });
    }, []);

    const timer = useTimer({
        loop: false,
        startOnLoad: false,
        refreshTime: plan.refreshTime,
        ...restTimerProps,
        onEnd: onEndRef.current,
    });

    timerRef.current = timer;

    const restart = useCallback(() => {
        stepRef.current = 0;
        setStep(0);
        timerRef.current?.stop();
        runStep();
    }, [runStep]);

    useEffect(() => {
        stepRef.current = 0;
        setStep(0);
        timerRef.current?.stop();
        if (!sourceText && plan.totalSteps <= 1) return;
        runStep();
        return () => timerRef.current?.stop();
    }, [sourceText, variant, resolvedDuration, plan.refreshTime, plan.totalSteps, loop, runStep]);

    const frame = useMemo(
        () =>
            animation.getFrame({
                text: sourceText,
                step,
                plan,
                duration: resolvedDuration,
                color,
                typoProps,
            }),
        [animation, sourceText, step, plan, resolvedDuration, color, typoProps],
    );

    const isComplete = step >= plan.totalSteps - 1;

    return {
        frame,
        step,
        plan,
        sourceText,
        resolvedDuration,
        isComplete,
        isRunning: timer.isRunning,
        restart,
        stop: timer.stop,
        start: timer.start,
    };
};

export default useAnimations;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { getTimersSnapshot, useTimer } from ".";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { baseStore } from "../baseStore";
import { notifier } from "../notifier";

const X = () => {
    const { ticks, set } = baseStore.useLocal({ ticks: 0 });
    const timer = useTimer({
        timerName: "demoTimer",
        refreshTime: 2000,
        loop: true,
        onStart: () => notifier.add("timer started"),
        onEnd: () => {
            notifier.add("timer cycle ended");
            set((s) => {
                s.ticks += 1;
            });
        },
    });

    return (
        <Ds.page
            title="useTimer()"
            releasedOn="1.0.0"
            description="Controllable timer hook with loop and registry support."
        >
            <Ds.block
                title="Start/Stop Loop Timer"
                description="onStart and onEnd fire notifier toasts on each cycle. refreshTime is 2000ms so the callbacks are easy to observe."
                code={`import { useTimer } from "${SYS.basePath}";
                       import { notifier } from "${SYS.basePath}";

                       const { start, stop, isRunning } = useTimer({
                       refreshTime: 2000,
                       loop: true,
                       onStart: () => notifier.add("timer started"),
                       onEnd: () => notifier.add("timer cycle ended"),
                       });`}
                example={
                    <Flex.column gap={8}>
                        <Flex gap={8}>
                            <Button label="Start" onClick={() => timer.start()} />
                            <Button label="Stop" onClick={() => timer.stop()} />
                        </Flex>
                        <Typo.span>{`isRunning: ${String(timer.isRunning)}`}</Typo.span>
                        <Typo.span>{`ticks: ${ticks}`}</Typo.span>
                        <Typo.span>{`registry size: ${getTimersSnapshot().length}`}</Typo.span>
                    </Flex.column>
                }
            />
            <Ds.api
                disableLastBlock
                args="const { start, stop, isRunning, timerId, timerName, refreshTime } = useTimer({ loop, onEnd, onStart, refreshTime, startOnLoad, timerName });"
                props={{
                    onStart: {
                        description: "Called when timer starts.",
                        type: "fn",
                    },
                    onEnd: {
                        description: "Called when timer cycle ends.",
                        type: "fn",
                    },
                    refreshTime: {
                        description: "Timer duration in ms.",
                        type: "number",
                        defaultValue: "1000",
                    },
                    loop: {
                        description: "Restarts automatically.",
                        type: "boolean",
                        defaultValue: "true",
                    },
                    startOnLoad: {
                        description: "Starts on mount.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    timerName: {
                        description: "Optional stable timer id/name.",
                        type: "string",
                        defaultValue: "generated",
                    },
                }}
                returnProps={{
                    start: {
                        description: "Starts or restarts the timer.",
                        type: "fn",
                    },
                    stop: { description: "Stops the timer.", type: "fn" },
                    isRunning: { description: "True while the timer is active.", type: "boolean" },
                    timerId: { description: "Stable timer id ref.", type: "ref" },
                    timerName: { description: "Timer name or id ref.", type: "ref | string" },
                    refreshTime: { description: "Current refresh interval ref (ms).", type: "ref" },
                }}
            />
            <Ds.api
                title="start"
                args="start({ refreshTime, loop });"
                props={{
                    refreshTime: {
                        description:
                            "Optional interval in milliseconds. When provided, overrides the hook's refreshTime setting for this run.",
                        type: "number",
                    },
                    loop: {
                        description:
                            "Optional. When provided, overrides the hook's loop setting for this run.",
                        type: "boolean",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

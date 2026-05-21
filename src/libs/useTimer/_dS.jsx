import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { getTimersSnapshot, useTimer } from ".";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { baseStore } from "../@baseStore";

const X = () => {
    const { ticks, setLocal } = baseStore.useLocal({ ticks: 0 });
    const timer = useTimer({
        timerName: "demoTimer",
        refreshTime: 700,
        loop: true,
        onEnd: () =>
            setLocal((s) => {
                s.ticks += 1;
            }),
    });

    return (
        <Ds.page
            title="useTimer()"
            releasedOn="1.0.0"
            description="Controllable timer hook with loop and registry support."
        >
            <Ds.block
                title="Start/Stop Loop Timer"
                code={`import { useTimer } from "${SYS.basePath}";

const { start, stop, isRunning } = useTimer({
    refreshTime: 700,
    loop: true,
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
                args="const { start, stop, isRunning, timerId, timerName, refreshTime } = useTimer({ loop, onEnd, onStart, refreshTime, startOnLoad, timerName });"
                props={{
                    onStart: {
                        description: "Called when timer starts.",
                        type: "function",
                    },
                    onEnd: {
                        description: "Called when timer cycle ends.",
                        type: "function",
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
                    start: { description: "Starts or restarts the timer.", type: "function" },
                    stop: { description: "Stops the timer.", type: "function" },
                    isRunning: { description: "True while the timer is active.", type: "boolean" },
                    timerId: { description: "Stable timer id ref.", type: "ref" },
                    timerName: { description: "Timer name or id ref.", type: "ref | string" },
                    refreshTime: { description: "Current refresh interval ref (ms).", type: "ref" },
                }}
            />
        </Ds.page>
    );
};

export default X;

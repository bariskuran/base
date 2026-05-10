import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { getTimersSnapshot, useTimer } from ".";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { useState } from "react";

const Demo = () => {
    const [ticks, setTicks] = useState(0);
    const timer = useTimer({
        timerName: "demoTimer",
        refreshTime: 700,
        loop: true,
        onEnd: () => setTicks((v) => v + 1),
    });

    return (
        <Flex.column gap={8}>
            <Flex gap={8}>
                <Button label="Start" onClick={() => timer.start()} />
                <Button label="Stop" onClick={() => timer.stop()} />
            </Flex>
            <Typo.span>{`isRunning: ${String(timer.isRunning)}`}</Typo.span>
            <Typo.span>{`ticks: ${ticks}`}</Typo.span>
            <Typo.span>{`registry size: ${getTimersSnapshot().length}`}</Typo.span>
        </Flex.column>
    );
};

const X = () => (
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
            example={<Demo />}
        />
        <Ds.api
            args="useTimer({ onStart, onEnd, refreshTime, loop, startOnLoad, timerName });"
            returns="Timer controls: start, stop, isRunning, timerId, timerName, refreshTime (plus module helpers getTimersSnapshot, subscribeTimers, getTimer)."
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
        />
    </Ds.page>
);

export default X;

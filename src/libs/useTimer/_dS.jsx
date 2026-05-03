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
        <Flex.column xAlign="start" gap={8}>
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
        title="<useTimer>"
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
            props={{
                settings: {
                    description: "Timer options.",
                    type: "object",
                    required: false,
                    defaultValue: "{}",
                },
                "settings.onStart": {
                    description: "Called when timer starts.",
                    type: "function",
                    required: false,
                    defaultValue: "undefined",
                },
                "settings.onEnd": {
                    description: "Called when timer cycle ends.",
                    type: "function",
                    required: false,
                    defaultValue: "undefined",
                },
                "settings.refreshTime": {
                    description: "Timer duration in ms.",
                    type: "number",
                    required: false,
                    defaultValue: "1000",
                },
                "settings.loop": {
                    description: "Restarts automatically.",
                    type: "boolean",
                    required: false,
                    defaultValue: "true",
                },
                "settings.startOnLoad": {
                    description: "Starts on mount.",
                    type: "boolean",
                    required: false,
                    defaultValue: "false",
                },
                "settings.timerName": {
                    description: "Optional stable timer id/name.",
                    type: "string",
                    required: false,
                    defaultValue: "generated",
                },
                return: {
                    description: "{ start, stop, isRunning, timerId, timerName, refreshTime }",
                    type: "object",
                    required: true,
                    defaultValue: "computed",
                },
                "start(overrides)": {
                    description: "Starts timer with optional overrides.",
                    type: "({refreshTime?:number, loop?:boolean}) => void",
                    required: true,
                    defaultValue: "function",
                },
                stop: {
                    description: "Stops timer.",
                    type: "() => void",
                    required: true,
                    defaultValue: "function",
                },
                subscribeTimers: {
                    description: "Subscribes registry snapshot updates.",
                    type: "(listener)=>unsubscribe",
                    required: false,
                    defaultValue: "exported helper",
                },
                getTimersSnapshot: {
                    description: "Returns timer registry snapshot array.",
                    type: "() => object[]",
                    required: false,
                    defaultValue: "exported helper",
                },
                getTimer: {
                    description: "Gets timer meta by id or name.",
                    type: "(idOrName)=>object|null",
                    required: false,
                    defaultValue: "exported helper",
                },
            }}
        />
    </Ds.page>
);

export default X;

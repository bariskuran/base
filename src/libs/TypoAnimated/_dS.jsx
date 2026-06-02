import { useState } from "react";
import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { TypoAnimated } from ".";
import { animationIds } from "./tools/animationRegistry";
import { autoDuration } from "./tools/autoDuration";
import { Typo } from "../Typo";
import { Flex } from "../Flex";
import { Button } from "../Button";
import { Dropdown } from "../Dropdown";

const shortText = "Lorem ipsum";
const longText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud.";

const multilineText = `Design system
Typo animated
scatter lines`;

const stackedSample = `A Swiss Legend
—old as time—
a fire breathing serpent
with the head of a cat`;

const durationOptions = [
    { label: "auto", value: "auto" },
    { label: "600", value: 600 },
    { label: "1200", value: 1200 },
    { label: "2400", value: 2400 },
    { label: "4000", value: 4000 },
    { label: "6000", value: 6000 },
    { label: "8000", value: 8000 },
];

const loopOptions = [
    { label: "true", value: true },
    { label: "false", value: false },
];

const letterDemoColors = { bgColor: "foreground", color: "background" };

const Demo = ({
    variant,
    durationMs,
    loop,
    replayKey,
    sample,
    typoProps = {},
    boxed = false,
}) => {
    const anim = (
        <TypoAnimated
            key={`${variant}-${durationMs ?? "auto"}-${loop}-${replayKey}`}
            variant={variant}
            loop={loop}
            {...(durationMs != null ? { duration: durationMs } : {})}
            content={sample}
            useTimerProps={{ timerName: `typoAnim-${variant}-${sample}` }}
            {...typoProps}
            {...(boxed ? { color: letterDemoColors.color } : {})}
        />
    );

    if (!boxed) return anim;

    return (
        <Flex padding={12} bgColor={letterDemoColors.bgColor}>
            {anim}
        </Flex>
    );
};

const X = () => {
    const [durationMs, setDurationMs] = useState("auto");
    const [loop, setLoop] = useState(true);
    const [replayKey, setReplayKey] = useState(0);

    const bumpReplay = () => setReplayKey((k) => k + 1);

    const resolvedDurationProp =
        durationMs === "auto" ? undefined : durationMs;

    const demoProps = {
        durationMs: resolvedDurationProp,
        loop,
        replayKey,
    };

    return (
        <Ds.page
            title="<TypoAnimated>"
            releasedOn="1.0.0"
            description="Text animations on top of Typo and useTimer. See the Typo and useTimer docs for typography props, timer naming, and lifecycle hooks. Omit duration to use autoDuration (length- and variant-based). Pick a variant for the animation module."
        >
            <Ds.block
                title="Controls"
                example={
                    <Flex gap={20} wrap alignItems="flex-end">
                        <Flex.column gap={6} minWidth={160}>
                            <Typo.span content="durationMs" />
                            <Dropdown
                                options={durationOptions}
                                value={durationMs}
                                sortBy="none"
                                onChange={(v) => {
                                    setDurationMs(v);
                                    bumpReplay();
                                }}
                            />
                        </Flex.column>
                        <Flex.column gap={6} minWidth={120}>
                            <Typo.span content="loop" />
                            <Dropdown
                                options={loopOptions}
                                value={loop}
                                sortBy="none"
                                onChange={(v) => {
                                    setLoop(v);
                                    bumpReplay();
                                }}
                            />
                        </Flex.column>
                        <Button.plain label="Replay all" onClick={bumpReplay} />
                    </Flex>
                }
            />

            <Ds.block
                title="typewriter"
                description={`Short text reveals letter by letter (~55ms/char auto). Long text uses chunked steps. Auto for "${shortText}": ${autoDuration("typewriter", shortText)}ms.`}
                code={`import { TypoAnimated } from "${SYS.basePath}";

                       <TypoAnimated variant="typewriter" content="Lorem ipsum" />
                       <TypoAnimated variant="typewriter" duration={4000} content={longText} />`}
                example={
                    <Flex.column gap={24}>
                        <Demo variant="typewriter" sample={shortText} boxed {...demoProps} />
                        <Demo variant="typewriter" sample={longText} boxed {...demoProps} />
                    </Flex.column>
                }
            />

            <Ds.block
                title="scrambleReveal"
                description='Same length throughout: random letters first, then they resolve left to right.'
                code={`import { TypoAnimated } from "${SYS.basePath}";

                       <TypoAnimated variant="scrambleReveal" content="Lorem ipsum" />`}
                example={
                    <Demo variant="scrambleReveal" sample={shortText} boxed {...demoProps} />
                }
            />

            <Ds.block
                title="animatedWriter"
                description="Like typewriter, but each new character drops ~4px from above and fades in."
                code={`import { TypoAnimated } from "${SYS.basePath}";

                       <TypoAnimated variant="animatedWriter" content="Lorem ipsum" />`}
                example={
                    <Demo variant="animatedWriter" sample={shortText} boxed {...demoProps} />
                }
            />

            <Ds.block
                title="scatterLines"
                description="Multi-line content; words fade in (opacity) with font-size between 80–120%. Full layout is reserved from the start."
                code={`import { TypoAnimated } from "${SYS.basePath}";

                       <TypoAnimated
                        variant="scatterLines"
                        content={\`line one\\nline two\`}
                        color="foreground"
                       />`}
                example={
                    <Flex.column gap={8} padding={12} bgColor="greys.shade30">
                        <Demo variant="scatterLines" sample={multilineText} {...demoProps} />
                    </Flex.column>
                }
            />

            <Ds.block
                title="stackedWords"
                description="Poster-style stacked lines: all words pulse in sync for duration/2, pause for duration/2, then restart with new random font-size/opacity targets. loop defaults to true."
                code={`import { TypoAnimated } from "${SYS.basePath}";

                       <TypoAnimated
                        variant="stackedWords"
                        loop
                        content={\`A Swiss Legend\\n—old as time—\`}
                        size={22}
                        weight={700}
                       />`}
                example={
                    <Flex.column gap={8} padding={12} bgColor="greys.shade30">
                        <Demo
                            variant="stackedWords"
                            sample={stackedSample}
                            typoProps={{ size: 22, weight: 700 }}
                            {...demoProps}
                        />
                    </Flex.column>
                }
            />

            <Ds.api
                args="<TypoAnimated />"
                props={{
                    variant: {
                        description: `Animation id: ${animationIds.map((id) => `"${id}"`).join(" | ")}.`,
                        type: "string",
                        defaultValue: '"typewriter"',
                    },
                    duration: {
                        description:
                            "Total animation time in ms. Omit for autoDuration (variant + text length). Letter variants ~55–70ms/step; word variants ~200ms/word.",
                        type: "number",
                        defaultValue: "autoDuration",
                    },
                    loop: {
                        description:
                            "When true, the animation restarts from the beginning after it finishes. Not useTimer.loop — the timer always ticks once per step.",
                        type: "boolean",
                        defaultValue: "true",
                    },
                    useTimerProps: {
                        description:
                            "Forwarded to useTimer (refreshTime per step is managed by the animation). See useTimer for timerName, startOnLoad, and callbacks. Do not pass loop here.",
                        type: "object",
                        defaultValue: "{}",
                    },
                    "...rest": {
                        description:
                            "All remaining props are forwarded to Typo unchanged (size, weight, color, lineHeight, clamp, copy, etc.).",
                        type: "Typo props",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

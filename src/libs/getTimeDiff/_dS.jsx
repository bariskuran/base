import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { getTimeDiff } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";

const fixedEpoch = 1700000000000;
const fixedLater = fixedEpoch + 36 * 60 * 60 * 1000;

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    return (
        <Ds.page
            title="getTimeDiff()"
            releasedOn="1.0.0"
            description={
                <>
                    <Typo.p>
                        Calculates the difference between two given dates in all units, returning
                        both total and breakdown values.
                    </Typo.p>
                    <Typo.p>The order of the dates does not matter.</Typo.p>
                    <Typo.p>
                        Dates can be provided as a Date(), a baseDate object, or a timestamp. The
                        baseDate object is an in-house function with additional features. For
                        details on the baseDate object, see the{" "}
                        <Button.string to="/design-system/baseDate" label="baseDate()" /> section.
                    </Typo.p>
                </>
            }
        >
            <Ds.block
                title="Basic usage"
                description="getTimeDiff basicly compares two dates and returns the difference in different units and breakdowns."
                code={`import { getTimeDiff } from "${SYS.basePath}";

                        getTimeDiff("1700000000000", 1700000000000 + 3600000);
                        getTimeDiff({ initial: "28/03/1982" });
                        getTimeDiff(new Date(1700000000000));
                    `}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} full>
                            <Button.plain
                                label="ts"
                                {...outputButtonProps({
                                    path: "block1",
                                    activeLabel: "ts",
                                    fn: getTimeDiff("1700000000000", 1700000000000 + 3600000),
                                })}
                            />
                            <Button.plain
                                label="baseDate obj to now"
                                {...outputButtonProps({
                                    path: "block1",
                                    activeLabel: "baseDate",
                                    fn: getTimeDiff({ initial: "28/03/1982" }),
                                })}
                            />
                            <Button.plain
                                label="Date() to now"
                                {...outputButtonProps({
                                    path: "block1",
                                    activeLabel: "Date",
                                    fn: getTimeDiff(new Date(1700000000000)),
                                })}
                            />
                        </Flex>
                        <Output path="block1" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Primitives (ms, Date)"
                code={`import { getTimeDiff } from "${SYS.basePath}";

                        const a = Date.now();
                        const b = a + 1000 * 60 * 60 * 26 + 3500;

                        getTimeDiff(a, b);
                        getTimeDiff(new Date(a), new Date(b));`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Flex gap={10}>
                            <Button.plain
                                label="two numbers (~26h gap)"
                                {...outputButtonProps({
                                    path: "primitives",
                                    activeLabel: "numbers",
                                    fn: () =>
                                        getTimeDiff(
                                            fixedEpoch,
                                            fixedEpoch + 1000 * 60 * 60 * 26 + 3500,
                                        ),
                                })}
                            />
                            <Button.plain
                                label="two Date instances"
                                {...outputButtonProps({
                                    path: "primitives",
                                    activeLabel: "dates",
                                    fn: () => {
                                        const a = new Date(fixedEpoch);
                                        const b = new Date(fixedEpoch + 86400000);
                                        return getTimeDiff(a, b);
                                    },
                                })}
                            />
                        </Flex>
                        <Output path="primitives" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="One argument → compare to now"
                code={`import { getTimeDiff } from "${SYS.basePath}";

                        getTimeDiff(Date.now() - 3600000);
                        getTimeDiff({ initial: "01/01/2020" });`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="single ms"
                                {...outputButtonProps({
                                    path: "one-argument",
                                    activeLabel: "ms",
                                    fn: () => getTimeDiff(fixedEpoch - 3600000),
                                })}
                            />
                            <Button.plain
                                label="single object (past date)"
                                {...outputButtonProps({
                                    path: "one-argument",
                                    activeLabel: "object",
                                    fn: () =>
                                        getTimeDiff({
                                            initial: { year: 2020, month: 1, day: 1 },
                                        }),
                                })}
                            />
                        </Flex>
                        <Output path="one-argument" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="baseDate-style objects"
                description="Example: both sides as objects. Optional format controls time1.date / time2.date strings."
                code={`import { getTimeDiff } from "${SYS.basePath}";

                        getTimeDiff(
                            {
                                initial: 1700000000000,
                                format: "|DD|/|MM|/|YYYY| |HH|:|NN|",
                            },
                            {
                                initial: 1700086400000,
                                format: "|DD|/|MM|/|YYYY|",
                            },
                        );

                        getTimeDiff(
                            { initial: "10/03/2024", calculate: { day: 5 } },
                            { initial: "20/03/2024" },
                        );`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="two objects + display formats"
                                {...outputButtonProps({
                                    path: "baseDate-objects",
                                    activeLabel: "formats",
                                    fn: () =>
                                        getTimeDiff(
                                            {
                                                initial: 1700000000000,
                                                format: "|DD|/|MM|/|YYYY| |HH|:|NN|",
                                            },
                                            {
                                                initial: 1700086400000,
                                                format: "|DD|/|MM|/|YYYY|",
                                            },
                                        ),
                                })}
                            />
                            <Button.plain
                                label="calculate on initial"
                                {...outputButtonProps({
                                    path: "baseDate-objects",
                                    activeLabel: "calculate",
                                    fn: () =>
                                        getTimeDiff(
                                            {
                                                initial: "10/03/2024",
                                                calculate: { day: 5 },
                                            },
                                            { initial: "20/03/2024" },
                                        ),
                                })}
                            />
                        </Flex>
                        <Output path="baseDate-objects" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="in (fractional) vs breakdown (calendar)"
                description="in spreads |tsDiff| across averaged units (e.g. inYears uses 365.25-day years). breakdown walks UTC from the earlier instant: full years, then months (never ≥12 before years roll), then days in month, then clock fields. Zeros omitted."
                code={`import { getTimeDiff } from "${SYS.basePath}";

                        const a = 1700000000000;
                        const b = a + 36 * 60 * 60 * 1000;
                        getTimeDiff(a, b);`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Button.plain
                            label="exactly 36h apart (fixed ms)"
                            {...outputButtonProps({
                                path: "fractional-breakdown",
                                activeLabel: "36h",
                                fn: () => getTimeDiff(fixedEpoch, fixedLater),
                            })}
                        />
                        <Output path="fractional-breakdown" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="time1 / time2 & atTimeline"
                description="tsDiff = time2.ts − time1.ts. Each side includes atTimeline: position of that instant relative to the other (inPast / inFuture / sameInstant)."
                code={`import { getTimeDiff } from "${SYS.basePath}";

                        getTimeDiff(1000, 2000);
                        getTimeDiff(2000, 1000);
                        getTimeDiff(42, 42);`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="time1 before time2"
                                {...outputButtonProps({
                                    path: "timeline",
                                    activeLabel: "before",
                                    fn: () => getTimeDiff(1000, 2000),
                                })}
                            />
                            <Button.plain
                                label="time1 after time2"
                                {...outputButtonProps({
                                    path: "timeline",
                                    activeLabel: "after",
                                    fn: () => getTimeDiff(2000, 1000),
                                })}
                            />
                            <Button.plain
                                label="same instant"
                                {...outputButtonProps({
                                    path: "timeline",
                                    activeLabel: "same",
                                    fn: () => getTimeDiff(42, 42),
                                })}
                            />
                        </Flex>
                        <Output path="timeline" />
                    </Flex.column>
                }
            />
            <Ds.api
                args="getTimeDiff(time1, time2?);"
                returns="Compare result with snapshots, signed gap, fractional spans (in), and UTC calendar breakdown."
                props={{
                    time1: {
                        description:
                            "Unix ms, numeric string (ms, validated with isNumber then coerced), Date, or plain object for baseDate (optional format only affects returned date string).",
                        type: "number | string | Date | object",
                        required: true,
                    },
                    time2: {
                        description:
                            "Same shapes as time1. If omitted, the other side is Date.now().",
                        type: "number | string | Date | object",
                    },
                }}
                returnProps={{
                    time1: {
                        description:
                            "First argument snapshot: ts, dateObj, date (baseDate-formatted), atTimeline vs time2.",
                        type: "object",
                    },
                    time2: {
                        description:
                            "Second argument snapshot (or now): ts, dateObj, date, atTimeline vs time1.",
                        type: "object",
                    },
                    tsDiff: {
                        description: "Signed milliseconds: time2.ts − time1.ts.",
                        type: "number",
                    },
                    in: {
                        description:
                            "Scaled |tsDiff| (inYears = 365.25d year). Half-up: |x|≥1 or (0<|x|<1 with first fractional digit ≠0) → 2 fixed decimals; if fractional part starts with 0 before first non-zero → 2 significant digits (e.g. 0.0000012). inMilliseconds integer. Omits zeros.",
                        type: "object",
                    },
                    breakdown: {
                        description:
                            "UTC calendar slice: year, month (0–11 added steps), day, hour, minute, second, millisecond from earlier ts toward later. Omits zeros.",
                        type: "object",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

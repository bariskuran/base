import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { getTimeDiff } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { baseDate } from "../@baseDate";

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
                        Dates can be provided as a Date(), a baseDate object, a timestamp number,
                        purely numeric timestamp strings, or other date strings that{" "}
                        <Button.string to="/design-system/baseDate" label="baseDate()" /> can parse.
                    </Typo.p>
                    <Typo.p>
                        <b>breakdown</b> (year, month, day, hour, …) is counted on the <b>UTC</b>{" "}
                        calendar between the two instants, not on your local wall-clock calendar.
                        For labels in a chosen timezone, use 'time1.date' / 'time2.date' (from{" "}
                        <Button.string to="/design-system/baseDate" label="baseDate()" />
                        ). ts and tsDiff are always plain epoch milliseconds (timezone-agnostic).
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
                        <Flex gap={10} full wrap>
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
                title="ts, Date and baseDate equality comparison"
                code={`import { getTimeDiff } from "${SYS.basePath}";

                        const msValue = 1000 * 60 * 60 * 26 + 3500;

                        const a = Date.now();
                        const c = a + msValue;
                        const d = baseDate({
                            initial: a,
                            calc: { millisecond: msValue },
                            format: "timestamp",
                        });

                        const r1 = getTimeDiff(a, c);
                        const r2 = getTimeDiff(new Date(a), new Date(c));
                        const r3 = getTimeDiff(String(a), String(c));
                        const r4 = getTimeDiff(a, d);

                        // r1, r2, r3, r4 → same tsDiff
                        `}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10}>
                            <Button.plain
                                label="equality comparison"
                                {...outputButtonProps({
                                    path: "primitives",
                                    activeLabel: "r1",
                                    fn: () => {
                                        const GAP = 1000 * 60 * 60 * 26 + 3500;
                                        // eslint-disable-next-line react-hooks/purity
                                        const a = Date.now();
                                        const c = a + GAP;
                                        const d = baseDate({
                                            initial: a,
                                            calc: { millisecond: GAP },
                                            format: "timestamp",
                                        });

                                        const r1 = getTimeDiff(a, c).tsDiff;
                                        const r2 = getTimeDiff(new Date(a), new Date(c)).tsDiff;
                                        const r3 = getTimeDiff(String(a), String(c)).tsDiff;
                                        const r4 = getTimeDiff(a, d).tsDiff;

                                        return {
                                            r1,
                                            r2,
                                            r3,
                                            r4,
                                            equal: r1 === r2 && r2 === r3 && r3 === r4,
                                        };
                                    },
                                })}
                            />
                        </Flex>
                        <Output path="primitives" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Usage with a single argument"
                description="The single argument is compared to 'now'."
                code={`import { getTimeDiff } from "${SYS.basePath}";

                        getTimeDiff(Date.now() - 3600000);
                        getTimeDiff({ initial: "01/01/2020" });`}
                example={
                    <Flex.column gap={10} padding={10} full>
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
                                            calc: { hour: -1 },
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
                                format: "|YY|/|MM|/|DD|",
                            },
                        );

                        getTimeDiff(
                            { initial: "10/03/2024", calc: { day: 5 } },
                            { initial: "20/03/2024" },
                        );`}
                example={
                    <Flex.column gap={10} padding={10} full>
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
                                                format: "|YY|/|MM|/|DD|",
                                            },
                                        ),
                                })}
                            />
                            <Button.plain
                                label="calc on initial"
                                {...outputButtonProps({
                                    path: "baseDate-objects",
                                    activeLabel: "calc",
                                    fn: () =>
                                        getTimeDiff(
                                            {
                                                initial: "10/03/2024",
                                                calc: { day: 5 },
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
                description="in spreads |tsDiff| across averaged units (e.g. inYears uses 365.25-day years). breakdown walks the UTC calendar from the earlier instant: full years, then months (never ≥12 before years roll), then days in month, then clock fields — not the local (IANA) calendar. Zeros omitted."
                code={`import { getTimeDiff } from "${SYS.basePath}";

                        const a = 1700000000000;
                        const b = a + 36 * 60 * 60 * 1000;
                        getTimeDiff(a, b);`}
                example={
                    <Flex.column gap={10} padding={10} full>
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
                description="tsDiff = |time2.ts − time1.ts| (always ≥ 0). Each side includes atTimeline: position of that instant relative to the other (inPast / inFuture / sameInstant)."
                code={`import { getTimeDiff } from "${SYS.basePath}";

                        getTimeDiff(1000, 2000);
                        getTimeDiff(2000, 1000);
                        getTimeDiff(42, 42);`}
                example={
                    <Flex.column gap={10} padding={10} full>
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
                args="const diff = getTimeDiff(time1, time2);"
                props={{
                    time1: {
                        description:
                            "Unix ms, numeric string (ms, validated with isNumber then coerced), Date, or plain object for baseDate (optional format only affects returned date string).",
                        type: "number | string | Date | object",
                        required: true,
                    },
                    time2: {
                        description: "Same shapes as time1. If omitted, the other side is 'now'.",
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
                        description:
                            "Non-negative milliseconds: |time2.ts − time1.ts|. Order: see time1/time2 atTimeline.",
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

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { baseStore } from "../baseStore";
import { baseDate, getNow } from ".";

const X = () => {
    const [_baseDate] = baseStore.useGlobal((s) => [s._baseDate]);
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    return (
        <Ds.page
            title="baseDate()"
            releasedOn="1.0.0"
            description={`
                Creates a Date (or timestamp) from multiple input shapes, with flexible formatting and dateCalculations.
                `}
        >
            <Ds.block
                title="How to Setup"
                code={`
                       • All _baseDate sys defaults are located at 'constants.DATE_DEFAULTS'
                       • Sys defaults are merged and overriden with 'PROJECT_SETTINGS._baseDateSettings'.

                        PROJECT_SETTINGS.baseDateSettings: {
                            defaultFormat: "|DD|-|MM|-|YYYY|",
                            timezone: "UTC",
                            firstDayOfWeek: 1, // 1 = monday
                        }

                       • Current defaultFormat is "${_baseDate.defaultFormat}"
                       • Current timezone is "${_baseDate.timezone}"
                       • Current firstDayOfWeek is "${_baseDate.firstDayOfWeek}"
`}
            />
            <Ds.block
                title="Format mapping"
                code={`
                       YYYY = year, 4 digits
                       YY = year, last 2 digits

                       MM = month, 2 digits (zero-padded)
                       mm = month, 1–2 digits (no leading zero)
                       OO = month name, long (locale)
                       oo = month name, short (locale)

                       DD = day of month, 2 digits (zero-padded)
                       dd = day of month, 1–2 digits (no leading zero)

                       AA = weekday name, long (locale)
                       aa = weekday name, short (locale; length depends on locale, not fixed)

                       HH = hour, 24h, 2 digits (00–23)
                       hh = hour, 24h, string without padding (0–23)

                       ZZ = hour, 12h, 2 digits (01–12)
                       zz = hour, 12h, string without padding (1–12)

                       AP = AM/PM uppercase (only if format uses ZZ/zz and does not use HH/hh)
                       ap = am/pm lowercase (same rule as AP)

                       NN = minutes, 2 digits
                       nn = minutes, string without padding

                       SS = seconds, 2 digits
                       ss = seconds, string without padding

                       LL = milliseconds, 3 digits (padded)
                       ll = milliseconds, string without padding
`}
            />
            <Ds.block
                title="Formatting for the output and initial value"
                description={`
                    format="timestamp" -> returns timestamp

                    Wrap tokens as |TOKEN| when the plain string could be ambiguous. Any kind of string can be used. Such as:
                    "|DD|/|MM|/|YYYY|" -> 28/03/1982
                    "|DD|-|MM|-|YYYY|" -> 28-03-1982
                    "I was born on |YYYY|. The month was |MM|. And the day was |DD|." -> I was born on 1982. The month was 3. And the day was 28.
                    `}
                code={`import { baseDate } from "${SYS.basePath}";

                        baseDate({ initial: "19-02-2026 17:00", format: "timestamp" });
                        baseDate({ initial: "28-03-1982 01:15", initialFormat: "|DD|-|MM|-|YYYY| |HH|:|NN|", format: "|DD|.|mm|.|YY| |hh|.|nn|", });
                        baseDate({ initial: "28-03-1982 01:15", initialFormat: "|DD|-|MM|-|YYYY| |HH|:|NN|", format: "I was born on |YYYY|. The month was |MM|. And the day was |DD|.", });

`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="returns timestamp"
                                {...outputButtonProps({
                                    path: "formatting",
                                    activeLabel: "timestamp",
                                    fn: () =>
                                        baseDate({
                                            initial: "19-02-2026 17:00",
                                            format: "timestamp",
                                        }),
                                })}
                            />
                            <Button.plain
                                label="formatting for the initial value"
                                {...outputButtonProps({
                                    path: "formatting",
                                    activeLabel: "initial-format",
                                    fn: () =>
                                        baseDate({
                                            initial: "28-03-1982 01:15",
                                            initialFormat: "|DD|-|MM|-|YYYY| |HH|:|NN|",
                                            format: "|DD|.|mm|.|YY| |hh|.|nn|",
                                        }),
                                })}
                            />
                            <Button.plain
                                label="free-form format usage"
                                {...outputButtonProps({
                                    path: "formatting",
                                    activeLabel: "free-form",
                                    fn: () =>
                                        baseDate({
                                            initial: "28-03-1982 01:15",
                                            initialFormat: "|DD|-|MM|-|YYYY| |HH|:|NN|",
                                            format: "I was born on |YYYY|. The month was |MM|. And the day was |DD|.",
                                        }),
                                })}
                            />
                        </Flex>
                        <Output path="formatting" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Basic usage"
                code={`import { baseDate, getNow } from "${SYS.basePath}";


                        baseDate({});
                        getNow({ format: "|DD|/|MM|/|YYYY| |HH|:|NN|", timezone: "Europe/London" });
                        baseDate({ initial: 1700000000000 });
                        baseDate({ initial: "19-02-2026" });
                        baseDate({ initial: "02/02/2026 17.00", initialFormat: "|MM|/|DD|/|YYYY| |HH|.|NN|"});
                        baseDate({ initial: { year: 2026, month: 2, day: 19, hour: 17, minute: 0 }});
`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="Get 'Now' via baseDate({})"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "now",
                                    fn: () => baseDate({}),
                                })}
                            />
                            <Button.plain
                                label="Get 'Now' with format"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "now2",
                                    fn: () => baseDate({ format: "|DD|/|MM|/|YYYY| |HH|:|NN|" }),
                                })}
                            />
                            <Button.plain
                                label="getNow shorthand"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "getNow",
                                    fn: () =>
                                        getNow({
                                            format: "|DD|/|MM|/|YYYY| |HH|:|NN|",
                                            timezone: "Europe/London",
                                        }),
                                })}
                            />
                            <Button.plain
                                label="Initial Value: Timestamp"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "timestamp",
                                    fn: () => baseDate({ initial: 1700000000000 }),
                                })}
                            />
                            <Button.plain
                                label="Initial Value: String, compatible with current format."
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "string-compatible",
                                    fn: () => baseDate({ initial: "19-02-2026" }),
                                })}
                            />
                            <Button.plain
                                label="Initial Value: String, incompatible with current format."
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "string-incompatible",
                                    fn: () =>
                                        baseDate({
                                            initial: "2026/02/19 17.00",
                                            initialFormat: "|YYYY|/|MM|/|DD| |HH|.|NN|",
                                        }),
                                })}
                            />
                            <Button.plain
                                label="Initial Value: Object"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "object",
                                    fn: () =>
                                        baseDate({
                                            initial: {
                                                year: 1984,
                                                month: 8,
                                                day: 5,
                                                hour: 12,
                                                minute: 30,
                                            },
                                            format: "|DD|-|MM|-|YYYY| |HH|:|NN|",
                                        }),
                                })}
                            />
                        </Flex>
                        <Output path="basic" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Timezone usage"
                description={`It is possible to use any IANA timezone name or a numeric offset like "+02:00".`}
                code={`import { baseDate } from "${SYS.basePath}";

                        baseDate({ timezone: "Europe/London", format: "|DD|/|MM|/|YYYY| |HH|:|NN|", });
                        baseDate({ timezone: "+02:00", format: "|DD|/|MM|/|YYYY| |HH|:|NN|", });
`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="returns London time"
                                {...outputButtonProps({
                                    path: "timezone",
                                    activeLabel: "london",
                                    fn: () =>
                                        baseDate({
                                            timezone: "Europe/London",
                                            format: "|DD|/|MM|/|YYYY| |HH|:|NN|",
                                        }),
                                })}
                            />
                            <Button.plain
                                label="returns given timezone: +2"
                                {...outputButtonProps({
                                    path: "timezone",
                                    activeLabel: "offset",
                                    fn: () =>
                                        baseDate({
                                            timezone: "+02:00",
                                            format: "|DD|/|MM|/|YYYY| |HH|:|NN|",
                                        }),
                                })}
                            />
                        </Flex>
                        <Output path="timezone" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Calculations"
                description={
                    <Flex.column gap={14}>
                        <Typo.span balance>
                            One of the best features of baseDate is its versatility: with a single
                            function, you can both format the current date/time and change the
                            timezone, as well as perform date calculations via a straightforward{" "}
                            <code>calc</code> object.
                        </Typo.span>
                        <Flex.column gap={8}>
                            <Typo.span>
                                The <code>calc</code> object accepts positive or negative numeric
                                values as props — for example:
                            </Typo.span>
                            <Typo.code
                                codeFormat={false}
                            >{`{ year: 1 }     or     { year: -1 }`}</Typo.code>
                        </Flex.column>

                        <Flex.column gap={8}>
                            <Typo.span>
                                To make key naming more convenient, aliases can be used for each
                                property:
                            </Typo.span>
                            <Typo.code codeFormat={false}>{`• year / years / y
• month / months / m
• day / days / d
• hour / hours / h
• minute / minutes / min
• second / sec / s / seconds / secs
• millisecond / milliseconds / milisecond / ms`}</Typo.code>
                        </Flex.column>

                        <Typo.span balance>
                            Date calculations are performed using the UTC calendar. However, the
                            resulting date will be formatted according to the provided timezone.
                        </Typo.span>

                        <Typo.span balance>
                            For calculations, the <code>calc</code> object uses Gregorian calendar
                            logic for the most user-friendly and expected behavior, not strict
                            mathematical addition or subtraction. Therefore, results might differ
                            from what you&apos;d get using <code>Date.setMonth</code>.
                        </Typo.span>

                        <Flex.column gap={8}>
                            <Typo.span>The most notable examples:</Typo.span>
                            <Typo.code
                                codeFormat={false}
                            >{`• 31 March minus 1 month = 29 February (leap year)
• 31 March minus 1 month = 28 February (non-leap year)
• 29 March minus 1 month = 29 February (leap year)
• 29 March minus 1 month = 28 February (non-leap year)`}</Typo.code>
                        </Flex.column>
                    </Flex.column>
                }
                code={`import { baseDate } from "${SYS.basePath}";

                        baseDate({
                            calc: { day: 5 },
                            format: "|DD|/|MM|/|YYYY|"
                        });
                        baseDate({
                            initial: "10/03/2024",
                            calc: { day: -10 }
                        });
                        baseDate({
                            initial: "31/12/2023 23:30",
                            calc: {
                                year: 1,
                                month: -1,
                                day: 2,
                                hour: 1,
                                minute: -45
                            },
                            format: "|DD|/|MM|/|YYYY| |HH|:|NN|"
                        });
                        baseDate({
                            initial: "10/03/2024",
                            calc: "invalid",
                            format: "|DD|/|MM|/|YYYY|",
                        });
                        baseDate({ initial: "31/03/2024", calc: { month: -1 }, format: "|DD|/|MM|/|YYYY|" });
                        baseDate({ initial: "31/03/2023", calc: { month: -1 }, format: "|DD|/|MM|/|YYYY|" });
                        baseDate({ initial: "29/03/2024", calc: { month: -1 }, format: "|DD|/|MM|/|YYYY|" });
                        baseDate({
                            initial: { year: 2024, month: 6, day: 1, hour: 10, minute: 0 },
                            calc: { y: 1, m: -1, ms: 3600000 },
                            format: "|DD|/|MM|/|YYYY| |HH|:|NN|",
                        });
`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="adds 5 days to now"
                                {...outputButtonProps({
                                    path: "calculations",
                                    activeLabel: "add-days",
                                    fn: () =>
                                        baseDate({
                                            calc: { day: 5 },
                                            format: "|DD|/|MM|/|YYYY|",
                                        }),
                                })}
                            />
                            <Button.plain
                                label="subtracts 10 days from initial"
                                {...outputButtonProps({
                                    path: "calculations",
                                    activeLabel: "subtract-days",
                                    fn: () =>
                                        baseDate({
                                            initial: "10/03/2024",
                                            calc: { day: -10 },
                                        }),
                                })}
                            />
                            <Button.plain
                                label="advanced calculation object"
                                {...outputButtonProps({
                                    path: "calculations",
                                    activeLabel: "advanced",
                                    fn: () =>
                                        baseDate({
                                            initial: "31/12/2023 23:30",
                                            calc: {
                                                year: 1,
                                                month: -1,
                                                day: 2,
                                                hour: 1,
                                                minute: -45,
                                            },
                                            format: "|DD|/|MM|/|YYYY| |HH|:|NN|",
                                        }),
                                })}
                            />
                            <Button.plain
                                label="invalid calculation object"
                                {...outputButtonProps({
                                    path: "calculations",
                                    activeLabel: "invalid",
                                    fn: () =>
                                        baseDate({
                                            initial: "10/03/2024",
                                            calc: "invalid",
                                            format: "|DD|/|MM|/|YYYY|",
                                        }),
                                })}
                            />
                            <Button.plain
                                label="31Mar minus 1month (leapYear)"
                                {...outputButtonProps({
                                    path: "calc-calendar-clamp",
                                    activeLabel: "may31-minus3-leap",
                                    fn: () =>
                                        baseDate({
                                            initial: "31/03/2024",
                                            calc: { month: -1 },
                                            format: "|DD|/|MM|/|YYYY|",
                                        }),
                                })}
                            />
                            <Button.plain
                                label="31Mar minus 1month (non-leap)"
                                {...outputButtonProps({
                                    path: "calc-calendar-clamp",
                                    activeLabel: "may31-minus3-common",
                                    fn: () =>
                                        baseDate({
                                            initial: "31/03/2023",
                                            calc: { month: -1 },
                                            format: "|DD|/|MM|/|YYYY|",
                                        }),
                                })}
                            />
                            <Button.plain
                                label="29Mar minus 1month (leapYear)"
                                {...outputButtonProps({
                                    path: "calc-calendar-clamp",
                                    activeLabel: "may30-minus3-leap",
                                    fn: () =>
                                        baseDate({
                                            initial: "29/03/2024",
                                            calc: { month: -1 },
                                            format: "|DD|/|MM|/|YYYY|",
                                        }),
                                })}
                            />
                            <Button.plain
                                label="29Mar minus 1month (non-leap)"
                                {...outputButtonProps({
                                    path: "calc-calendar-clamp",
                                    activeLabel: "may30-minus3-common",
                                    fn: () =>
                                        baseDate({
                                            initial: "29/03/2023",
                                            calc: { month: -1 },
                                            format: "|DD|/|MM|/|YYYY|",
                                        }),
                                })}
                            />
                            <Button.plain
                                label="aliases: y, m, ms (+1h wall)"
                                {...outputButtonProps({
                                    path: "calc-alias-demo",
                                    activeLabel: "aliases",
                                    fn: () =>
                                        baseDate({
                                            initial: {
                                                year: 2024,
                                                month: 6,
                                                day: 1,
                                                hour: 10,
                                                minute: 0,
                                            },
                                            calc: { y: 1, m: -1, ms: 3_600_000 },
                                            format: "|DD|/|MM|/|YYYY| |HH|:|NN|",
                                        }),
                                })}
                            />
                        </Flex>
                        <Output path="calculations" />
                        <Output path="calc-calendar-clamp" />
                        <Output path="calc-alias-demo" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Ready to use dates"
                description={
                    <>
                        <Typo.p>
                            Certain date ranges are calculated only once when the page loads and are
                            stored globally. This prevents redundant recalculations at the component
                            level and saves resources.
                        </Typo.p>
                        <Typo.p>
                            A background timer in Base updates the ready-to-use dates every day at
                            00:00:00.
                        </Typo.p>
                        <Typo.p>
                            You can access these ready-to-use dates via
                            "globalData._baseDate.package".
                        </Typo.p>
                        <Typo.p>
                            {
                                "For the current time, use baseDate({}) or package.getNow({ format, timezone })."
                            }
                        </Typo.p>
                        <Typo.bold>Current ready-to-use dates in GlobalData:</Typo.bold>
                        <Typo.code>
                            {JSON.stringify(Object.keys(_baseDate.package), null, 2)}
                        </Typo.code>
                    </>
                }
            />
            <Ds.api
                title="baseDate"
                disableLastBlock
                args="const formatted = baseDate({ calc, format, initial, initialFormat, timezone });"
                props={{
                    initial: {
                        description:
                            "Optional. undefined/null/empty string → now. number → ms. string → parsed with initialFormat or store defaultFormat; on failure tries Date constructor, invalid → now. Date → copied. Plain object fields: year, month 1–12, day, hour, minute, second, millisecond; missing keys use DATE_DEFAULTS.",
                        type: "undefined | null | number | string | Date | object",
                    },
                    format: {
                        description:
                            'Output pattern (tokens on this page). Default from baseDateSettings or DD/MM/YYYY. Literal "timestamp" returns ms.',
                        type: "string",
                    },
                    initialFormat: {
                        description:
                            "When initial is string, parsing pattern override (otherwise store defaultFormat).",
                        type: "string",
                    },
                    timezone: {
                        description:
                            "IANA (e.g. Europe/Athens), offset string (+02:00), or finite number as hours offset. Default: clientData.timeZone from store if set, else local. Offset has no DST; use IANA for locale rules.",
                        type: "string | number",
                    },
                    calc: {
                        description:
                            "Must be a plain object (arrays, Date, primitives ignored). Calendar aliases — first finite number wins: year/years/y, month/months/m, day/days/d, hour/hours/h, minute/minutes/min. Summed groups: second/sec/s/seconds/secs; millisecond/milliseconds/milisecond/ms. Calendar-style wall date + clamp; then duration.",
                        type: "object",
                    },
                }}
                returnProps={{
                    formatted: {
                        description:
                            'Formatted date string, or Unix ms when format is "timestamp" (case-insensitive).',
                        type: "string | number",
                    },
                }}
            />
            <Ds.api
                title="getNow"
                args="const formatted = getNow({ format, timezone });"
                props={{
                    format: {
                        description:
                            'Output pattern (tokens on this page). Literal "timestamp" returns ms.',
                        type: "string",
                    },
                    timezone: {
                        description:
                            "IANA (e.g. Europe/Athens), offset string (+02:00), or finite number as hours offset.",
                        type: "string | number",
                    },
                }}
                returnProps={{
                    formatted: {
                        description:
                            'Formatted date string for now, or Unix ms when format is "timestamp".',
                        type: "string | number",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

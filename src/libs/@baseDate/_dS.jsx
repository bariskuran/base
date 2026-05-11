import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { baseStore } from "../@baseStore";
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
                description="In addition to other features, you can also perform calculations within a single function."
                code={`import { baseDate } from "${SYS.basePath}";
                
                baseDate({ 
                    calculate: { day: 5 },
                    format: "|DD|/|MM|/|YYYY|"
                });
                baseDate({ 
                    initial: "10/03/2024",
                    calculate: { day: -10 }
                });
                baseDate({ 
                    initial: "31/12/2023 23:30",
                    calculate: { 
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
                    calculate: "invalid",
                    format: "|DD|/|MM|/|YYYY|",
                });`}
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
                                            calculate: { day: 5 },
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
                                            calculate: { day: -10 },
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
                                            calculate: {
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
                                            calculate: "invalid",
                                            format: "|DD|/|MM|/|YYYY|",
                                        }),
                                })}
                            />
                        </Flex>
                        <Output path="calculations" />
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
                args="baseDate({ initial, format, initialFormat, timezone, calculate }); getNow({ format, timezone });"
                returns='Formatted string, or Unix ms when format is "timestamp" (case-insensitive).'
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
                    calculate: {
                        description:
                            "Plain object only; non-objects ignored. Truncated int deltas: year, month, day (calendar/clamp), then hour, minute, second, seconds (sums), millisecond applied as millis after calendar step.",
                        type: "object",
                    },
                    getNow: {
                        description:
                            "Shorthand for baseDate({ format, timezone }). Without arguments, returns the same current date output as baseDate({}).",
                        type: "function",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { formatJsonForDisplay } from "../DesignSystem/formatJsonForDisplay";
import { cleanFalsyValues, FALSY_TYPES } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";

const stringifyForPreview = (value) => formatJsonForDisplay(value);

const testSample = {
    a: 1,
    b: undefined,
    c: { d: 2, e: undefined, keep: null, zero: 0, empty: "", flag: false, nan: Number.NaN },
    keep: null,
    zero: 0,
    empty: "",
    nan: Number.NaN,
    flag: false,
};

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    return (
        <Ds.page
            title="cleanFalsyValues()"
            releasedOn="1.0.0"
            description={
                <>
                    Default: deep true, all falsy types removed. Use except to opt out, or only for
                    an allowlist (only wins over except). Types: {FALSY_TYPES.join(", ")}.
                    <br />
                    <br />
                    Test sample:
                    <br />
                    <Typo.code>sample = {stringifyForPreview(testSample)}</Typo.code>
                </>
            }
        >
            <Ds.block
                title="Basic Usage"
                description="No settings: deep walk, all types stripped."
                code={`import { cleanFalsyValues } from "${SYS.basePath}";

                       const cleaned = cleanFalsyValues(sample);`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Button.plain
                            label="cleanFalsyValues(sample)"
                            {...outputButtonProps({
                                path: "ex1",
                                activeLabel: "default",
                                fn: () => cleanFalsyValues(testSample),
                            })}
                        />
                        <Output path="ex1" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="deep: false"
                description="Top level only; nested levels stays."
                code="cleanFalsyValues(sample, { deep: false });"
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="deep: false"
                                {...outputButtonProps({
                                    path: "ex2",
                                    activeLabel: "shallow",
                                    fn: () => cleanFalsyValues(testSample, { deep: false }),
                                })}
                            />
                        </Flex>
                        <Output path="ex2" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="except"
                description="Opt out of types. Example keeps zeroNumber. 'except' array supports 'zeroNumber', 'numberNan', 'emptyString', 'false', 'undefined', 'null'."
                code="cleanFalsyValues(sample, { except: ['zeroNumber'] })"
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Button.plain
                            label='except: ["zeroNumber"]'
                            {...outputButtonProps({
                                path: "ex3",
                                activeLabel: "except",
                                fn: () => cleanFalsyValues(testSample, { except: ["zeroNumber"] }),
                            })}
                        />
                        <Output path="ex3" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="only"
                description="Allowlist only; except is ignored when only is non-empty. 'only' array supports 'zeroNumber', 'numberNan', 'emptyString', 'false', 'undefined', 'null'."
                code="cleanFalsyValues(sample, { only: ['undefined']});"
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label='only: ["undefined"]'
                                {...outputButtonProps({
                                    path: "ex4",
                                    activeLabel: "undefined",
                                    fn: () => cleanFalsyValues(testSample, { only: ["undefined"] }),
                                })}
                            />
                            <Button.plain
                                label='only: ["null", "false"]'
                                {...outputButtonProps({
                                    path: "ex4",
                                    activeLabel: "multi",
                                    fn: () =>
                                        cleanFalsyValues(testSample, {
                                            only: ["null", "false"],
                                        }),
                                })}
                            />
                        </Flex>
                        <Output path="ex4" />
                    </Flex.column>
                }
            />
            <Ds.api
                args="const cleaned = cleanFalsyValues(arg, { deep, except, only });"
                props={{
                    arg: {
                        description: "Plain object or array to clean.",
                        type: "object | array",
                        required: true,
                    },
                    deep: {
                        description: "Recurses into nested objects and arrays.",
                        type: "boolean",
                        defaultValue: "true",
                    },
                    except: {
                        description:
                            "Types to keep (opt-out). Ignored when only is non-empty. Values: " +
                            FALSY_TYPES.join(", "),
                        type: "string[]",
                    },
                    only: {
                        description:
                            "Types to strip (allowlist). Non-empty only overrides except. Values: " +
                            FALSY_TYPES.join(", "),
                        type: "string[]",
                    },
                }}
                returnProps={{
                    cleaned: {
                        description: "New object or array with matching keys or items removed.",
                        type: "object | array",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

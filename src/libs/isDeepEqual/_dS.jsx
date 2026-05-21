import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { isDeepEqual } from ".";
import { Flex } from "../Flex";
import { Button } from "../Button";

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    return (
        <Ds.page
            title="isDeepEqual()"
            releasedOn="1.0.0"
            description="Deep equality for objects, arrays, and primitives. Optional comparePath limits comparison to one dot path (byPath); only that slice is compared deeply."
        >
            <Ds.block
                title="Basic usage"
                code={`import { isDeepEqual } from "${SYS.basePath}";

                        isDeepEqual({ a: 1 }, { a: 1 });
                        isDeepEqual([1, 2], [2, 1]);`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="({ a: 1 }, { a: 1 })"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but1",
                                    fn: () => isDeepEqual({ a: 1 }, { a: 1 }),
                                })}
                            />
                            <Button.plain
                                label="([1, 2], [2, 1])"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "but2",
                                    fn: () => isDeepEqual([1, 2], [2, 1]),
                                })}
                            />
                        </Flex>
                        <Output path="basic" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Advanced nested usage"
                code={`import { isDeepEqual } from "${SYS.basePath}";

                        isDeepEqual(
                            {a:1, b:{ c:{d:2, e:[1,2,3]}}},
                            {a:1, b:{ c:{d:2, e:[1,2,3]}}}
                        );
                        isDeepEqual(
                            {a:1, b:{ c:{d:2, e:[1,2,3]}}},
                            {a:1, b:{ c:{d:2, e:[1,2,3,4]}}}
                        );`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="nested equal"
                                {...outputButtonProps({
                                    path: "adv",
                                    activeLabel: "but1",
                                    fn: () =>
                                        isDeepEqual(
                                            { a: 1, b: { c: { d: 2, e: [1, 2, 3] } } },
                                            { a: 1, b: { c: { d: 2, e: [1, 2, 3] } } },
                                        ),
                                })}
                            />
                            <Button.plain
                                label="nested non-equal"
                                {...outputButtonProps({
                                    path: "adv",
                                    activeLabel: "but2",
                                    fn: () =>
                                        isDeepEqual(
                                            { a: 1, b: { c: { d: 2, e: [1, 2, 3] } } },
                                            { a: 1, b: { c: { d: 2, e: [1, 2, 3, 4] } } },
                                        ),
                                })}
                            />
                        </Flex>
                        <Output path="adv" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Falsies values"
                description="Treats falsy values as equal when treatFalsiesAsEqual is true."
                code={`import { isDeepEqual } from "${SYS.basePath}";

                        isDeepEqual({ a: undefined }, { a: false }); // this will return false. Others are equal.
                        isDeepEqual({ a: undefined }, { a: false }, { treatFalsiesAsEqual: true });    
                        isDeepEqual({ a: undefined }, { a: null }, { treatFalsiesAsEqual: true });
                        isDeepEqual({ a: undefined }, { a: 0 }, { treatFalsiesAsEqual: true });
                    `}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="treatFalsiesAsEqual: false"
                                {...outputButtonProps({
                                    path: "fal",
                                    activeLabel: "but0",
                                    fn: () => isDeepEqual({ a: undefined }, { a: false }),
                                })}
                            />
                            <Button.plain
                                label="undefined vs false"
                                {...outputButtonProps({
                                    path: "fal",
                                    activeLabel: "but1",
                                    fn: () =>
                                        isDeepEqual(
                                            { a: undefined },
                                            { a: false },
                                            { treatFalsiesAsEqual: true },
                                        ),
                                })}
                            />
                            <Button.plain
                                label="undefined vs null"
                                {...outputButtonProps({
                                    path: "fal",
                                    activeLabel: "but2",
                                    fn: () =>
                                        isDeepEqual(
                                            { a: undefined },
                                            { a: null },
                                            { treatFalsiesAsEqual: true },
                                        ),
                                })}
                            />
                            <Button.plain
                                label="undefined vs 0"
                                {...outputButtonProps({
                                    path: "fal",
                                    activeLabel: "but3",
                                    fn: () =>
                                        isDeepEqual(
                                            { a: undefined },
                                            { a: 0 },
                                            { treatFalsiesAsEqual: true },
                                        ),
                                })}
                            />
                        </Flex>
                        <Output path="fal" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="comparePath"
                description="Limits comparison to one dot path (byPath); only that slice is compared deeply."
                code={`import { isDeepEqual } from "${SYS.basePath}";

                        isDeepEqual(
                            { a: 1, b: { c: 2 }},
                            { a: 2, b: { c: 2 }}
                        );
                        isDeepEqual(
                            { a: 1, b: { c: 2 }},
                            { a: 2, b: { c: 2 }},
                            { comparePath: "b.c"},
                        );
                        isDeepEqual(
                            { wrap: { id: 1, n: 1 } },
                            { wrap: { id: 1, n: 9 } },
                            { comparePath: "wrap" },
                        );
                        isDeepEqual(
                            { wrap: { id: 1, tag: "x" } },
                            { wrap: { id: 1, tag: "x" } },
                            { comparePath: "wrap.tag" },
                        );`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="Full object → false (a differs)"
                                {...outputButtonProps({
                                    path: "cp",
                                    activeLabel: "but1",
                                    fn: () =>
                                        isDeepEqual({ a: 1, b: { c: 2 } }, { a: 2, b: { c: 2 } }),
                                })}
                            />
                            <Button.plain
                                label="comparePath b.c → true"
                                {...outputButtonProps({
                                    path: "cp",
                                    activeLabel: "but2",
                                    fn: () =>
                                        isDeepEqual(
                                            { a: 1, b: { c: 2 } },
                                            { a: 2, b: { c: 2 } },
                                            { comparePath: "b.c" },
                                        ),
                                })}
                            />
                            <Button.plain
                                label="comparePath wrap → false (n differs)"
                                {...outputButtonProps({
                                    path: "cp",
                                    activeLabel: "but3",
                                    fn: () =>
                                        isDeepEqual(
                                            { wrap: { id: 1, n: 1 } },
                                            { wrap: { id: 1, n: 9 } },
                                            { comparePath: "wrap" },
                                        ),
                                })}
                            />
                            <Button.plain
                                label="comparePath wrap.tag → true"
                                {...outputButtonProps({
                                    path: "cp",
                                    activeLabel: "but4",
                                    fn: () =>
                                        isDeepEqual(
                                            { wrap: { id: 1, tag: "x" } },
                                            { wrap: { id: 1, tag: "x" } },
                                            { comparePath: "wrap.tag" },
                                        ),
                                })}
                            />
                        </Flex>
                        <Output path="cp" />
                    </Flex.column>
                }
            />
            <Ds.block
                title="ignoreArrayOrder"
                description="Treats arrays as multisets (same length, each item paired exactly once by deep equality; order ignored)."
                code={`import { isDeepEqual } from "${SYS.basePath}";

                        isDeepEqual(
                            [1, 2],
                            [2, 1]
                        );
                        isDeepEqual(
                            [1, 2],
                            [2, 1],
                            { ignoreArrayOrder: true },
                        );
                        isDeepEqual(
                            [{ x: 1 }, { x: 2 }],
                            [{ x: 2 }, { x: 1 }],
                            { ignoreArrayOrder: true },
                        );`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="ignoreArrayOrder → false"
                                {...outputButtonProps({
                                    path: "ord",
                                    activeLabel: "but1",
                                    fn: () => isDeepEqual([1, 2], [2, 1]),
                                })}
                            />
                            <Button.plain
                                label="ignoreArrayOrder → true"
                                {...outputButtonProps({
                                    path: "ord",
                                    activeLabel: "but2",
                                    fn: () =>
                                        isDeepEqual([1, 2], [2, 1], { ignoreArrayOrder: true }),
                                })}
                            />
                            <Button.plain
                                label="Nested objects, reversed order"
                                {...outputButtonProps({
                                    path: "ord",
                                    activeLabel: "but3",
                                    fn: () =>
                                        isDeepEqual([{ x: 1 }, { x: 2 }], [{ x: 2 }, { x: 1 }], {
                                            ignoreArrayOrder: true,
                                        }),
                                })}
                            />
                        </Flex>
                        <Output path="ord" />
                    </Flex.column>
                }
            />
            <Ds.api
                args={[
                    "const equal = isDeepEqual(value1, value2, { comparePath, ignoreArrayOrder, maxDepth, maxKeys, treatFalsiesAsEqual });",
                ]}
                props={{
                    value1: {
                        description: "First value.",
                        type: "any",
                        required: true,
                    },
                    value2: {
                        description: "Second value.",
                        type: "any",
                        required: true,
                    },
                    treatFalsiesAsEqual: {
                        description: "Treats falsy values as equal in comparisons.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    maxKeys: {
                        description: "Maximum key count guard for deep checks.",
                        type: "number",
                        defaultValue: "500",
                    },
                    maxDepth: {
                        description: "Maximum recursion depth for deep checks.",
                        type: "number",
                        defaultValue: "10",
                    },
                    comparePath: {
                        description:
                            "Non-empty dot path (same rules as byPath.get). When set, only the values at that path in both roots are compared deeply; all other properties are ignored. To compare a field literally named `hash`, include it in the path (e.g. `wrap.hash`).",
                        type: "string",
                    },
                    ignoreArrayOrder: {
                        description:
                            "When true, arrays are equal if lengths match and elements form the same multiset (each item pairs once by deep equality; order ignored). Nested arrays use the same rule.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                }}
                returnProps={{
                    equal: {
                        description: "True when both values are deeply equal under the given options.",
                        type: "boolean",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

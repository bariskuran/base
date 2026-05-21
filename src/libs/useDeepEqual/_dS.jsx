import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useDeepEqual } from ".";
import { Flex } from "../Flex";
import { Button } from "../Button";

const NESTED_A = { a: 1, b: { c: { d: 2, e: [1, 2, 3] } } };
const NESTED_B_EQUAL = { a: 1, b: { c: { d: 2, e: [1, 2, 3] } } };
const NESTED_B_DIFF = { a: 1, b: { c: { d: 2, e: [1, 2, 3, 4] } } };

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();
    const equal = useDeepEqual(NESTED_A, NESTED_B_EQUAL);
    const notEqual = useDeepEqual(NESTED_A, NESTED_B_DIFF);

    return (
        <Ds.page
            title="useDeepEqual()"
            releasedOn="1.0.0"
            description={
                <>
                    Memoized wrapper around isDeepEqual — same comparison rules and options, cached
                    until a, b, or settings change.
                    <br />
                    <br />
                    useDeepEqual is a React hook built on top of isDeepEqual for component prop
                    comparison. For prop test details, see the isDeepEqual function:
                    <Button.string to="/design-system/isDeepEqual" label="isDeepEqual" />.
                </>
            }
        >
            <Ds.block
                title="Basic"
                code={`import { useDeepEqual } from "${SYS.basePath}";

                        const objA = { a: 1, b: { c: { d: 2, e: [1, 2, 3] } } } };
                        const objB = { a: 1, b: { c: { d: 2, e: [1, 2, 3] } } } };
                        const objC = { a: 1, b: { c: { d: 2, e: [1, 2, 3, 4] } } } };

                        const isSame = useDeepEqual(objA, objB);
                        const isDifferent = useDeepEqual(objA, objC);`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex gap={10} wrap>
                            <Button.plain
                                label="nested equal"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "equal",
                                    fn: () => equal,
                                })}
                            />
                            <Button.plain
                                label="nested not equal"
                                {...outputButtonProps({
                                    path: "basic",
                                    activeLabel: "notEqual",
                                    fn: () => notEqual,
                                })}
                            />
                        </Flex>
                        <Output path="basic" />
                    </Flex.column>
                }
            />
            <Ds.api
                args="const isEqual = useDeepEqual(a, b, { comparePath, ignoreArrayOrder, maxDepth, maxKeys, treatFalsiesAsEqual });"
                props={{
                    a: {
                        description: "First value.",
                        type: "any",
                        required: true,
                    },
                    b: {
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
                            "Non-empty dot path (same rules as byPath.get). When set, only the values at that path in both roots are compared deeply.",
                        type: "string",
                    },
                    ignoreArrayOrder: {
                        description: "When true, array order is ignored in deep comparison.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                }}
                returnProps={{
                    equal: {
                        description: "Memoized deep equality result (same rules as isDeepEqual).",
                        type: "boolean",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

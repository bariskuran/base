import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";

const X = () => (
    <Ds.page
        title="useDeepEqual()"
        releasedOn="1.0.0"
        description="Memoized deep equality between two values."
    >
        <Ds.block
            title="Usage"
            code={`import { useDeepEqual } from "${SYS.basePath}";

                        const same = useDeepEqual(valueA, valueB, {
                            treatFalsiesAsEqual,
                            maxKeys,
                            maxDepth,
                            comparePath,
                            ignoreArrayOrder,
                        });`}
        />
        <Ds.api
            args="const equal = useDeepEqual(a, b, { comparePath, ignoreArrayOrder, maxDepth, maxKeys, treatFalsiesAsEqual });"
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

export default X;

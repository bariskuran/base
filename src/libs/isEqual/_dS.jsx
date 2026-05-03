import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { isEqual, useIsEqual } from ".";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";
import { Button } from "../Button";

const X = () => {
    const { value, setLocal } = baseStore.useLocal({ value: { a: 1, b: { c: 2 } } });
    const stable = useIsEqual(value);
    const eq = isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } });

    return (
        <Ds.page title="<isEqual>" releasedOn="1.0.0" description="Deep equality checker utility.">
            <Ds.block
                title="Basic Usage"
                code={`import { isEqual } from "${SYS.basePath}";

isEqual({ a: 1 }, { a: 1 }); // true
isEqual([1,2], [2,1]); // false`}
                example={<Typo.span children={`isEqual sample => ${String(eq)}`} />}
            />
            <Ds.block
                title="useIsEqual Hook"
                code={`const stableValue = useIsEqual(value);`}
                example={
                    <>
                        <Button
                            label="Update same value"
                            onClick={() =>
                                setLocal((s) => {
                                    s.value = { a: 1, b: { c: 2 } };
                                })
                            }
                        />
                        <Typo.span children={`stable: ${JSON.stringify(stable)}`} />
                    </>
                }
            />
            <Ds.api
                props={{
                    "isEqual(a,b,settings)": {
                        description:
                            "Deep compare with options: treatFalsiesAsEqual, maxKeys, maxDepth, useHashShortcut.",
                        type: "(any, any, object?) => boolean",
                        required: true,
                        defaultValue:
                            "{ treatFalsiesAsEqual:false, maxKeys:500, maxDepth:10, useHashShortcut:true }",
                    },
                    "useIsEqual(value)": {
                        description:
                            "Hook that only updates stored value when deep-equal check fails.",
                        type: "(any) => any",
                        required: true,
                        defaultValue: "hook",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

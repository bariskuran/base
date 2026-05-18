import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { removeUndefined } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";

const stringifyForPreview = (value) =>
    JSON.stringify(value, (_key, v) => (v === undefined ? "undefined" : v), 2);

const sample = {
    a: 1,
    b: undefined,
    c: { d: 2, e: undefined },
    keep: null,
};

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    return (
        <Ds.page
            title="removeUndefined()"
            releasedOn="1.0.0"
            description="Removes top-level keys whose value is undefined. Returns a new plain object; does not mutate the input. null is kept. Nested objects are not walked — use removeUndefinedDeep or clearUndefinedDeep for deep cleanup."
        >
            <Ds.block
                title="Basic usage"
                code={`import { removeUndefined } from "${SYS.basePath}";

                    const cleaned = removeUndefined(sample);`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Typo.code>sample = {stringifyForPreview(sample)}</Typo.code>
                        <Button.plain
                            label="removeUndefined(sample)"
                            {...outputButtonProps({
                                path: "basic",
                                activeLabel: "run",
                                fn: () => removeUndefined(sample),
                            })}
                        />
                        <Output path="basic" />
                    </Flex.column>
                }
            />
            <Ds.api
                args="removeUndefined(obj);"
                returns="New object without undefined top-level keys."
                props={{
                    obj: {
                        description: "Plain object to clean (top level only).",
                        type: "object",
                        required: true,
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

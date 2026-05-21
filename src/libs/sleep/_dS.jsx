import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { sleep } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";

const X = () => {
    const { label, setLocal } = baseStore.useLocal({ label: "Ready" });

    return (
        <Ds.page title="sleep()" releasedOn="1.0.0" description="Promise based delay helper.">
            <Ds.block
                title="Basic usage"
                code={`import { sleep } from "${SYS.basePath}";

                        await sleep(200);`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Button
                            label={label}
                            onClick={async () => {
                                setLocal((s) => {
                                    s.label = "Waiting 2000ms...";
                                });
                                await sleep(2000);
                                setLocal((s) => {
                                    s.label = "Done";
                                });
                            }}
                        />
                        <Typo.span balance>
                            State is driven by baseStore for demo visibility.
                        </Typo.span>
                    </Flex.column>
                }
            />
            <Ds.api
                args="await sleep(ms);"
                returns="void"
                props={{
                    ms: {
                        description: "Delay duration in milliseconds.",
                        type: "number",
                        required: true,
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

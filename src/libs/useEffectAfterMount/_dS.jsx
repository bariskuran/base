import { useEffect } from "react";
import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useEffectAfterMount } from ".";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { Flex } from "../Flex";
import { baseStore } from "../@baseStore";

const X = () => {
    const { count, effectCount, useEffectCount, set } = baseStore.useLocal({
        count: 0,
        effectCount: 0,
        useEffectCount: 0,
    });

    useEffectAfterMount(() => {
        set((s) => {
            s.effectCount += 1;
        });
    }, [count]);

    useEffect(() => {
        set((s) => {
            s.useEffectCount += 1;
        });
    }, [count]);

    return (
        <Ds.page
            title="useEffectAfterMount()"
            releasedOn="1.0.0"
            description="Runs effect only after first mount render."
        >
            <Ds.block
                title="Skip First Render"
                code={`import { useEffectAfterMount } from "${SYS.basePath}";

                    useEffectAfterMount(() => {
                        // runs after mount on dependency updates
                    }, [deps]);`}
                example={
                    <Flex.column gap={8}>
                        <Button
                            label={`count: ${count}`}
                            onClick={() =>
                                set((s) => {
                                    s.count += 1;
                                })
                            }
                            skipClickCooldown
                            skipOnClickHold
                        />
                        <Typo.span>{`effect runs (after first render): ${effectCount}`}</Typo.span>
                        <Typo.span>{`useEffect runs: ${useEffectCount}`}</Typo.span>
                    </Flex.column>
                }
            />
            <Ds.api
                args="useEffectAfterMount(effect, deps);"
                props={{
                    effect: {
                        description: "Effect callback.",
                        type: "function",
                        required: true,
                    },
                    deps: {
                        description: "Dependency array.",
                        type: "any[]",
                        defaultValue: "[]",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

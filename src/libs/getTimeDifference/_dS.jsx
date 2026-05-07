import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { getTimeDifference } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const X = () => {
    const { output, setLocal } = baseStore.useLocal({ output: null });

    return (
        <Ds.page
            title="getTimeDifference()"
            releasedOn="1.0.0"
            description="Returns signed breakdown between two timestamps."
        >
            <Ds.block
                title="Basic usage"
                code={`import { getTimeDifference } from "${SYS.basePath}";

const diff = getTimeDifference(startTs, endTs);`}
                example={
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Button.string
                            label="Run sample (now vs +26h)"
                            onClick={() => {
                                const a = Date.now();
                                const b = a + 1000 * 60 * 60 * 26 + 3500;
                                setLocal((s) => {
                                    s.output = JSON.stringify(getTimeDifference(a, b), null, 2);
                                });
                            }}
                        />
                        <Space size="l" />
                        {output != null && (
                            <>
                                <Typo.span balance>Output</Typo.span>
                                <Typo.pre whiteSpace="pre-wrap">{output}</Typo.pre>
                            </>
                        )}
                    </Flex.column>
                }
            />
            <Ds.api
                args="getTimeDifference(a, b);"
                returns="Breakdown object: ts, sign, totalDays, hour, minute, second, millisecond, diff."
                props={{
                    a: {
                        description: "Start timestamp or Date.",
                        type: "number | Date",
                        required: true,
                    },
                    b: {
                        description: "End timestamp or Date.",
                        type: "number | Date",
                        required: true,
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useMouseXY } from ".";
import { Typo } from "../Typo";
import { Flex } from "../Flex";
import { Button } from "../Button";

const X = () => {
    const { x, y, manualTrigger } = useMouseXY(80);

    return (
        <Ds.page
            title="useMouseXY()"
            releasedOn="1.0.0"
            description="Tracks mouse coordinates; updates are coalesced with requestAnimationFrame and an optional minimum interval (delay)."
        >
            <Ds.block
                title="Track Mouse Position"
                code={`import { useMouseXY } from "${SYS.basePath}";

                       const { x, y, manualTrigger } = useMouseXY(80);`}
                example={
                    <Flex.column gap={8}>
                        <Typo.span>{`x: ${x} y: ${y}`}</Typo.span>
                        <Button.plain label="manualTrigger()" onClick={manualTrigger} />
                    </Flex.column>
                }
            />
            <Ds.api
                disableLastBlock
                args="const { x, y, manualTrigger } = useMouseXY(delay);"
                props={{
                    delay: {
                        description: "Throttle delay in milliseconds.",
                        type: "number",
                        defaultValue: "100",
                    },
                }}
            />
            <Ds.api
                args="x, y"
                props={{
                    x: { description: "Latest mouse X coordinate (clientX).", type: "number" },
                    y: { description: "Latest mouse Y coordinate (clientY).", type: "number" },
                }}
            />
            <Ds.api
                args="manualTrigger()"
                props={{
                    manualTrigger: {
                        description:
                            "Immediately commits the latest known mouse position to state, bypassing throttle delay.",
                        type: "fn",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

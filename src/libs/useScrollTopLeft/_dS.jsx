import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useScrollTopLeft } from ".";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const X = () => {
    const { scrollTop, scrollLeft, directionX, directionY } = useScrollTopLeft({ delay: 80 });

    return (
        <Ds.page
            title="useScrollTopLeft()"
            releasedOn="1.0.0"
            description="Tracks scroll top/left and directions."
        >
            <Ds.block
                title="Track Scroll Position and Direction"
                code={`import { useScrollTopLeft } from "${SYS.basePath}";

const { scrollTop, scrollLeft, directionX, directionY, calc } = useScrollTopLeft({
    source: window,
    delay: 80,
});`}
                example={
                    <Flex.column gap={6}>
                        <Typo.span>{`top: ${Math.round(scrollTop)} left: ${Math.round(scrollLeft)}`}</Typo.span>
                        <Typo.span>{`directionX: ${directionX} directionY: ${directionY}`}</Typo.span>
                    </Flex.column>
                }
            />
            <Ds.api
                args="const { scrollTop, scrollLeft, directionX, directionY, calc } = useScrollTopLeft({ delay, source });"
                props={{
                    source: {
                        description: "Window or scrollable element source.",
                        type: "Window | HTMLElement",
                        defaultValue: "window",
                    },
                    delay: {
                        description: "Throttle delay in milliseconds.",
                        type: "number",
                        defaultValue: "0",
                    },
                }}
                returnProps={{
                    scrollTop: { description: "Current scroll top position.", type: "number" },
                    scrollLeft: { description: "Current scroll left position.", type: "number" },
                    directionX: {
                        description: 'Last horizontal scroll direction: "left", "right", or "none".',
                        type: "string",
                    },
                    directionY: {
                        description: 'Last vertical scroll direction: "top", "bottom", or "none".',
                        type: "string",
                    },
                    calc: {
                        description: "Re-reads scroll position and updates direction state.",
                        type: "function",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

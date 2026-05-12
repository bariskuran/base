import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useScrollTopLeft } from ".";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const Demo = () => {
    const { scrollTop, scrollLeft, directionX, directionY } = useScrollTopLeft({ delay: 80 });
    return (
        <Flex.column gap={6}>
            <Typo.span>{`top: ${Math.round(scrollTop)} left: ${Math.round(scrollLeft)}`}</Typo.span>
            <Typo.span>{`directionX: ${directionX} directionY: ${directionY}`}</Typo.span>
        </Flex.column>
    );
};

const X = () => (
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
            example={<Demo />}
        />
        <Ds.api
            args="useScrollTopLeft(options);"
            returns="scrollTop, scrollLeft, direction axes, and calc helper."
            props={{
                options: {
                    description: "Configuration object.",
                    type: "object",
                    defaultValue: "{}",
                },
                "options.source": {
                    description: "Window or scrollable element source.",
                    type: "Window | HTMLElement",
                    defaultValue: "window",
                },
                "options.delay": {
                    description: "Throttle delay in milliseconds.",
                    type: "number",
                    defaultValue: "0",
                },
            }}
        />
    </Ds.page>
);

export default X;

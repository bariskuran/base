import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useScrollTopLeft } from ".";
import { Typography } from "../Typography";
import { Flex } from "../Flex";

const Demo = () => {
    const { scrollTop, scrollLeft, directionX, directionY } = useScrollTopLeft({ delay: 80 });
    return (
        <Flex.column xAlign="start" gap={6}>
            <Typography.span>{`top: ${Math.round(scrollTop)} left: ${Math.round(scrollLeft)}`}</Typography.span>
            <Typography.span>{`directionX: ${directionX} directionY: ${directionY}`}</Typography.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page title="<useScrollTopLeft>" releasedOn="1.0.0" description="Tracks scroll top/left and directions.">
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
            props={{
                options: { description: "Configuration object.", type: "object", required: false, defaultValue: "{}" },
                "options.source": { description: "Window or scrollable element source.", type: "Window | HTMLElement", required: false, defaultValue: "window" },
                "options.delay": { description: "Throttle delay in milliseconds.", type: "number", required: false, defaultValue: "0" },
                return: {
                    description: "{ scrollTop, scrollLeft, directionX, directionY, calc }",
                    type: "object",
                    required: true,
                    defaultValue: "computed",
                },
            }}
        />
    </Ds.page>
);

export default X;

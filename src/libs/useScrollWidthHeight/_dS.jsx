import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useScrollWidthHeight } from ".";
import { Typography } from "../Typography";
import { Flex } from "../Flex";

const Demo = () => {
    const [width, height] = useScrollWidthHeight();
    return (
        <Flex.column xAlign="start" gap={6}>
            <Typography.span>{`doc width: ${width}`}</Typography.span>
            <Typography.span>{`doc height: ${height}`}</Typography.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page title="<useScrollWidthHeight>" releasedOn="1.0.0" description="Measures scrollable width/height with recalc helper.">
        <Ds.block
            title="Measure Scrollable Size"
            code={`import { useScrollWidthHeight } from "${SYS.basePath}";

const [width, height, recalc] = useScrollWidthHeight(source, {
  settleDelay: 250,
  resizeDelay: 1000,
});`}
            example={<Demo />}
        />
        <Ds.api
            props={{
                source: { description: "Optional element source to measure.", type: "HTMLElement | null | undefined", required: false, defaultValue: "document" },
                options: { description: "Measurement options.", type: "object", required: false, defaultValue: "{}" },
                "options.settleDelay": { description: "Delay before each measurement.", type: "number", required: false, defaultValue: "250" },
                "options.resizeDelay": { description: "Resize throttle delay.", type: "number", required: false, defaultValue: "1000" },
                return: { description: "[width, height, recalc]", type: "[number, number, () => void]", required: true, defaultValue: "[0,0,fn]" },
            }}
        />
    </Ds.page>
);

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useScrollWidthHeight } from ".";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const Demo = () => {
    const [width, height] = useScrollWidthHeight();
    return (
        <Flex.column gap={6}>
            <Typo.span>{`doc width: ${width}`}</Typo.span>
            <Typo.span>{`doc height: ${height}`}</Typo.span>
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="useScrollWidthHeight()"
        releasedOn="1.0.0"
        description="Measures scrollable width/height with recalc helper."
    >
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
            args="useScrollWidthHeight(source, options);"
            returns="Tuple [width, height, recalc]."
            props={{
                source: {
                    description: "Optional element source to measure.",
                    type: "HTMLElement | null | undefined",
                    defaultValue: "document",
                },
                options: {
                    description: "Measurement options.",
                    type: "object",
                    defaultValue: "{}",
                },
                "options.settleDelay": {
                    description: "Delay before each measurement.",
                    type: "number",
                    defaultValue: "250",
                },
                "options.resizeDelay": {
                    description: "Resize throttle delay.",
                    type: "number",
                    defaultValue: "1000",
                },
            }}
        />
    </Ds.page>
);

export default X;

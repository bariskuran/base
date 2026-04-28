import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useMouseXY } from ".";
import { Typography } from "../Typography";

const Demo = () => {
    const [x, y] = useMouseXY(80);
    return <Typography.span>{`x: ${Math.round(x || 0)} y: ${Math.round(y || 0)}`}</Typography.span>;
};

const X = () => (
    <Ds.page title="<useMouseXY>" releasedOn="1.0.0" description="Tracks mouse coordinates with throttle.">
        <Ds.block
            title="Track Mouse Position"
            code={`import { useMouseXY } from "${SYS.basePath}";

const [x, y] = useMouseXY(80);`}
            example={<Demo />}
        />
        <Ds.api
            props={{
                delay: { description: "Throttle delay in milliseconds.", type: "number", required: false, defaultValue: "100" },
                return: { description: "Current mouse coordinates [x, y].", type: "[number, number]", required: true, defaultValue: "[0, 0]" },
            }}
        />
    </Ds.page>
);

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useMouseXY } from ".";
import { Typo } from "../Typo";

const Demo = () => {
    const [x, y] = useMouseXY(80);
    return <Typo.span>{`x: ${Math.round(x || 0)} y: ${Math.round(y || 0)}`}</Typo.span>;
};

const X = () => (
    <Ds.page
        title="useMouseXY()"
        releasedOn="1.0.0"
        description="Tracks mouse coordinates with throttle."
    >
        <Ds.block
            title="Track Mouse Position"
            code={`import { useMouseXY } from "${SYS.basePath}";

const [x, y] = useMouseXY(80);`}
            example={<Demo />}
        />
        <Ds.api
            args="useMouseXY(delay);"
            returns="Tuple [x, y] of latest mouse coordinates."
            props={{
                delay: {
                    description: "Throttle delay in milliseconds.",
                    type: "number",
                    defaultValue: "100",
                },
            }}
        />
    </Ds.page>
);

export default X;

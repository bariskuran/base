import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useMouseXY } from ".";
import { Typo } from "../Typo";

const X = () => {
    const [x, y] = useMouseXY(80);

    return (
        <Ds.page
            title="useMouseXY()"
            releasedOn="1.0.0"
            description="Tracks mouse coordinates with throttle."
        >
            <Ds.block
                title="Track Mouse Position"
                code={`import { useMouseXY } from "${SYS.basePath}";

const [x, y] = useMouseXY(80);`}
                example={<Typo.span>{`x: ${Math.round(x || 0)} y: ${Math.round(y || 0)}`}</Typo.span>}
            />
            <Ds.api
                args="const [x, y] = useMouseXY(delay);"
                props={{
                    delay: {
                        description: "Throttle delay in milliseconds.",
                        type: "number",
                        defaultValue: "100",
                    },
                }}
                returnProps={{
                    x: { description: "Latest mouse X coordinate (clientX).", type: "number" },
                    y: { description: "Latest mouse Y coordinate (clientY).", type: "number" },
                }}
            />
        </Ds.page>
    );
};

export default X;

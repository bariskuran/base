import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";

const X = () => (
    <Ds.page
        title="useDeepEqual()"
        releasedOn="1.0.0"
        description="Memoized deep equality between two values."
    >
        <Ds.block
            title="Usage"
            code={`import { useDeepEqual } from "${SYS.basePath}";

                        const same = useDeepEqual(valueA, valueB, optionalSettings);`}
        />
        <Ds.api
            args="useDeepEqual(a, b, settings?);"
            returns="boolean — same result as isDeepEqual(a, b, settings)."
        />
    </Ds.page>
);

export default X;

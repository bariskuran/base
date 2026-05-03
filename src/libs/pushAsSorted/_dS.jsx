import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { pushAsSorted } from ".";
import { Typo } from "../Typo";

const sample = pushAsSorted([5, 1, 3], 4);

const X = () => (
    <Ds.page
        title="<pushAsSorter>"
        releasedOn="1.0.0"
        description="Pushes and sorts with neighbor info."
    >
        <Ds.block
            title="Basic Usage"
            code={`import { pushAsSorted } from "${SYS.basePath}";

const [sorted, index, lower, upper] = pushAsSorted([5, 1, 3], 4);`}
            example={<Typo.span children={JSON.stringify(sample)} />}
        />
        <Ds.api
            props={{
                arr: {
                    description: "Input array.",
                    type: "any[]",
                    required: false,
                    defaultValue: "[]",
                },
                el: {
                    description: "Element to push.",
                    type: "any",
                    required: false,
                    defaultValue: "0",
                },
                return: {
                    description: "[sortedArray, index, lowerValue, upperValue]",
                    type: "[any[], number, any | undefined, any | undefined]",
                    required: true,
                    defaultValue: "computed",
                },
            }}
        />
    </Ds.page>
);

export default X;

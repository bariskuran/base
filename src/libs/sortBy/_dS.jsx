import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { sortBy } from ".";
import { Typo } from "../Typo";

const asc = ["10px", "2px", "1px"].sort(sortBy.asc);
const desc = ["a", "c", "b"].sort(sortBy.desc);

const X = () => (
    <Ds.page title="<sortBy>" releasedOn="1.0.0" description="Natural asc/desc comparator helpers.">
        <Ds.block
            title="Natural Sorting"
            code={`import { sortBy } from "${SYS.basePath}";

["10px", "2px", "1px"].sort(sortBy.asc);
["a", "c", "b"].sort(sortBy.desc);`}
            example={
                <>
                    <Typo.span children={`asc: ${JSON.stringify(asc)}`} />
                    <Typo.span children={`desc: ${JSON.stringify(desc)}`} />
                </>
            }
        />
        <Ds.api
            props={{
                "sortBy.asc(a, b)": {
                    description: "Ascending comparator for Array.sort.",
                    type: "(any, any) => number",
                    required: true,
                    defaultValue: "function",
                },
                "sortBy.desc(a, b)": {
                    description: "Descending comparator for Array.sort.",
                    type: "(any, any) => number",
                    required: true,
                    defaultValue: "function",
                },
            }}
        />
    </Ds.page>
);

export default X;

import Ds from "../libs/DesignSystem";
import { SYS } from "./SYS";
import { SYMBOLS } from "./SYMBOLS";

const X = () => {
    return (
        <Ds.page
            title="SYMBOLS"
            releasedOn="1.0.0"
            description="Symbol set (single string) for passwords and random text. Excludes &, single quotes, and angle brackets; selected to be compatible with most policies."
        >
            <Ds.block
                title="Export"
                lastBlock
                code={`import { SYMBOLS } from "${SYS.basePath}";

                        ${SYMBOLS}
                    `}
            />
        </Ds.page>
    );
};

export default X;

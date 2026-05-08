import Ds from "../libs/DesignSystem";
import { SYS } from "./SYS";
import { NUMBERS } from "./NUMBERS";

const X = () => {
    return (
        <Ds.page
            title="NUMBERS"
            releasedOn="1.0.0"
            description="Number characters 0–9 (single string)."
        >
            <Ds.block
                title="Export"
                lastBlock
                code={`import { NUMBERS } from "${SYS.basePath}";

                        ${NUMBERS}
                    `}
            />
        </Ds.page>
    );
};

export default X;

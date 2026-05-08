import Ds from "../libs/DesignSystem";
import { SYS } from "./SYS";
import { UPPER_CASE_ALPHABET } from "./UPPER_CASE_ALPHABET";

const X = () => {
    return (
        <Ds.page
            title="UPPER_CASE_ALPHABET"
            releasedOn="1.0.0"
            description="Uppercase Latin alphabet (single string)."
        >
            <Ds.block
                title="Export"
                lastBlock
                code={`import { UPPER_CASE_ALPHABET } from "${SYS.basePath}";

                        ${UPPER_CASE_ALPHABET}
                    `}
            />
        </Ds.page>
    );
};

export default X;

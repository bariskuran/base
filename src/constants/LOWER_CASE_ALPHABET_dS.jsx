import Ds from "../libs/DesignSystem";
import { SYS } from "./SYS";
import { LOWER_CASE_ALPHABET } from "./LOWER_CASE_ALPHABET";

const X = () => {
    return (
        <Ds.page
            title="LOWER_CASE_ALPHABET"
            releasedOn="1.0.0"
            description="Lowercase Latin alphabet (single string). For generateRandom.text etc."
        >
            <Ds.block
                title="Export"
                lastBlock
                code={`import { LOWER_CASE_ALPHABET } from "${SYS.basePath}";

                        ${LOWER_CASE_ALPHABET}
                    `}
            />
        </Ds.page>
    );
};

export default X;

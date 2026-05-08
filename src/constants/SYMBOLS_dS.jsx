import Ds from "../libs/DesignSystem";
import { SYS } from "./SYS";
import { SYMBOLS } from "./SYMBOLS";

const X = () => {
    return (
        <Ds.page
            title="SYMBOLS"
            releasedOn="1.0.0"
            description="Şifre ve rastgele metin için sembol kümesi (tek string). &, tek tırnak ve küçük/büyük işaretleri yok; çoğu policy ile uyumlu olacak şekilde seçildi."
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

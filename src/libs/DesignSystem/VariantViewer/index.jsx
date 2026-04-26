import S from "./_styled";
import { Icon } from "../../@Icon";
import { copyToClipboard } from "../../copyToClipboard";

const VariantViewer = ({ variants }) => {
    /* RETURN */
    return (
        <S.container>
            {variants.map(([name, example]) => (
                <div key={name} data-slot="variant">
                    <div data-slot="title" onClick={() => copyToClipboard(name)}>
                        <Icon icon="dotSmall" width={12} /> {name}
                    </div>
                    <div>{example}</div>
                </div>
            ))}
        </S.container>
    );
};
export default VariantViewer;

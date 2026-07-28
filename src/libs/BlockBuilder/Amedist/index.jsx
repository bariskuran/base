import { Fragment } from "react";
import { Space } from "../../Space";
import AmedistHorizontalLeft from "../amedistHorizontalLeft";
import AmedistHorizontalRight from "../amedistHorizontalRight";
import AmedistVertical from "../amedistVertical";
import S from "./_styled";

const defaultBlockDesign = "amedistHorizontalRight";
const blockDesigns = {
    amedistHorizontalLeft: AmedistHorizontalLeft,
    amedistHorizontalRight: AmedistHorizontalRight,
    amedistVertical: AmedistVertical,
};

const Amedist = ({ blocks = [], space = 150, ...rest }) => {
    if (!Array.isArray(blocks) || blocks.length === 0) return null;

    return (
        <S.container {...rest} data-block-builder="amedist">
            {blocks.map((block, index) => {
                const Block = blockDesigns[block?.slideDesign] || blockDesigns[defaultBlockDesign];

                return (
                    <Fragment key={`${block?.slideDesign || defaultBlockDesign}-${index}`}>
                        <Block block={block} index={index} />
                        {index < blocks.length - 1 && <Space size={space} />}
                    </Fragment>
                );
            })}
        </S.container>
    );
};

export default Amedist;

import { Fragment } from "react";
import S from "./_styled";
import { PopTip } from "../../PopTip";
import { Typo } from "../../Typography";
import Block from "../Block";
import { copyToClipboard } from "../../copyToClipboard";
import { sortBy } from "../../sortBy";

const ApiViewer = ({ props }) => {
    /* RETURN */
    if (!props || typeof props !== "object" || Object.keys(props).length === 0) return null;
    return (
        <Block
            lastBlock
            title="Api"
            example={
                <S.container>
                    <div>*</div>
                    <div>Name</div>
                    <div>Type</div>
                    <div>Description</div>
                    <div>Default Value</div>
                    {Object.entries(props || {})
                        .sort(sortBy.asc)
                        .map(([name, { description, type, required, defaultValue } = {}]) => (
                            <Fragment key={name}>
                                <div>
                                    <PopTip content="Required">
                                        <Typo.bold>{required ? "*" : ""}</Typo.bold>
                                    </PopTip>
                                </div>
                                <div onClick={() => copyToClipboard(name)}>
                                    <Typo.bold>{name}</Typo.bold>
                                </div>
                                <div>{type}</div>
                                <div>{description}</div>
                                <div>{defaultValue}</div>
                            </Fragment>
                        ))}
                </S.container>
            }
        />
    );
};
export default ApiViewer;

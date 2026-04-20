import { Fragment } from "react";
import S from "./_styled";
import { DSBlock } from "../DSBlock";
import { PopTip } from "../PopTip";
import { Typo } from "../Typography";

export const DSApiViewer = ({ api }) => {
    /* RETURN */
    if (!api || !Array.isArray(api) || api.length === 0) return null;
    return (
        <DSBlock
            title="Api"
            example={
                <S.container>
                    <div>*</div>
                    <div>Name</div>
                    <div>Type</div>
                    <div>Description</div>
                    <div>Default Value</div>
                    {api.map(({ name, description, type, required, defaultValue } = {}, index) => (
                        <Fragment key={index}>
                            <div>
                                <PopTip content="Required">
                                    <Typo.bold>{required ? "*" : ""}</Typo.bold>
                                </PopTip>
                            </div>
                            <div>
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

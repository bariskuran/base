import { V1 } from "./versions/V1";
import { FORM } from "../../FORM";
import LockButton from "./lockButton";
import styled from "styled-components";

const WeightText = styled.p`
    font-weight: 500;
    margin-left: 5px;
`;

const versions = { V1 };

export const FieldWeightSlider = ({ form, ...rest }) => (
    <FORM.field form={[WeightSlider, "weightSlider", form?.[0], form?.[1]]} {...rest} />
);

export const WeightSlider = ({ fieldVersion, value, name, inputProps = {}, onChange }) => {
    const Comp = versions?.[fieldVersion] || versions.V1;

    const handleChangeWeight = (val) => {
        onChange({ weight: val, locked: false }, name);
    };

    const handleChangeLock = () => {
        onChange({ weight: value?.weight, locked: !value?.locked }, name);
    };

    return (
        <>
            <Comp
                onChange={handleChangeWeight}
                value={value?.weight}
                min={inputProps.min}
                max={inputProps.max}
                disabled={value?.locked}
            />
            <WeightText>{value?.weight}</WeightText>
            <LockButton onClick={handleChangeLock}>
                {value?.locked ? `Locked \u2713` : `Lock`}
            </LockButton>
        </>
    );
};

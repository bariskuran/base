// Açılıp kapanması gereken wrapperları belirler. Sırası önemli. En dıştaki en üstte olmalı. Yani confirmation en dıştaysa, en altta olmalı mesela.
import { useContext } from "react";
import { FieldContext } from "../FieldContext";
import { Tooltip } from "./_tooltip";
import { AbsoluteLabel } from "./AbsoluteLabel";
import { Confirmation } from "./_confirmation";
import { Helper } from "./_helper";

export const Wrapper = ({ children }) => {
    // confirmation, tooltip, helper, absoluteLabel;
    const {
        _fieldApi: { enableAbsoluteLabel, disableHelper, fieldType, tooltip, confirmation } = {},
    } = useContext(FieldContext);

    /* Return */
    let content = children;
    if (enableAbsoluteLabel) content = <AbsoluteLabel>{content}</AbsoluteLabel>;
    if (
        !disableHelper &&
        fieldType !== "button" &&
        fieldType !== "footer" &&
        fieldType !== "buttonArea"
    )
        content = <Helper>{content}</Helper>;
    if (tooltip) content = <Tooltip>{content}</Tooltip>;
    if (confirmation) content = <Confirmation>{content}</Confirmation>;
    return content;
};

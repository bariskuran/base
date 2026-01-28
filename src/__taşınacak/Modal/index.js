import { V1 } from "./versions/V1";

const versions = {
    default: V1,
    //
    V1,
};

export const Modal = ({ ver = "default", ...props }) => {
    const Variant = versions?.[ver] || versions.default;
    return <Variant {...props} />;
};

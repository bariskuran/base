import { Tooltip as AntdTooltip } from "antd";
import { componentCreator } from "../componentCreator/index.jsx";
import { baseStore } from "../@baseStore";
/**
 *
 * BAKILACAK BUNA. ANTD KALDIRILACAK.
 */

const Base = ({ color, ...p }) => {
    const [c] = baseStore.useGlobal((s) => [s.theme[color || "grey"]]);
    return <AntdTooltip color={c} {...p} />;
};

const variants = {
    error: (p) => <Base color="error" {...p} />,
    success: (p) => <Base color="success" {...p} />,
    primary: (p) => <Base color="primary" {...p} />,
    warning: (p) => <Base color="warning" {...p} />,
};

export const Tooltip = componentCreator("Tooltip", Base, variants);

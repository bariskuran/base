import useVars from "./useVars";
import { FloatingUi } from "../../FloatingUi";

export const Base = ({ children, ...p }) => {
    const { isOpen, openPopTip, closePopTip, allProps } = useVars(p);

    /* RETURN */
    return (
        <FloatingUi
            {...allProps}
            open={isOpen}
            onMouseEnter={openPopTip}
            onMouseLeave={closePopTip}
        >
            {children}
        </FloatingUi>
    );
};

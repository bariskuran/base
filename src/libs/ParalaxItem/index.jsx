import S from "./_styled";
import { useVars } from "./useVars";

export const ParalaxItem = ({ speed = 0, className, style, children, ...rest }) => {
    const { isActive, ref } = useVars({ speed });

    if (!isActive) return children ?? null;

    return (
        <S.container ref={ref} className={className} style={style} {...rest}>
            {children}
        </S.container>
    );
};

ParalaxItem.displayName = "ParalaxItem";

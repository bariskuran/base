import { createPortal } from "react-dom";
import useVars, { PopUpBodyWrapper } from "./useVars";
import S from "./_styled";

export const Base = (p) => {
    const {
        isOpen,
        popUpContent,
        showFooter,
        hasCancelButton,
        hasConfirmButton,
        cancelButtonProps,
        confirmButtonProps,
        closeButtonProps,
        handleBackdropClick,
        forwardedRef,
        zIndex,
        useScrollFlex,
        scrollFlexProps,
        panelRest,
    } = useVars(p);

    if (!isOpen || typeof document === "undefined") return null;

    /* Return */
    return createPortal(
        <S.root $zIndex={zIndex} data-component="PopUp">
            <S.backdrop onClick={handleBackdropClick} aria-hidden />
            <S.dialog ref={forwardedRef} {...panelRest} role="dialog" aria-modal="true">
                <PopUpBodyWrapper
                    useScrollFlex={useScrollFlex}
                    scrollFlexProps={scrollFlexProps}
                    popUpContent={popUpContent}
                    showFooter={showFooter}
                    hasCancelButton={hasCancelButton}
                    hasConfirmButton={hasConfirmButton}
                    cancelButtonProps={cancelButtonProps}
                    confirmButtonProps={confirmButtonProps}
                    closeButtonProps={closeButtonProps}
                />
            </S.dialog>
        </S.root>,
        document.body,
    );
};

import { S } from "./_styled";

export const Confirmation = ({ children, isConfirmationOpen, onApprove, onCancel }) => {
    /* */
    if (isConfirmationOpen)
        return (
            <>
                <S.confirmation>
                    <div>Are you sure?</div>
                    <S.but onClick={onCancel}>No</S.but>
                    <S.but onClick={onApprove}>Yes</S.but>
                </S.confirmation>
                <S.overlay onClick={onCancel} />
            </>
        );
    return <S.container>{children}</S.container>;
};

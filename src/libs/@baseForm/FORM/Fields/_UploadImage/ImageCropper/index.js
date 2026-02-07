import { useEffect, useRef } from "react";
import { FORM } from "../../../FORM";
// import { Button } from "../../Button";
import { S } from "./styled";
import { drawISO } from "./draw";
import { Slider } from "../../Slider";

export const ImageCropper = (props = {}) => {
    const {
        previewImageUrl,
        expectedDimensions,
        allowedRatio = [1, 1],
        previewList,
        set,
        size = 1,
        previewIndex = 0,
        clearValue,
    } = props;
    const canvasRef = useRef(null);

    const draw = () =>
        drawISO({ canvasRef, previewImageUrl, expectedDimensions, allowedRatio, set, size });

    useEffect(() => {
        if (!previewList || previewList.length === 0) return;
        const url = URL.createObjectURL(previewList?.[previewIndex]?.originFileObj);
        set({ previewImageUrl: url });
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [previewList, previewIndex]);

    const onCancel = () => {
        clearValue();
    };

    /**
     * DRAWING FUNCTIONS
     */
    useEffect(() => {
        if (!canvasRef?.current || !previewImageUrl) return;
        const canvas = canvasRef?.current;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = previewImageUrl;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            draw();
        };
    }, [previewImageUrl, allowedRatio, expectedDimensions, set, size]);

    /**
     * APPROVAL FUNCTIONS
     */
    const onApprove = () => {};

    /* RETURN */
    if (!previewList || previewList.length === 0) return null;
    return (
        <S.container>
            <S.imageArea>
                <canvas ref={canvasRef} />
            </S.imageArea>
            <FORM.buttonArea>
                <S.sizeArea>
                    Size:
                    <Slider
                        ver="V1"
                        value={size}
                        inputProps={{
                            min: 0.5,
                            max: 2,
                            step: 0.1,
                        }}
                        onChange={(val) => {
                            set({ size: val });
                        }}
                    />
                </S.sizeArea>
                {/* <Button
                    ver="V1"
                    inputProps={{
                        label: "Cancel",
                    }}
                    onClick={onCancel}
                ></Button>
                <Button
                    ver="V1"
                    inputProps={{
                        label: "Approve",
                        primary: true,
                    }}
                    onClick={onApprove}
                ></Button> */}
            </FORM.buttonArea>
        </S.container>
    );
};

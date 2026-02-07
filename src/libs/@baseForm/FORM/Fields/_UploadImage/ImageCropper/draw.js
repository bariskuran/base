export const drawISO = (props = {}) => {
    const { canvasRef, previewImageUrl, expectedDimensions, allowedRatio, set, size } = props;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = previewImageUrl;

    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let newWidth, newHeight;

        if (expectedDimensions) {
            const { width: expectedWidth, height: expectedHeight } = expectedDimensions;
            const ratio = expectedWidth / expectedHeight;

            if (canvas.width / canvas.height > ratio) {
                newHeight = Math.min(canvas.height, expectedHeight) * size;
                newWidth = newHeight * ratio;
            } else {
                newWidth = Math.min(canvas.width, expectedWidth) * size;
                newHeight = newWidth / ratio;
            }
        } else if (allowedRatio && allowedRatio.length === 2) {
            const ratioX = allowedRatio[0];
            const ratioY = allowedRatio[1];

            if (canvas.width / canvas.height > ratioX / ratioY) {
                newHeight = canvas.height * size;
                newWidth = newHeight * (ratioX / ratioY);
            } else {
                newWidth = canvas.width * size;
                newHeight = newWidth * (ratioY / ratioX);
            }
        } else {
            newWidth = canvas.width * size;
            newHeight = canvas.height * size;
        }

        const startX = (canvas.width - newWidth) / 2;
        const startY = (canvas.height - newHeight) / 2;

        ctx.drawImage(img, startX, startY, newWidth, newHeight);

        // const nS = {
        //     x1: startX,
        //     x2: startX + newWidth,
        //     y1: startY,
        //     y2: startY + newHeight,
        //     width: newWidth,
        //     height: newHeight,
        // };

        /* Draw the rectangle */
        const rectWidth = 200; // Sabit genişlik
        const rectHeight = 200; // Sabit yükseklik
        const rectX = (canvas.width - rectWidth) / 2;
        const rectY = (canvas.height - rectHeight) / 2;

        ctx.setLineDash([4, 4]);
        const stroke = [rectX, rectY, rectWidth, rectHeight];

        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.setLineDash([8, 8]);
        ctx.strokeRect(...stroke);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.lineDashOffset = 6;
        ctx.strokeRect(...stroke);

        /* Set */
        set({
            square: {
                x1: rectX,
                y1: rectY,
                x2: rectX + rectWidth,
                y2: rectY + rectHeight,
                width: rectWidth,
                height: rectHeight,
            },
        });
    };
};

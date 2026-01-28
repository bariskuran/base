/*
const dataExample = [
    ["Col1 Title", "Col2Title", "Col3Title"],
    ["Row1 - Col1", "Row1 - Col2", "Row 1 - Col3"],
]
*/

export const downloadAsCsv = (data, fileName = "data", { onSuccess, onError }) => {
    try {
        let csvContent = "data:text/csv;charset=utf-8,";

        data.forEach((row) => {
            const formattedRow = row.map((cell) => {
                if (cell.toString().includes(",")) {
                    return `"${cell}"`;
                }
                return cell;
            });
            csvContent += formattedRow.join(",") + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName + ".csv");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        onSuccess?.();
    } catch (error) {
        onError?.(error);
    }
};

//  FIRST VERSION AT THE SECOND VERSION, onSuccess, onError is added
// export const downloadAsCsv = (data, fileName = "data", { onSuccess, onError }) => {
//     let csvContent = "data:text/csv;charset=utf-8,";

//     data.forEach((row) => {
//         csvContent += row.join(",") + "\r\n";
//     });

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", fileName + ".csv");

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// };

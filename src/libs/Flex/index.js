import { componentCreator } from "helpers/componentCreator";
import { Base } from "./tools/_Base.jsx";

export const Flex = componentCreator({
    name: "Flex",
    BaseComp: Base,
    variants: {
        column: { direction: "column" },
        y: { direction: "column" },
        x: { direction: "row" },
        row: { direction: "row" },
        "row-reverse": { direction: "row-reverse" },
        "column-reverse": { direction: "column-reverse" },

        xCenter: { direction: "x", xAlign: "center", yAlign: "center", gap: 10, padding: 10 },
        yCenter: { direction: "y", xAlign: "center", yAlign: "center", gap: 10, padding: 10 },
        xLeftCenter: { direction: "x", xAlign: "left", yAlign: "center", gap: 10, padding: 10 },
        xRightCenter: { direction: "x", xAlign: "right", yAlign: "center", gap: 10, padding: 10 },
        xLeftTop: { direction: "x", xAlign: "left", yAlign: "top", gap: 10, padding: 10 },
        xCenterTop: { direction: "x", xAlign: "center", yAlign: "top", gap: 10, padding: 10 },
        xRightTop: { direction: "x", xAlign: "right", yAlign: "top", gap: 10, padding: 10 },
        xLeftBottom: { direction: "x", xAlign: "left", yAlign: "bottom", gap: 10, padding: 10 },
        xCenterBottom: { direction: "x", xAlign: "center", yAlign: "bottom", gap: 10, padding: 10 },
        xRightBottom: { direction: "x", xAlign: "right", yAlign: "bottom", gap: 10, padding: 10 },
        yLeftCenter: { direction: "y", xAlign: "left", yAlign: "center", gap: 10, padding: 10 },
        yRightCenter: { direction: "y", xAlign: "right", yAlign: "center", gap: 10, padding: 10 },
        yLeftTop: { direction: "y", xAlign: "left", yAlign: "top", gap: 10, padding: 10 },
        yCenterTop: { direction: "y", xAlign: "center", yAlign: "top", gap: 10, padding: 10 },
        yRightTop: { direction: "y", xAlign: "right", yAlign: "top", gap: 10, padding: 10 },
        yLeftBottom: { direction: "y", xAlign: "left", yAlign: "bottom", gap: 10, padding: 10 },
        yCenterBottom: { direction: "y", xAlign: "center", yAlign: "bottom", gap: 10, padding: 10 },
        yRightBottom: { direction: "y", xAlign: "right", yAlign: "bottom", gap: 10, padding: 10 },
    },
});

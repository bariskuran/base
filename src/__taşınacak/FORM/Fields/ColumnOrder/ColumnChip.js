import { Icon } from "../../../Icon";

export const ColumnChip = ({ column, onToggleVisibility }) => {
    /* Return */
    return (
        <div>
            {column.visible && <Icon icon="drag" width={12} />}
            <div id="label-area">{column.label}</div>
            <Icon
                icon={column.visible ? "eyeOpen" : "eyeClose"}
                onHoverIcon={!column.visible ? "eyeOpen" : "eyeClose"}
                color="greyB3"
                onHoverColor={column.visible ? "errorF3" : "successF3"}
                width={16}
                onClick={onToggleVisibility}
            />
        </div>
    );
};

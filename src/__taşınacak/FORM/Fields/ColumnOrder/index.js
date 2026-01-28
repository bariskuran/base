import { useEffect } from "react";
import { V1 } from "./versions/V1";
import { Field } from "../../Field";
import { useDC } from "../../../useDashStore";
import { useEffectAfterMount } from "../../../useEffectAfterMount";
import { ColumnChip } from "./ColumnChip";
import { useDS } from "../../../useDashStore";

const versions = { V1 };

const ColumnOrderField = (props) => {
    /* */
    return (
        <Field
            {...props} // don't change nameAndLabel for this component. useColumns overrides via nameAndLabel.
            nameAndLabel="columnOrder"
            fieldType="columnOrder"
            Component={ColumnOrder}
            disableHoverBackground
            hideClear
        />
    );
};
export default ColumnOrderField;

// This can not be used as a seperate component. It needs Field.
export const ColumnOrder = (p = {}) => {
    const {
        onChange,
        value,
        lastSubmittedValue,
        fieldVersion,
        name,
        isFieldMounted,
        _formApi: { storeFile } = {},
    } = p;

    const [columns, set] = useDC(storeFile, (s) => [s.pageSettings?.columns, s.set]);
    const Version = versions?.[fieldVersion] || versions.V1;
    const { dragOverIndex, draggedItem, set: setLocal } = useDS({});

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("text/plain", index);
        setLocal({ draggedItem: index });

        // Ghost elementi özelleştir
        const ghostElement = e.target.cloneNode(true);
        ghostElement.style.filter = "opacity(30%)";
        ghostElement.style.width = "max-content";
        ghostElement.style.cursor = "grabbing";
        document.body.appendChild(ghostElement);
        e.dataTransfer.setDragImage(ghostElement, 50, 50);

        // Ghost elementi temizle
        requestAnimationFrame(() => {
            document.body.removeChild(ghostElement);
        });
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        setLocal({ dragOverIndex: index });
    };

    const handleDragLeave = () => {
        setLocal({ dragOverIndex: null });
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        const dragIndex = e.dataTransfer.getData("text/plain");
        const newItems = [...value];
        const [removed] = newItems.splice(dragIndex, 1);
        newItems.splice(dropIndex, 0, removed);
        onChange(newItems, name);
        setLocal({ dragOverIndex: null, draggedItem: null });
    };

    const handleToggleVisibility = (e, columnName, newStatus) => {
        e.stopPropagation();
        if (!newStatus) onChange([...value.filter((i) => i !== columnName)], name);
        else onChange([...value, columnName], name);
    };

    // update pageSettings.columns in storefile
    const updatePageSettings = () => {
        const newColumns = [...(columns || [])];
        newColumns.forEach((column, index) => {
            newColumns[index].visible = lastSubmittedValue?.includes(column.name);
        });
        set({ "pageSettings.columns": newColumns });
    };
    useEffect(() => {
        if (isFieldMounted) return;
        updatePageSettings();
    }, []);
    useEffectAfterMount(updatePageSettings, [lastSubmittedValue]);

    /* Return */
    return (
        <Version.container>
            {prepareChips(value, columns)?.map((item, index) => (
                <Version.draggableArea
                    key={item.name}
                    $isVisible={item.visible}
                    $dragOver={dragOverIndex === index}
                    $dragged={draggedItem === index}
                    draggable={item.visible}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    style={{
                        cursor: item.visible ? "move !important" : "default",
                    }}
                >
                    <ColumnChip
                        column={item}
                        onToggleVisibility={(e) =>
                            handleToggleVisibility(e, item.name, !item.visible)
                        }
                    />
                </Version.draggableArea>
            ))}
        </Version.container>
    );
};

const prepareChips = (value, columns) => {
    const selectedColumns = value?.map((name) => {
        const find = columns?.find((col) => col.name === name) || {};
        return { name, label: find.label, visible: true };
    });

    const unselectedColumns = columns
        ?.filter((col) => !value?.includes(col.name))
        ?.map(({ name, label }) => ({ name, label, visible: false }));

    return [...(selectedColumns || []), ...(unselectedColumns || [])];
};

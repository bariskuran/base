import { typeOf } from "../../typeOf";
import dayjs from "dayjs";

export const fn = {
    h: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
    ],
    /* */
    baseFn: (s) => [s.date, s.date?.format, s.date?.presets, s.date?.todayEnd],
    /* */
    split: (value) => {
        if (!value) return [null, "00:00", "23:59"];
        const [split1, split2] = [value?.[0]?.split?.(" "), value?.[1]?.split?.(" ")];

        let splitDate1 = split1?.[0] || null;
        let splitDate2 = split2?.[0] || null;
        let splitHour1 = split1?.[1] || null;
        let splitHour2 = split2?.[1] || null;
        return [[splitDate1, splitDate2], splitHour1 || "00:00", splitHour2 || "23:59"];
    },
    /* */
    handleOpen: (isOpen, set) => {
        set({ isOpen });
    },
    /* */
    focusManually: (focusManually, set, isOpen) => {
        if (focusManually === 0) return;
        set({ isOpen: !isOpen });
    },
    /* */
    fillEmtpty: (value, activeRef, valueExporter, presetsMemo, changeDef) => {
        setTimeout(() => {
            if (!value) {
                valueExporter(undefined, presetsMemo?.[0]?.set, { silentMode: true });
                changeDef(presetsMemo?.[0]?.set);
            }
            activeRef?.current?.blur?.();
            const el = [...document.getElementsByClassName("ant-picker")];
            el?.forEach((it) => {
                it.classList.remove("ant-picker-focused");
            });
        }, 250);
    },
    /* */
    valueImporter: (value, presetsMemo) => {
        if (!value) return;
        if (typeOf(value) === "array") return [dayjs(value[0]), dayjs(value[1])];
        if (typeof value === "string") {
            const find = presetsMemo.find((o) => o.id === value);
            if (find) return find.value;
            return presetsMemo?.[0]?.value;
        }
    },
    /* */
    valueExporter: (args, presetsMemo, splitHour1, splitHour2, onChange, name) => {
        const [, arr, settings] = args || [];
        const splits = [arr?.[0].split?.(" ")?.[0], arr?.[1].split?.(" ")?.[0]];
        const sw = (a, b) => (!a || !b ? false : a.startsWith(b));
        const find = presetsMemo.find((o) => sw(arr?.[0], o.set[0]) && sw(arr?.[1], o.set[1]));
        onChange(
            find ? find?.id : [splits[0] + " " + splitHour1, splits[1] + " " + splitHour2],

            name,
            settings,
        );
    },
    /* */
    valueExporterTime: (t1, t2, splitDate, onChange, value, set, name) => {
        if (!t1 && !t2) return;
        if (t1) onChange([`${splitDate?.[0]} ${t1}`, value?.[1]], name);
        else if (t2) onChange([value?.[0], `${splitDate?.[1]} ${t2}`], name);
        set({ isOpen: false });
    },
};

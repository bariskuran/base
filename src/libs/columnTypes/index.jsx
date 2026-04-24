import { Icon } from "../@Icon";
import { stringCaseConverter } from "../stringCaseConverter";

export const COLUMN_SIZES = {
    auto: "auto",
    xxs: 25,
    xs: 50,
    s: 75,
    m: 100,
    l: 150,
    xl: 200,
    xxl: 300,
};

export const columnTypes = {
    array: {
        typeName: "array",
        renderData: (v) => (v && v.length > 0 ? JSON.stringify(v) : "-"),
        sorter: false,
        width: COLUMN_SIZES.l,
    },
    boolean: {
        typeName: "boolean",
        render: (v) => <Icon icon={v ? "check" : "dot"} width={v ? 11 : 3} />,
        sorter: (a, b) => Number(a) - Number(b),
        width: COLUMN_SIZES.s,
        align: "center",
    },
    email: {
        typeName: "email",
        sorter: (a, b) => a.localeCompare(b),
        width: COLUMN_SIZES.m,
    },
    id: {
        typeName: "id",
        labels: { default: "Id" },
        sorter: (a, b) => Number(a) - Number(b),
        align: "right",
        width: COLUMN_SIZES.xs,
    },
    money: {
        typeName: "money",
        renderData: (v) => "$" + v,
        sorter: (a, b) => Number(a) - Number(b),
        width: COLUMN_SIZES.m,
        align: "right",
    },
    name: {
        typeName: "name",
        labels: { default: "Name" },
        renderData: (v) => stringCaseConverter(v, "title"),
        sorter: (a, b) => a.localeCompare(b),
        width: COLUMN_SIZES.l,
    },
    number: {
        typeName: "number",
        sorter: (a, b) => Number(a) - Number(b),
        width: COLUMN_SIZES.s,
        align: "right",
    },
    percentage: {
        typeName: "percentage",
        renderData: (v) => v + "%",
        sorter: (a, b) => Number(a) - Number(b),
        width: COLUMN_SIZES.s,
        align: "right",
    },
    phone: {
        typeName: "phone",
        sorter: (a, b) => a.localeCompare(b),
        width: COLUMN_SIZES.m,
    },
    progress: {
        typeName: "progress",
        sorter: (a, b) => a.localeCompare(b),
        width: COLUMN_SIZES.m,
        align: "center",
    },
    string: {
        typeName: "string",
        sorter: (a, b) => a.localeCompare(b),
        width: COLUMN_SIZES.l,
    },
    stringCapitalize: {
        typeName: "stringCapitalize",
        renderData: (v) => stringCaseConverter(v, "title"),
        sorter: (a, b) => a.localeCompare(b),
        width: COLUMN_SIZES.m,
    },
    stringLong: {
        typeName: "stringLong",
        render: (v) => <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{v}</div>,
        sorter: (a, b) => a.localeCompare(b),
        width: COLUMN_SIZES.m,
    },
    time: {
        typeName: "time",
        sorter: (a, b) => a.localeCompare(b),
        width: COLUMN_SIZES.m,
        align: "right",
    },
    url: {
        typeName: "url",
        sorter: (a, b) => a.localeCompare(b),
        width: COLUMN_SIZES.m,
    },
};

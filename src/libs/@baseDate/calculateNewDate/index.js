import { typeOf } from "../typeOf";

export const calculateNewDate = (date, obj) => {
    if (!date || !obj || Object.keys(obj).length < 1) return;
    const d1 = {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        millisecond: date.getMilliseconds(),
        ts: date.getTime(),
    };

    if (obj.ts) return new Date(d1.ts + obj.ts);

    const newD = new Date(date);
    Object.entries(obj).forEach(([k, v]) => {
        const t = typeOf(v) === "array" ? 1 : 2;
        if (k === "year") t === 1 ? newD.setFullYear(...v) : newD.setFullYear(d1.year + v);
        else if (k === "month") t === 1 ? newD.setMonth(...v) : newD.setMonth(d1.month + v);
        else if (k === "day") t === 1 ? newD.setDate(...v) : newD.setDate(d1.day + v);
        else if (k === "hour") t === 1 ? newD.setHours(...v) : newD.setHours(d1.hour + v);
        else if (k === "minute") t === 1 ? newD.setMinutes(...v) : newD.setMinutes(d1.minute + v);
        else if (k === "second") t === 1 ? newD.setSeconds(...v) : newD.setSeconds(d1.second + v);
        else if (k === "millisecond")
            t === 1 ? newD.setMilliseconds(...v) : newD.setMilliseconds(d1.millisecond + v);
    });

    return newD;
};

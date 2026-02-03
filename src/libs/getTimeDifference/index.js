export const getTimeDifference = (a, b) => {
    const aTs = a instanceof Date ? a.getTime() : Number(a);
    const bTs = b instanceof Date ? b.getTime() : Number(b);

    if (!Number.isFinite(aTs) || !Number.isFinite(bTs)) {
        throw new Error("getTimeDifference: invalid inputs");
    }

    const ts = bTs - aTs;
    const sign = ts < 0 ? -1 : 1;

    let remaining = Math.abs(ts);

    const dayTs = 1000 * 60 * 60 * 24;
    const hourTs = 1000 * 60 * 60;
    const minuteTs = 1000 * 60;
    const secondTs = 1000;

    const totalDays = Math.floor(remaining / dayTs);
    remaining -= totalDays * dayTs;

    const hour = Math.floor(remaining / hourTs);
    remaining -= hour * hourTs;

    const minute = Math.floor(remaining / minuteTs);
    remaining -= minute * minuteTs;

    const second = Math.floor(remaining / secondTs);
    remaining -= second * secondTs;

    const millisecond = remaining;

    return {
        ts,
        sign,
        totalDays: totalDays * sign,
        day: totalDays * sign,
        hour: hour * sign,
        minute: minute * sign,
        second: second * sign,
        millisecond: millisecond * sign,
        diff: [totalDays * sign, hour * sign, minute * sign, second * sign, millisecond * sign],
    };
};

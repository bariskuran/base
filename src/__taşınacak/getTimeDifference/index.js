export const getTimeDifference = (Date1Ts, Date2) => {
    const Date2Ts = Date2.getTime();

    const tsDiff = Date2Ts - Date1Ts;
    let remainingTs = tsDiff;

    const yearTs = 1000 * 60 * 60 * 24 * 365;
    const year = Math.floor(remainingTs / yearTs);
    remainingTs = remainingTs - year * yearTs;

    const dayTs = 1000 * 60 * 60 * 24;
    const day = Math.floor(remainingTs / dayTs);
    remainingTs = remainingTs - day * dayTs;

    const hourTs = 1000 * 60 * 60;
    const hour = Math.floor(remainingTs / hourTs);
    remainingTs = remainingTs - hour * hourTs;

    const minuteTs = 1000 * 60;
    const minute = Math.floor(remainingTs / minuteTs);
    remainingTs = remainingTs - minute * minuteTs;

    const secondTs = 1000;
    const second = Math.floor(remainingTs / secondTs);
    remainingTs = remainingTs - second * secondTs;

    const millisecond = remainingTs;

    return {
        diff: [year, day, hour, minute, second, millisecond],
        ts: tsDiff,
        year,
        day,
        hour,
        minute,
        second,
        millisecond,
    };
};

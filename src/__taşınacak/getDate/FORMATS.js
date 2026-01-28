export const FORMATS = {
    /* BE CAREFUL ABOUT ORDERS. YYYY must be placed before YYY and YYY must be placed before YY. */

    YYYY: (d) => d.getFullYear(), // 2024
    YY: (d) => d.getFullYear().toString().substring(2), // 24

    MM: (d) => d.toLocaleString("default", { month: "2-digit" }),
    mm: (d) => d.toLocaleString("default", { month: "numeric" }), // month no padding
    OO: (d) => d.toLocaleString("default", { month: "long" }), // month string's long
    oo: (d) => d.toLocaleString("default", { month: "short" }), // month string's short

    DD: (d) => d.toLocaleString("default", { day: "2-digit" }), // day number 2 padding
    dd: (d) => d.toLocaleString("default", { day: "numeric" }), // day number no padding
    AA: (d) => d.toLocaleDateString("default", { weekday: "long" }), // day string long
    aa: (d) => d.toLocaleDateString("default", { weekday: "short" }), // day string short

    HH: (d) => d.toLocaleString("default", { hour: "2-digit", hour12: false }), // hour 2 padding 24-hourtime
    hh: (d) => Number(d.toLocaleString("default", { hour: "numeric", hour12: false })).toString(), // hour no padding 24-hourtime

    ZZ: (d) => d.toLocaleString("default", { hour: "2-digit", hour12: true }), // hour 2 padding 12-hourtime
    zz: (d) => d.toLocaleString("default", { hour: "numeric", hour12: true }), // hour no padding 12-hourtime

    NN: (d) => d.toLocaleString("default", { minute: "2-digit" }).padStart(2, "0"), // minute 2 padding
    nn: (d) => d.toLocaleString("default", { minute: "numeric" }), // minute no padding

    SS: (d) => d.toLocaleString("default", { second: "2-digit" }).padStart(2, "0"), // seconds 2 padding
    ss: (d) => d.toLocaleString("default", { second: "numeric" }), // seconds no padding

    LL: (d) => d.toLocaleString("default", { fractionalSecondDigits: 3 }), // milisecond padded to 3
    ll: (d) => d.getMilliseconds(), // milisecond no padding
};

export const FORMATS = {
    // Year
    YYYY: (d) => d.getFullYear(), // 2024
    YY: (d) => String(d.getFullYear()).slice(-2), // 24

    // Month (numeric)
    MM: (d) => String(d.getMonth() + 1).padStart(2, "0"), // 01..12
    mm: (d) => String(d.getMonth() + 1), // 1..12

    // Month (name)
    OO: (d) => d.toLocaleString("default", { month: "long" }),
    oo: (d) => d.toLocaleString("default", { month: "short" }),

    // Day (numeric)
    DD: (d) => String(d.getDate()).padStart(2, "0"), // 01..31
    dd: (d) => String(d.getDate()), // 1..31

    // Weekday (name)
    AA: (d) => d.toLocaleDateString("default", { weekday: "long" }),
    aa: (d) => d.toLocaleDateString("default", { weekday: "short" }),

    // Hour 24h
    HH: (d) => String(d.getHours()).padStart(2, "0"), // 00..23
    hh: (d) => String(d.getHours()), // 0..23

    // Hour 12h
    ZZ: (d) => String(d.getHours() % 12 || 12).padStart(2, "0"), // 01..12
    zz: (d) => String(d.getHours() % 12 || 12), // 1..12

    // AM/PM
    AP: (d) => (d.getHours() >= 12 ? "PM" : "AM"),
    ap: (d) => (d.getHours() >= 12 ? "pm" : "am"),

    // Minute
    NN: (d) => String(d.getMinutes()).padStart(2, "0"),
    nn: (d) => String(d.getMinutes()),

    // Second
    SS: (d) => String(d.getSeconds()).padStart(2, "0"),
    ss: (d) => String(d.getSeconds()),

    // Millisecond
    LL: (d) => String(d.getMilliseconds()).padStart(3, "0"), // 000..999
    ll: (d) => String(d.getMilliseconds()), // 0..999
};



export const sortBy = {
    asc: (a, b) => naturalCompare(a, b),
    desc: (a, b) => naturalCompare(b, a),
};

const naturalCompare = (a, b) => {
    if (a === b) return 0;
    const sa = String(a);
    const sb = String(b);
    const rx = /(\d+|\D+)/g;
    const partsA = sa.match(rx) || [];
    const partsB = sb.match(rx) || [];
    const len = Math.max(partsA.length, partsB.length);
    for (let i = 0; i < len; i++) {
        const pa = partsA[i];
        const pb = partsB[i];
        if (pa === undefined) return -1;
        if (pb === undefined) return 1;
        const na = Number(pa);
        const nb = Number(pb);
        const isNumA = !Number.isNaN(na);
        const isNumB = !Number.isNaN(nb);
        if (isNumA && isNumB) {
            if (na !== nb) return na - nb;
            continue;
        }
        if (!isNumA && !isNumB) {
            const cmp = pa.localeCompare(pb, undefined, { sensitivity: "base" });
            if (cmp !== 0) return cmp;
            continue;
        }
        return isNumA ? -1 : 1;
    }

    return 0;
};

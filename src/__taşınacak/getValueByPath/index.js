/**
 * Bu fonksiyon bir obje içerisinden verilen path yolunu çeker.
 * Path'in "l1.l2.l3" şeklinde olması gerekir.
 * Example: getValueByPath({l1:{l2:{l3:"XXX"}}}, "l1.l2.l3");
 */
export const getValueByPath = (obj, path) => {
    const keys = path.split(".");
    return keys.reduce((acc, key) => {
        return acc ? acc[key] : undefined;
    }, obj);
};

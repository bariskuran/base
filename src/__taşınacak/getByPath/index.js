/*

const object = { 'a': [{ 'b': { 'c': 3 } }] };

const value = getByPath(object, 'a[0].b.c');
console.log(value); // Output: 3

*/

export const getByPath = (object, path) => {
    const keys = path.split(".");
    let result = object;

    for (const key of keys) {
        const arrayIndexMatch = key.match(/(\w+)(?:\[(\d+)\])?/);
        if (arrayIndexMatch) {
            const [, prop, index] = arrayIndexMatch;
            result = result[prop];
            if (index !== undefined) result = result[parseInt(index, 10)];
            if (result === undefined) return undefined;
        } else {
            result = result[key];
            if (result === undefined) return undefined;
        }
    }

    return result;
};

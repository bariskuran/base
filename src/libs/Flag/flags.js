const flagModules = import.meta.glob("./flags/*.js");
const flagCache = new Map();
const flagRequests = new Map();

export const flagNames = Object.keys(flagModules)
    .map((path) => path.replace("./flags/", "").replace(/\.js$/, ""))
    .sort();

const getFlagPath = (name) => `./flags/${name}.js`;

export const hasBuiltInFlag = (name) => typeof name === "string" && !!flagModules[getFlagPath(name)];

export const getBuiltInFlag = (name) => flagCache.get(name) || null;

export const loadBuiltInFlag = (name) => {
    if (!hasBuiltInFlag(name)) return Promise.resolve(null);
    if (flagCache.has(name)) return Promise.resolve(flagCache.get(name));
    if (flagRequests.has(name)) return flagRequests.get(name);

    const request = flagModules[getFlagPath(name)]()
        .then((module) => {
            const definition = module.default;
            flagCache.set(name, definition);
            return definition;
        })
        .finally(() => {
            flagRequests.delete(name);
        });

    flagRequests.set(name, request);
    return request;
};

export const loadAllBuiltInFlags = async () => {
    await Promise.all(flagNames.map((name) => loadBuiltInFlag(name)));
    return Object.fromEntries(flagNames.map((name) => [name, flagCache.get(name)]));
};

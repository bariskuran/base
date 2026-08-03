const iconModules = import.meta.glob("./icons/*.js");
const iconCache = new Map();
const iconRequests = new Map();

export const iconNames = Object.keys(iconModules)
    .map((path) => path.replace("./icons/", "").replace(/\.js$/, ""))
    .sort();

const getIconPath = (name) => `./icons/${name}.js`;

export const hasBuiltInIcon = (name) => typeof name === "string" && !!iconModules[getIconPath(name)];

export const getBuiltInIcon = (name) => iconCache.get(name) || null;

export const loadBuiltInIcon = (name) => {
    if (!hasBuiltInIcon(name)) return Promise.resolve(null);
    if (iconCache.has(name)) return Promise.resolve(iconCache.get(name));
    if (iconRequests.has(name)) return iconRequests.get(name);

    const request = iconModules[getIconPath(name)]()
        .then((module) => {
            const definition = module.default;
            iconCache.set(name, definition);
            return definition;
        })
        .finally(() => {
            iconRequests.delete(name);
        });

    iconRequests.set(name, request);
    return request;
};

export const loadAllBuiltInIcons = async () => {
    await Promise.all(iconNames.map((name) => loadBuiltInIcon(name)));
    return Object.fromEntries(iconNames.map((name) => [name, iconCache.get(name)]));
};

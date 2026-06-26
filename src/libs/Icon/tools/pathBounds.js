const COMMAND_PARAM_COUNT = {
    M: 2,
    L: 2,
    H: 1,
    V: 1,
    C: 6,
    S: 4,
    Q: 4,
    T: 2,
    A: 7,
};

const TOKEN_RE = /[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/gi;

const isCommand = (value) => /^[a-zA-Z]$/.test(value);

const updateBounds = (bounds, x, y) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;

    bounds.minX = Math.min(bounds.minX, x);
    bounds.minY = Math.min(bounds.minY, y);
    bounds.maxX = Math.max(bounds.maxX, x);
    bounds.maxY = Math.max(bounds.maxY, y);
};

const buildBounds = (minX, minY, maxX, maxY) => {
    const width = maxX - minX;
    const height = maxY - minY;

    if (width <= 0 || height <= 0) return null;

    return { minX, minY, width, height };
};

export const getPathBounds = (path) => {
    if (typeof path !== "string") return null;
    if (path.startsWith("data:image/")) return null;

    const tokens = path.match(TOKEN_RE);
    if (!tokens?.length) return null;

    const bounds = {
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity,
    };

    let index = 0;
    let command = null;
    let x = 0;
    let y = 0;
    let startX = 0;
    let startY = 0;

    const hasNumber = () => index < tokens.length && !isCommand(tokens[index]);
    const readNumber = () => {
        if (!hasNumber()) return null;
        const value = Number(tokens[index]);
        index += 1;
        return Number.isFinite(value) ? value : null;
    };

    while (index < tokens.length) {
        if (isCommand(tokens[index])) {
            command = tokens[index];
            index += 1;
        }

        if (!command) break;

        const upperCommand = command.toUpperCase();
        const isRelative = command !== upperCommand;

        if (upperCommand === "Z") {
            x = startX;
            y = startY;
            updateBounds(bounds, x, y);
            command = null;
            continue;
        }

        const paramCount = COMMAND_PARAM_COUNT[upperCommand];
        if (!paramCount) break;

        let isFirstMove = upperCommand === "M";

        while (hasNumber()) {
            const values = [];

            for (let valueIndex = 0; valueIndex < paramCount; valueIndex += 1) {
                const value = readNumber();
                if (value == null) return null;
                values.push(value);
            }

            if (upperCommand === "M") {
                x = isRelative ? x + values[0] : values[0];
                y = isRelative ? y + values[1] : values[1];

                if (isFirstMove) {
                    startX = x;
                    startY = y;
                    isFirstMove = false;
                }

                updateBounds(bounds, x, y);
                command = isRelative ? "l" : "L";
                continue;
            }

            if (upperCommand === "L" || upperCommand === "T") {
                x = isRelative ? x + values[0] : values[0];
                y = isRelative ? y + values[1] : values[1];
                updateBounds(bounds, x, y);
                continue;
            }

            if (upperCommand === "H") {
                x = isRelative ? x + values[0] : values[0];
                updateBounds(bounds, x, y);
                continue;
            }

            if (upperCommand === "V") {
                y = isRelative ? y + values[0] : values[0];
                updateBounds(bounds, x, y);
                continue;
            }

            if (upperCommand === "C") {
                for (let pointIndex = 0; pointIndex < 6; pointIndex += 2) {
                    const nextX = isRelative ? x + values[pointIndex] : values[pointIndex];
                    const nextY = isRelative ? y + values[pointIndex + 1] : values[pointIndex + 1];
                    updateBounds(bounds, nextX, nextY);
                }
                x = isRelative ? x + values[4] : values[4];
                y = isRelative ? y + values[5] : values[5];
                continue;
            }

            if (upperCommand === "S" || upperCommand === "Q") {
                for (let pointIndex = 0; pointIndex < 4; pointIndex += 2) {
                    const nextX = isRelative ? x + values[pointIndex] : values[pointIndex];
                    const nextY = isRelative ? y + values[pointIndex + 1] : values[pointIndex + 1];
                    updateBounds(bounds, nextX, nextY);
                }
                x = isRelative ? x + values[2] : values[2];
                y = isRelative ? y + values[3] : values[3];
                continue;
            }

            if (upperCommand === "A") {
                x = isRelative ? x + values[5] : values[5];
                y = isRelative ? y + values[6] : values[6];
                updateBounds(bounds, x, y);
            }

            if (isFirstMove) break;
        }
    }

    if (!Number.isFinite(bounds.minX) || !Number.isFinite(bounds.minY)) return null;

    return buildBounds(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
};

import DsOutput from "../OutputArea";
import { baseStore } from "../../@baseStore";

const formatOutput = (value) => {
    if (typeof value === "string") return value;
    return JSON.stringify(value, null, 2);
};

const useOutputViewer = () => {
    const { outputs, actives, setLocal } = baseStore.useLocal({ outputs: {}, actives: {} });

    const setOutput = ({ path, activeLabel, value }) =>
        setLocal((s) => {
            s.outputs[path] = formatOutput(value);
            s.actives[path] = activeLabel;
        });

    const clearOutput = (path) =>
        setLocal((s) => {
            s.outputs[path] = null;
            s.actives[path] = null;
        });

    const Output = ({ path }) => <DsOutput outputs={outputs} path={path} onClose={clearOutput} />;

    const outputButtonProps = (opts = {}) => {
        const { path, activeLabel = path, value, fn } = opts;
        const hasValue = Object.prototype.hasOwnProperty.call(opts, "value");

        return {
            activeManually: actives[path] === activeLabel,
            onClick: () => {
                const output = typeof fn === "function" ? fn() : hasValue ? value : fn;
                setOutput({ path, activeLabel, value: output });
            },
        };
    };

    return {
        outputs,
        actives,
        setOutput,
        clearOutput,
        outputButtonProps,
        Output,
    };
};

export default useOutputViewer;

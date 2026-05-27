import DsOutput from "../OutputArea";
import { baseStore } from "../../@baseStore";
import { formatJsonForDisplay } from "../formatJsonForDisplay";
import { dedent } from "../../templateLiteralTo/dedent";

const formatOutput = (value) => {
    const formatted = formatJsonForDisplay(value);
    return typeof formatted === "string" ? formatted : value == null ? null : String(formatted);
};

const stripArrowFnPreamble = (s) => {
    if (typeof s !== "string" || !s.trim()) return s;
    let t = s.trim().replace(/^async\s+/, "");
    const m = t.match(/^\([^)]*\)\s*=>\s*([\s\S]+)$/);
    return m ? m[1].trim() : s.trim();
};

const formatFnSnippet = (fn) => {
    const raw = typeof fn === "function" ? String(fn) : typeof fn === "string" ? fn : "";
    if (!raw.trim()) return "";
    return dedent(stripArrowFnPreamble(raw));
};

const useOutputViewer = () => {
    const { outputs, actives, setLocal } = baseStore.useLocal({ outputs: {}, actives: {} });

    const setOutput = ({ path, activeLabel, output, value, fnString = "" }) => {
        const out = output !== undefined ? output : value;
        setLocal((s) => {
            s.outputs[path] = {
                fn: fnString,
                output: formatOutput(out),
            };
            s.actives[path] = activeLabel;
        });
    };

    const clearOutput = (path) =>
        setLocal((s) => {
            s.outputs[path] = null;
            s.actives[path] = null;
        });

    const Output = (props) => <DsOutput outputs={outputs} onClose={clearOutput} {...props} />;

    const outputButtonProps = (opts = {}) => {
        const { path, activeLabel = path, value, fn } = opts;
        const hasValue = Object.prototype.hasOwnProperty.call(opts, "value");

        return {
            activeManually: actives[path] === activeLabel,
            onClick: () => {
                if (actives[path] === activeLabel) {
                    clearOutput(path);
                    return;
                }

                const output = typeof fn === "function" ? fn() : hasValue ? value : fn;
                const fnString = formatFnSnippet(fn);
                setOutput({ path, activeLabel, output, fnString });
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

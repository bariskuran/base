import { useRouteError, isRouteErrorResponse, useSearchParams } from "react-router-dom";
import { API_RESPONSE_CODES } from "../../constants/API_RESPONSE_CODES";

const DEFAULT_CODE = 500;

const normalizeCode = (x) => {
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
};

const getCodeFromRouteError = (err) => {
    if (!err) return null;

    if (isRouteErrorResponse(err)) {
        return err.status;
    }

    // custom error shape desteklemek istersen:
    if (typeof err === "object" && err && "status" in err) {
        const c = normalizeCode(err.status);
        if (c) return c;
    }

    return null;
};

export default function ErrorPage({ defaultCode }) {
    const err = useRouteError?.();
    const [sp] = useSearchParams();

    const codeFromErr = getCodeFromRouteError(err);
    const codeFromQuery = normalizeCode(sp.get("code"));

    const code = codeFromErr || codeFromQuery || defaultCode || DEFAULT_CODE;

    const meta = API_RESPONSE_CODES[code] || API_RESPONSE_CODES[500];
    const [title, description] = meta;

    return (
        <div style={{ padding: 24 }}>
            <h1>Error {code}</h1>
            <p>{description}</p>
        </div>
    );
}

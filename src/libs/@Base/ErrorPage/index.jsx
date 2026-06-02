import {
    useRouteError,
    isRouteErrorResponse,
    useSearchParams,
    useNavigate,
} from "react-router-dom";
import { API_RESPONSE_CODES } from "../../../constants/API_RESPONSE_CODES";
import { baseStore } from "../../baseStore";
import { S } from "./_styled";
import { useMemo } from "react";
import { getText as t } from "../../getText";

const DEFAULT_CODE = 500;

const normalizeCode = (x) => {
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
};

const splitOnFirstDotOrColon = (str) => {
    const iDot = str.indexOf(".");
    const iColon = str.indexOf(":");

    let idx;
    if (iDot === -1) idx = iColon;
    else if (iColon === -1) idx = iDot;
    else idx = Math.min(iDot, iColon);

    if (idx === -1) return [str];

    return [str.slice(0, idx), str];
};

const getCodeFromRouteError = (err) => {
    if (!err) return null;

    if (isRouteErrorResponse(err)) return err.status;

    if (typeof err === "object" && err && "status" in err) {
        const c = normalizeCode(err.status);
        if (c != null) return c;
    }

    if (typeof err === "object" && err && "statusCode" in err) {
        const c = normalizeCode(err.statusCode);
        if (c != null) return c;
    }

    return null;
};

const pickI18n = (meta, lang = "en") => {
    if (!meta || typeof meta !== "object") {
        return { title: "Error", description: "Unexpected error." };
    }
    const entry = meta[lang] || meta.en || meta.tr || meta.unknown;
    if (entry && typeof entry === "object") return entry;
    return { title: "Error", description: "Unexpected error." };
};

export const ErrorPage = ({ defaultCode }) => {
    const err = useRouteError();
    const [sp] = useSearchParams();
    const [lang] = baseStore?.useGlobal?.((s) => [s.language]) || ["en"];
    const navigate = useNavigate();
    const codeFromErr = getCodeFromRouteError(err);
    const codeFromQuery = normalizeCode(sp.get("code"));
    const code = codeFromErr ?? codeFromQuery ?? defaultCode ?? DEFAULT_CODE;
    const meta =
        API_RESPONSE_CODES[code] || API_RESPONSE_CODES.unknown || API_RESPONSE_CODES[DEFAULT_CODE];
    const { title, description } = pickI18n(meta, lang);
    const [preparedTitle, preparedDescription] = useMemo(() => {
        const msg = String(err?.message || err);
        if (!msg || msg === "null") {
            return [title, description];
        }
        return splitOnFirstDotOrColon(msg);
    }, [err, lang]);

    return (
        <S.container>
            <S.code>{code || ""}</S.code>
            <S.title>{preparedTitle}</S.title>
            <S.description>{preparedDescription}</S.description>
            <S.linkArea>
                <S.link to="/">{t("backToHome")}</S.link>
                <S.link
                    to="#"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(-1);
                    }}
                >
                    {t("tryAgain")}
                </S.link>
                <S.link
                    to="#"
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.reload();
                    }}
                >
                    {t("refreshPage")}
                </S.link>
            </S.linkArea>
            <S.footer>@bariskuran/base</S.footer>
        </S.container>
    );
};

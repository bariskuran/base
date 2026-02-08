import { baseStore } from "../../@baseStore";
import { queryConverter } from "../../queryConverter";
import {
    applyEnvUrl,
    buildHeaders,
    checkCallProps,
    makeCacheKey,
    getFromCache,
    addToCache,
    normalizeMethod,
    resolvePayload,
    resolveToken,
    isAbsoluteUrl,
} from "./_tools";

export const baseFetch = (callOrCalls, jointSettings = {}) => {
    const global = baseStore.globalData.get?.() || {};
    const _baseFetchSettings = global._baseFetchSettings || {};

    const {
        disableLoadingApi: disableLoadingApiGlobal,
        disableAuth: disableAuthGlobal,
        getTokenFrom: getTokenFromGlobal,
        token: tokenGlobal,
        cacheTime: cacheTimeGlobal,
        envUrl: envUrlGlobal,
    } = _baseFetchSettings;

    const {
        enableSynchronousCalls = false, // false => parallel, true => pipeline
        disableLoadingApi = disableLoadingApiGlobal || false,
        onError,
        onSuccess,
        onCancel,
        envUrl = envUrlGlobal || null,
    } = jointSettings || {};

    const controllers = [];
    let cancelled = false;
    let cancelReason = "canceled";
    let cancelNotified = false;

    const notifyCancelOnce = () => {
        if (cancelNotified) return;
        cancelNotified = true;
        try {
            onCancel?.({ reason: cancelReason, baseStore });
        } catch (err) {
            console.error("[baseFetch] onCancel callback error:", err);
        }
    };

    const cancelFetch = (reason = "canceled") => {
        cancelled = true;
        cancelReason = reason || "canceled";

        controllers.forEach((c) => {
            try {
                c.abort(cancelReason);
            } catch (err) {
                console.error("[baseFetch] Error in cancelFetch abort:", err);
            }
        });

        notifyCancelOnce();
    };

    const promise = (async () => {
        const calls = Array.isArray(callOrCalls) ? callOrCalls : [callOrCalls];

        const validationErrors = [];
        calls.forEach((c, i) => {
            const { ok, errors } = checkCallProps(c || {});
            if (!ok) validationErrors.push({ index: i, errors });
        });

        if (validationErrors.length) {
            const res = {
                isOk: false,
                status: "error",
                errors: validationErrors,
            };
            onError?.(res);
            return res;
        }

        const results = [];
        const responses = [];
        const errors = [];

        const runOneCall = async (call, index, prevResults) => {
            const loadingApi = global._loadingManager?.api;

            const {
                url,
                method = "GET",
                body,
                credentials,
                headers,
                useCache = false,
                cacheTime = cacheTimeGlobal || 10,
                payload,
                payloadAdaptor,
                disableAuth = disableAuthGlobal || false,
                getTokenFrom = getTokenFromGlobal || null,
                token = tokenGlobal || null,
                onStart,
                onEnd,
            } = call || {};

            const isAbs = isAbsoluteUrl(url);
            const resolvedCredentials = credentials ?? (isAbs ? "omit" : "include");
            const finalMethod = normalizeMethod(method);
            const payloadObj = payload ?? resolvePayload(payloadAdaptor, prevResults);
            const fullUrlBase = applyEnvUrl(url, envUrl);
            const fullUrl =
                finalMethod === "GET" && payloadObj
                    ? `${fullUrlBase}${queryConverter.export(payloadObj)}`
                    : fullUrlBase;

            const cacheKey = makeCacheKey({
                url: fullUrl,
                method: finalMethod,
                body: body ?? payloadObj,
            });

            if (useCache) {
                const cached = getFromCache({ cacheKey, nowTs: Date.now() });
                if (cached !== null && cached !== undefined) {
                    const handled =
                        typeof onEnd === "function" ? await onEnd(cached, null) : cached;
                    return { isOk: true, fromCache: true, data: handled, raw: cached };
                }
            }

            let queueName = null;
            if (!disableLoadingApi && loadingApi?.add) {
                try {
                    queueName = loadingApi.add({ url: fullUrl, method: finalMethod });
                } catch (err) {
                    console.error("[baseFetch] loadingApi.add error:", err);
                }
            }

            try {
                if (cancelled) {
                    const err = new Error(cancelReason);
                    err.name = "AbortError";
                    throw err;
                }

                onStart?.({ index, url: fullUrl, method: finalMethod, baseStore });

                const resolvedToken = await resolveToken({ disableAuth, token, getTokenFrom });

                if (!disableAuth && !resolvedToken) {
                    throw new Error("No token provided.");
                }

                const controller = new AbortController();
                controllers.push(controller);

                const h = buildHeaders(headers);

                const init = {
                    method: finalMethod,
                    credentials: resolvedCredentials,
                    signal: controller.signal,
                    headers: h,
                };

                if (finalMethod !== "GET") {
                    const finalBody = body ?? payloadObj;
                    if (finalBody != null) {
                        if (typeof finalBody === "string" || finalBody instanceof FormData) {
                            init.body = finalBody;
                            if (!(finalBody instanceof FormData) && !init.headers["Content-Type"]) {
                                init.headers["Content-Type"] = "text/plain;charset=UTF-8";
                            }
                        } else {
                            init.body = JSON.stringify(finalBody);
                            if (!init.headers["Content-Type"]) {
                                init.headers["Content-Type"] = "application/json";
                            }
                        }
                    }
                }

                if (!disableAuth && resolvedToken) {
                    if (!init.headers.Authorization) {
                        init.headers.Authorization = `Bearer ${resolvedToken}`;
                    }
                }

                const r = await fetch(fullUrl, init);

                const ct = r.headers.get("content-type") || "";
                let parsed;
                if (ct.includes("application/json")) {
                    parsed = await r.json().catch(() => null);
                } else {
                    parsed = await r.text().catch(() => "");
                }

                if (!r.ok) {
                    const err = new Error(`HTTP ${r.status}`);
                    err.status = r.status;
                    err.data = parsed;
                    throw err;
                }

                const handled = typeof onEnd === "function" ? await onEnd(parsed, null) : parsed;

                if (useCache) {
                    const ttlMs = Number(cacheTime || 0) * 60 * 1000;
                    if (ttlMs > 0) addToCache({ cacheKey, data: handled, ttlMs });
                }

                return { isOk: true, fromCache: false, data: handled, raw: parsed };
            } catch (err) {
                const isAbort =
                    cancelled ||
                    err?.name === "AbortError" ||
                    (typeof err?.message === "string" &&
                        (err.message.includes("aborted") ||
                            err.message.includes("canceled") ||
                            err.message.includes("cancel")));

                if (isAbort) {
                    cancelled = true;
                    if (!cancelReason) cancelReason = "canceled";
                    notifyCancelOnce();
                    return { isOk: false, cancelled: true, error: err };
                }

                let handledErr = err;
                if (typeof onEnd === "function") {
                    try {
                        const maybe = await onEnd(null, err);
                        if (maybe !== undefined) handledErr = maybe;
                    } catch (e2) {
                        console.error("[baseFetch] onEnd error handler failed:", e2);
                    }
                }

                return { isOk: false, error: handledErr };
            } finally {
                if (!disableLoadingApi && queueName && loadingApi?.remove) {
                    try {
                        loadingApi.remove(queueName);
                    } catch (err) {
                        console.error("[baseFetch] loadingApi.remove error:", err);
                    }
                }
            }
        };

        const isSingle = calls.length === 1;

        if (isSingle) {
            const r = await runOneCall(calls[0], 0, []);

            if (r.cancelled || cancelled) {
                const res = { isOk: false, status: "canceled" };
                return res;
            }

            if (r.isOk) {
                const res = { isOk: true, status: "success", response: r.data };
                onSuccess?.(res);
                return res;
            }

            errors.push({ index: 0, error: r.error });
            const res = { isOk: false, status: "error", response: null, errors };
            onError?.(res);
            return res;
        }

        if (enableSynchronousCalls) {
            for (let i = 0; i < calls.length; i++) {
                if (cancelled) break;

                const r = await runOneCall(calls[i], i, results);

                if (r.cancelled || cancelled) {
                    cancelled = true;
                    break;
                }

                if (r.isOk) {
                    results.push(r.data);
                    responses.push(r.data);
                } else {
                    errors.push({ index: i, error: r.error });
                    break;
                }
            }
        } else {
            const all = await Promise.all(calls.map((c, i) => runOneCall(c, i, [])));

            all.forEach((r, i) => {
                if (r.cancelled) cancelled = true;
                if (r.isOk) responses.push(r.data);
                else if (!r.cancelled) errors.push({ index: i, error: r.error });
            });
        }

        if (cancelled) {
            const res = { isOk: false, status: "canceled" };
            return res;
        }

        const isOk = errors.length === 0;

        const finalRes = {
            isOk,
            status: isOk ? "success" : "error",
            responses,
            ...(errors.length ? { errors } : {}),
        };

        if (isOk) onSuccess?.(finalRes);
        else onError?.(finalRes);

        return finalRes;
    })();

    return { promise, cancelFetch };
};

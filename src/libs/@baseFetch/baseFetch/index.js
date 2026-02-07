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
        envUrl = envUrlGlobal || null,
    } = jointSettings || {};

    const controllers = [];
    let killed = false;

    const killFetch = (reason = "killed") => {
        killed = true;
        controllers.forEach((c) => {
            try {
                c.abort(reason);
            } catch {
                console.error("Error in killFetch:", reason);
            }
        });
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
                ok: false,
                status: "error",
                responses: [],
                errors: validationErrors,
                killed: false,
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

            const isAbsolute = isAbsoluteUrl(url);
            const resolvedCredentials = credentials ?? (isAbsolute ? "omit" : "include");
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
                    const handled = typeof onEnd === "function" ? onEnd(cached, null) : cached;
                    return { ok: true, fromCache: true, data: handled, raw: cached };
                }
            }

            let queueName = null;
            if (!disableLoadingApi && loadingApi?.add) {
                try {
                    queueName = loadingApi.add({ url: fullUrl, method: finalMethod });
                } catch {
                    console.error("Error in loadingApi.add:", url);
                }
            }

            try {
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
                    if (!init.headers.Authorization)
                        init.headers.Authorization = `Bearer ${resolvedToken}`;
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
                    if (ttlMs > 0) {
                        addToCache({ cacheKey, data: handled, ttlMs });
                    }
                }

                return { ok: true, fromCache: false, data: handled, raw: parsed };
            } catch (err) {
                let handledErr = err;
                if (typeof onEnd === "function") {
                    try {
                        const maybe = await onEnd(null, err);
                        if (maybe !== undefined) handledErr = maybe;
                    } catch {
                        console.error("Error in onEnd:", err);
                    }
                }
                return { ok: false, error: handledErr };
            } finally {
                if (!disableLoadingApi && queueName && loadingApi?.remove) {
                    try {
                        loadingApi.remove(queueName);
                    } catch {
                        console.error("Error in loadingApi.remove:", queueName);
                    }
                }
            }
        };

        if (calls.length === 1) {
            const r = await runOneCall(calls[0], 0, []);
            if (r.ok) {
                responses.push(r.data);
                const res = { ok: true, status: "success", responses: r.data, errors: [], killed };
                onSuccess?.(res);
                return res;
            }
            errors.push({ index: 0, error: r.error });
            const res = { ok: false, status: "error", responses: null, errors, killed };
            onError?.(res);
            return res;
        }

        if (enableSynchronousCalls) {
            for (let i = 0; i < calls.length; i++) {
                if (killed) break;
                const r = await runOneCall(calls[i], i, results);
                if (r.ok) {
                    results.push(r.data);
                    responses.push(r.data);
                } else {
                    errors.push({ index: i, error: r.error });
                    break;
                }
            }
        } else {
            // parallel
            const all = await Promise.all(calls.map((c, i) => runOneCall(c, i, [])));
            all.forEach((r, i) => {
                if (r.ok) responses.push(r.data);
                else errors.push({ index: i, error: r.error });
            });
        }

        const ok = errors.length === 0 && !killed;

        const finalRes = {
            ok,
            status: ok ? "success" : "error",
            responses,
            errors,
            killed,
        };

        if (ok) onSuccess?.(finalRes);
        else onError?.(finalRes);

        return finalRes;
    })();

    return { promise, killFetch };
};

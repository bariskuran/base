export const API_RESPONSE_CODES = {
    // Network / Client-side
    0: [0, "No internet connection."],
    1: [0, "No response from the server."],

    // 2xx – Success
    200: [1, "Process successfully completed."],
    201: [1, "Resource successfully created."],
    202: [1, "Request accepted and processing started."],
    204: [1, "Process completed successfully (no content)."],
    206: [1, "Partial content delivered."],

    // 3xx – Redirect / Cache
    301: [0, "Resource permanently moved."],
    302: [0, "Resource temporarily moved."],
    304: [1, "Not modified. Cached version is valid."],

    // 4xx – Client errors
    400: [0, "Bad request."],
    401: [0, "Authentication required."],
    403: [0, "You do not have permission to perform this action."],
    404: [0, "Requested resource not found."],
    405: [0, "Method not allowed."],
    406: [0, "Not acceptable."],
    407: [0, "Proxy authentication required."],
    408: [0, "Request timeout."],
    409: [0, "Conflict detected."],
    410: [0, "Resource no longer available."],
    413: [0, "Payload too large."],
    415: [0, "Unsupported media type."],
    422: [0, "Validation failed."],
    429: [0, "Too many requests. Please slow down."],

    // 5xx – Server / Infrastructure errors
    500: [0, "Internal server error."],
    501: [0, "Not implemented."],
    502: [0, "Bad gateway."],
    503: [0, "Service unavailable."],
    504: [0, "Gateway timeout."],
    505: [0, "HTTP version not supported."],

    // Cloudflare / CDN specific
    520: [0, "Unknown server error."],
    521: [0, "Web server is down."],
    522: [0, "Connection timed out."],
    523: [0, "Origin server unreachable."],
    524: [0, "A timeout occurred."],

    // Fallback
    unknown: [0, "Unexpected error occurred."],
};

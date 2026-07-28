import { useEffect, useRef, useSyncExternalStore } from "react";

const DEFAULT_CONTROLLER_ID = "default";
const factories = new Map();
const entries = new Map();
const listeners = new Set();
let version = 0;

const notify = () => {
    version += 1;
    listeners.forEach((listener) => listener());
};

const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

const getVersion = () => version;
const getControllerKey = (name, controllerId) => `${name}:${controllerId}`;

const createBasicController = () => {
    const state = {};
    return {
        getState: () => state,
        getPublicState: () => ({}),
    };
};

export const registerLayoutControllerFactory = (name, factory) => {
    factories.set(name, factory);
};

export const normalizeControllerId = (controllerId) =>
    controllerId == null || controllerId === "" ? DEFAULT_CONTROLLER_ID : String(controllerId);

export const getLayoutControllerEntry = (name, controllerId = DEFAULT_CONTROLLER_ID) => {
    const normalizedId = normalizeControllerId(controllerId);
    const key = getControllerKey(name, normalizedId);

    if (!entries.has(key)) {
        const factory = factories.get(name) || createBasicController;
        entries.set(key, {
            key,
            name,
            controllerId: normalizedId,
            controller: factory({ notify }),
            owners: new Set(),
        });
    }

    return entries.get(key);
};

const getPublicController = (name, controllerId) => {
    const entry = getLayoutControllerEntry(name, controllerId);
    return {
        ...entry.controller.getPublicState(),
        controllerName: entry.name,
        controllerId: entry.controllerId,
        hasDuplicateController: entry.owners.size > 1,
    };
};

const normalizeSelector = (selector, options = {}) => {
    if (typeof selector === "string") {
        return {
            name: selector,
            controllerId: normalizeControllerId(options.controllerId),
        };
    }

    if (selector && typeof selector === "object" && !Array.isArray(selector)) {
        return {
            name: selector.name,
            controllerId: normalizeControllerId(selector.controllerId),
        };
    }

    return { name: "", controllerId: DEFAULT_CONTROLLER_ID };
};

export const useLayout = (selector, options = {}) => {
    useSyncExternalStore(subscribe, getVersion, getVersion);

    if (Array.isArray(selector)) {
        return selector.map((item) => {
            const normalized = normalizeSelector(item);
            return getPublicController(normalized.name, normalized.controllerId);
        });
    }

    const normalized = normalizeSelector(selector, options);
    return getPublicController(normalized.name, normalized.controllerId);
};

export const useLayoutControllerOwner = (name, controllerId) => {
    const ownerRef = useRef(null);
    if (!ownerRef.current) ownerRef.current = Symbol(`${name}:${controllerId}`);

    const entry = getLayoutControllerEntry(name, controllerId);
    useSyncExternalStore(subscribe, getVersion, getVersion);

    useEffect(() => {
        entry.owners.add(ownerRef.current);
        notify();

        return () => {
            entry.owners.delete(ownerRef.current);
            notify();
        };
    }, [entry]);

    return {
        hasDuplicateController: entry.owners.size > 1,
        controllerId: entry.controllerId,
    };
};

export const getLayoutController = (name, controllerId) =>
    getLayoutControllerEntry(name, controllerId).controller;

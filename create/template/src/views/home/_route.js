import { lazy } from "base";
const Component = lazy(() => import("./index.jsx"));

const title = {
    tr: "",
    en: "",
};
const path = { tr: "/", en: "/" };

const route = { Component, path, handle: { isHome: true, title, path } };
export default route;

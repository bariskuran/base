// Design System is deliberately a separate entry point. Re-exporting it from
// the runtime entry makes Vite discover every documentation page and its lazy
// imports even when the Design System route is disabled for production.
export { default } from "./libs/DesignSystem";
export { default as DS } from "./libs/DesignSystem";

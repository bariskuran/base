import { isArray } from "../isArray";
import { isPlainObject } from "../isPlainObject";

export const isArrayOrPlainObject = (v) => isArray(v) || isPlainObject(v);

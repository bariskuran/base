import { useMemo } from "react";
import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { manageSearchParams } from ".";
import { baseStore } from "../@baseStore";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const PATH_BASIC = "manageSearchParams-basic";
const PATH_BASE64 = "manageSearchParams-disableBase64";
const PATH_TYPE = "manageSearchParams-disableTypeControl";
const PATH_MAP_DEFAULTS = "manageSearchParams-mapping-defaults";
const PATH_DEFAULTS_SYNC = "manageSearchParams-setDefaultsOnMount";
const PATH_MAX = "manageSearchParams-maxLength";

const TYPE_TEST_PAYLOAD = {
    boolTrue: "TRUE",
    boolFalse: "false",
    intValue: "2",
    floatValue: "2.1",
    text: "v2a",
    leadingZero: "007",
    scientific: "1e5",
    nullWord: "null",
    undefinedWord: "undefined",
    jsonLike: '{"a":1}',
    emptyString: "",
};

const X = () => {
    const searchKey = baseStore.useGlobal((s) => s._reactRouterDom?.location?.search ?? "");
    const [params] = useMemo(() => manageSearchParams.get(), [searchKey]);
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    const page = params?.page ?? 1;

    return (
        <Ds.page
            title="manageSearchParams()"
            releasedOn="1.0.0"
            description={
                <>
                    Center utility for URL query state. All core features are managed here.
                    <br />
                    <br />
                    For React components, use{" "}
                    <Button.string to="/design-system/useSearchParams" label="useSearchParams" /> as
                    a thin wrapper.
                </>
            }
        >
            <Ds.block
                title="Basic Usage"
                description="Default flow with typed markers + base64."
                code={`import { manageSearchParams } from "${SYS.basePath}";

                    manageSearchParams.set({ page: 2, active: true });
                    const [params] = manageSearchParams.get();
                    manageSearchParams.clear();`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Typo.span>
                            live page: <Typo.code>{page}</Typo.code>
                        </Typo.span>
                        <Flex wrap gap={10}>
                            <Button.plain
                                label="set"
                                {...outputButtonProps({
                                    path: PATH_BASIC,
                                    activeLabel: "set",
                                    fn: () => manageSearchParams.set({ page: 2, active: true }),
                                })}
                            />
                            <Button.plain
                                label="get"
                                {...outputButtonProps({
                                    path: PATH_BASIC,
                                    activeLabel: "get",
                                    fn: () => manageSearchParams.get(),
                                })}
                            />
                            <Button.plain
                                label="clear"
                                {...outputButtonProps({
                                    path: PATH_BASIC,
                                    activeLabel: "clear",
                                    fn: () => {
                                        manageSearchParams.clear();
                                        return manageSearchParams.get();
                                    },
                                })}
                            />
                        </Flex>
                        <Output path={PATH_BASIC} />
                    </Flex.column>
                }
            />

            <Ds.block
                title="disableBase64"
                description="Writes raw query string instead of base64."
                code="manageSearchParams.set({ page: 3, rawMode: true }, { disableBase64: true });"
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex wrap gap={10}>
                            <Button.plain
                                label="set"
                                {...outputButtonProps({
                                    path: PATH_BASE64,
                                    activeLabel: "set",
                                    fn: () =>
                                        manageSearchParams.set(
                                            { page: 3, rawMode: true },
                                            { disableBase64: true },
                                        ),
                                })}
                            />
                            <Button.plain
                                label="get"
                                {...outputButtonProps({
                                    path: PATH_BASE64,
                                    activeLabel: "get",
                                    fn: () => manageSearchParams.get(),
                                })}
                            />
                            <Button.plain
                                label="clear"
                                {...outputButtonProps({
                                    path: PATH_BASE64,
                                    activeLabel: "clear",
                                    fn: () => {
                                        manageSearchParams.clear();
                                        return manageSearchParams.get();
                                    },
                                })}
                            />
                        </Flex>
                        <Output path={PATH_BASE64} />
                    </Flex.column>
                }
            />

            <Ds.block
                title="disableTypeControl"
                description="Disables (*n*) type markers. get() still tries to infer booleans/numbers, but can be less consistent than full type control."
                code="manageSearchParams.set(TYPE_TEST_PAYLOAD, { disableTypeControl: true, disableBase64: true });"
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex wrap gap={10}>
                            <Button.plain
                                label="set"
                                {...outputButtonProps({
                                    path: PATH_TYPE,
                                    activeLabel: "set",
                                    fn: () =>
                                        manageSearchParams.set(TYPE_TEST_PAYLOAD, {
                                            disableTypeControl: true,
                                            disableBase64: true,
                                        }),
                                })}
                            />
                            <Button.plain
                                label="get"
                                {...outputButtonProps({
                                    path: PATH_TYPE,
                                    activeLabel: "types",
                                    fn: () => {
                                        const [next] = manageSearchParams.get();
                                        return {
                                            params: next,
                                            typeMap: Object.fromEntries(
                                                Object.keys(TYPE_TEST_PAYLOAD).map((k) => [
                                                    k,
                                                    typeof next?.[k],
                                                ]),
                                            ),
                                        };
                                    },
                                })}
                            />
                            <Button.plain
                                label="clear"
                                {...outputButtonProps({
                                    path: PATH_TYPE,
                                    activeLabel: "clear",
                                    fn: () => {
                                        manageSearchParams.clear();
                                        return manageSearchParams.get();
                                    },
                                })}
                            />
                        </Flex>
                        <Output path={PATH_TYPE} />
                    </Flex.column>
                }
            />

            <Ds.block
                title="mapping + defaults"
                description="defaults fills missing values. mapping (byPath-style) picks/renames fields in get()."
                code={`manageSearchParams.set({ user: { name: "Selin" }, page: 3 });
                        manageSearchParams.get({
                          defaults: { page: 1, perPage: 20 },
                          mapping: { username: "user.name", page: "page", perPage: "perPage" },
                        });`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex wrap gap={10}>
                            <Button.plain
                                label="set"
                                {...outputButtonProps({
                                    path: PATH_MAP_DEFAULTS,
                                    activeLabel: "set",
                                    fn: () =>
                                        manageSearchParams.set({ user: { name: "Ada" }, page: 3 }),
                                })}
                            />
                            <Button.plain
                                label="get"
                                {...outputButtonProps({
                                    path: PATH_MAP_DEFAULTS,
                                    activeLabel: "get",
                                    fn: () =>
                                        manageSearchParams.get({
                                            defaults: { page: 1, perPage: 20 },
                                            mapping: {
                                                username: "user.name",
                                                page: "page",
                                                perPage: "perPage",
                                            },
                                        }),
                                })}
                            />
                            <Button.plain
                                label="clear"
                                {...outputButtonProps({
                                    path: PATH_MAP_DEFAULTS,
                                    activeLabel: "clear",
                                    fn: () => {
                                        manageSearchParams.clear();
                                        return manageSearchParams.get();
                                    },
                                })}
                            />
                        </Flex>
                        <Output path={PATH_MAP_DEFAULTS} />
                    </Flex.column>
                }
            />

            <Ds.block
                title="defaults + setDefaultsOnMount / disableSetDefaults"
                description="get: URL wins; missing default keys fill the return value. setDefaultsOnMount (default true) syncs them to URL on get. set: by default defaults are merged; disableSetDefaults: true writes only the object you pass."
                code={`manageSearchParams.set({ page: 5 });
                    manageSearchParams.get({ defaults: { page: 1, offset: 1 } });
                    // → { page: 5, offset: 1 } and URL gains offset

                    manageSearchParams.get({
                      defaults: { page: 1, offset: 1 },
                      setDefaultsOnMount: false,
                    });
                    // → read-only defaults, no URL write`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex wrap gap={10}>
                            <Button.plain
                                label="set page=5"
                                {...outputButtonProps({
                                    path: PATH_DEFAULTS_SYNC,
                                    activeLabel: "set",
                                    fn: () => manageSearchParams.set({ page: 5 }),
                                })}
                            />
                            <Button.plain
                                label="get + sync"
                                {...outputButtonProps({
                                    path: PATH_DEFAULTS_SYNC,
                                    activeLabel: "get",
                                    fn: () =>
                                        manageSearchParams.get({
                                            defaults: { page: 1, offset: 1 },
                                            replace: true,
                                        }),
                                })}
                            />
                            <Button.plain
                                label="get (no sync)"
                                {...outputButtonProps({
                                    path: PATH_DEFAULTS_SYNC,
                                    activeLabel: "get-no-sync",
                                    fn: () =>
                                        manageSearchParams.get({
                                            defaults: { page: 1, offset: 1 },
                                            setDefaultsOnMount: false,
                                        }),
                                })}
                            />
                            <Button.plain
                                label="clear"
                                {...outputButtonProps({
                                    path: PATH_DEFAULTS_SYNC,
                                    activeLabel: "clear",
                                    fn: () => {
                                        manageSearchParams.clear();
                                        return manageSearchParams.get();
                                    },
                                })}
                            />
                        </Flex>
                        <Output path={PATH_DEFAULTS_SYNC} />
                    </Flex.column>
                }
            />

            <Ds.block
                title="maxLength"
                description="Omitted maxLength uses browser full-URL budget. Overflow drops whole top-level props (never partial). Small custom maxLength below is only for demo."
                code={`manageSearchParams.set(
                          { a: "11111111111111111111", b: "22222222222222222222", c: "33333333333333333333" },
                          { maxLength: 70, disableBase64: true },
                        );`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex wrap gap={10}>
                            <Button.plain
                                label="set"
                                {...outputButtonProps({
                                    path: PATH_MAX,
                                    activeLabel: "set",
                                    fn: () =>
                                        manageSearchParams.set(
                                            {
                                                a: "11111111111111111111",
                                                b: "22222222222222222222",
                                                c: "33333333333333333333",
                                            },
                                            { maxLength: 70, disableBase64: true },
                                        ),
                                })}
                            />
                            <Button.plain
                                label="get"
                                {...outputButtonProps({
                                    path: PATH_MAX,
                                    activeLabel: "get",
                                    fn: () => manageSearchParams.get(),
                                })}
                            />
                            <Button.plain
                                label="clear"
                                {...outputButtonProps({
                                    path: PATH_MAX,
                                    activeLabel: "clear",
                                    fn: () => {
                                        manageSearchParams.clear();
                                        return manageSearchParams.get();
                                    },
                                })}
                            />
                        </Flex>
                        <Output path={PATH_MAX} />
                    </Flex.column>
                }
            />

            <Ds.api
                title="get"
                disableLastBlock
                args="const [params, raw] = manageSearchParams.get({ mapping, defaults, setDefaultsOnMount, replace, maxLength, skipSet });"
                props={{
                    mapping: {
                        description:
                            "byPath.mapping selector/renamer (example: { username: 'user.name' }).",
                        type: "object",
                    },
                    defaults: {
                        description:
                            "Fallback values for keys missing in URL. URL values win on conflicts. Merged into return before mapping.",
                        type: "object",
                    },
                    setDefaultsOnMount: {
                        description:
                            "When true (default), writes merged defaults to URL if parsed query differs (adds missing keys only; does not overwrite URL values).",
                        type: "boolean",
                        defaultValue: "true",
                    },
                    replace: {
                        description: "History replace mode when default sync triggers set.",
                        type: "boolean",
                        defaultValue: "true",
                    },
                    maxLength: {
                        description:
                            "URL budget used when default sync triggers set. Omitted uses browser full-URL budget.",
                        type: "number",
                    },
                    skipSet: {
                        description: "Prevents navigation when default sync triggers set.",
                        type: "boolean",
                    },
                }}
                returnProps={{
                    params: {
                        description:
                            "Decoded query merged with defaults (URL wins), optionally mapped.",
                        type: "object",
                    },
                    raw: {
                        description: "Decoded payload string when available.",
                        type: "string | undefined",
                    },
                }}
            />

            <Ds.api
                title="set"
                disableLastBlock
                args="const [payload, rawString] = manageSearchParams.set(object, { defaults, disableSetDefaults, skipSet, maxLength, disableBase64, disableTypeControl, replace });"
                props={{
                    object: {
                        description:
                            "Values to encode into the query. Unless disableSetDefaults is true, missing default keys are added. object wins on conflicts. null/undefined keys are skipped.",
                        type: "object",
                        required: true,
                    },
                    defaults: {
                        description:
                            "Fallback keys merged before encode (same rule as get). object values override defaults.",
                        type: "object",
                    },
                    disableSetDefaults: {
                        description:
                            "When true, defaults are not merged into object (only keys you pass are encoded). Default false.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    skipSet: {
                        description: "If true, only returns encoded payload; does not navigate.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    maxLength: {
                        description:
                            "Omitted: browser full-URL budget. 0: no limit. Number: min(your value, browser budget). Overflow drops whole top-level props.",
                        type: "number",
                    },
                    disableBase64: {
                        description: "If true, writes raw (non-base64) query string.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    disableTypeControl: {
                        description:
                            "If true, set() writes plain values without type markers. get() auto-infers booleans/numbers.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    replace: {
                        description: "History replace mode for navigate.",
                        type: "boolean",
                        defaultValue: "true",
                    },
                }}
                returnProps={{
                    payload: {
                        description: "Encoded query payload (without leading ?).",
                        type: "string",
                    },
                    rawString: {
                        description: "Raw typed string before base64.",
                        type: "string",
                    },
                }}
            />

            <Ds.api
                title="clear"
                args="manageSearchParams.clear({ replace, skipSet });"
                props={{
                    skipSet: {
                        description: "If true, does not navigate.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    replace: {
                        description: "History replace mode for navigate.",
                        type: "boolean",
                        defaultValue: "true",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

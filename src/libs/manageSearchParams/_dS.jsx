import { useMemo } from "react";
import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { manageSearchParams } from ".";
import { baseStore } from "../@baseStore";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { Flex } from "../Flex";

const PATH_GET = "manageSearchParams-get";
const PATH_SET = "manageSearchParams-set";
const PATH_CLEAR = "manageSearchParams-clear";

const X = () => {
    const searchKey = baseStore.useGlobal((s) => s._reactRouterDom?.location?.search ?? "");
    const [params] = useMemo(() => manageSearchParams.get(), [searchKey]);
    const { outputButtonProps, Output } = Ds.useOutputViewer();

    const page = params?.page ?? 1;

    const setNextPage = () => {
        manageSearchParams.set({ page: (params?.page ?? 1) + 1 });
    };

    const setNextPageWithoutAtoB = () => {
        manageSearchParams.set({ page: (params?.page ?? 1) + 1 }, { disableAToB: true });
    };

    return (
        <Ds.page
            title="manageSearchParams()"
            releasedOn="1.0.0"
            description={
                <>
                    Typed, nested URL search-params utility. Reads and writes the query string
                    through React Router navigation.
                    <br />
                    <br />
                    Works in isolated (non-React) functions. For React components, use
                    <br />
                    <Button.string
                        to="/design-system/useManageSearchParams"
                        label="useManageSearchParams"
                    />{" "}
                    as a thin hook wrapper.
                </>
            }
        >
            <Ds.block
                title="Live set & clear example"
                description="Reads the current route query via manageSearchParams.get(). Change the address bar or use the buttons below."
                code={`import { manageSearchParams } from "${SYS.basePath}";

                        const [params, raw] = manageSearchParams.get();`}
                example={
                    <Flex.column gap={8} padding={10} full>
                        <Typo.span>
                            page: <Typo.code>{page}</Typo.code>
                        </Typo.span>
                        <Typo.code codeFormat={false}>
                            {JSON.stringify(params ?? {}, null, 2)}
                        </Typo.code>
                        <Flex wrap gap={8}>
                            <Button label="Set +1" onClick={setNextPage} />
                            <Button
                                label="Set +1 without base64"
                                onClick={setNextPageWithoutAtoB}
                            />
                            <Button label="Clear" onClick={() => manageSearchParams.clear()} />
                        </Flex>
                    </Flex.column>
                }
            />
            <Ds.block
                title="set — write query"
                code={`import { manageSearchParams } from "${SYS.basePath}";

                    const [current] = manageSearchParams.get();
                                
                    manageSearchParams.set({
                        page: (current?.page ?? 1) + 1,
                        filters: { active: true },
                    });
                                
                    // Encode only, skip navigation:
                    manageSearchParams.set({ a: 1 }, { skipSetAndReturnEncoded: true });`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex wrap gap={10}>
                            <Button.plain
                                label='set({ page: 2, tag: "ds" })'
                                {...outputButtonProps({
                                    path: PATH_SET,
                                    activeLabel: "set",
                                    fn: () => {
                                        manageSearchParams.set({ page: 2, tag: "ds" });
                                        return manageSearchParams.get();
                                    },
                                })}
                            />
                            <Button.plain
                                label="set with skipSetAndReturnEncoded"
                                {...outputButtonProps({
                                    path: PATH_SET,
                                    activeLabel: "encode",
                                    fn: () =>
                                        manageSearchParams.set(
                                            { page: 3, demo: true },
                                            { skipSetAndReturnEncoded: true },
                                        ),
                                })}
                            />
                        </Flex>
                        <Output path={PATH_SET} />
                    </Flex.column>
                }
            />
            <Ds.block
                title="get / clear"
                code={`import { manageSearchParams } from "${SYS.basePath}";

const [params] = manageSearchParams.get();
manageSearchParams.clear();

// clear without navigation:
manageSearchParams.clear({ skipSetAndReturnEncoded: true });`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex wrap gap={10}>
                            <Button.plain
                                label="manageSearchParams.get()"
                                {...outputButtonProps({
                                    path: PATH_GET,
                                    activeLabel: "get",
                                    fn: () => manageSearchParams.get(),
                                })}
                            />
                            <Button.plain
                                label="manageSearchParams.clear()"
                                {...outputButtonProps({
                                    path: PATH_CLEAR,
                                    activeLabel: "clear",
                                    fn: () => {
                                        manageSearchParams.clear();
                                        return manageSearchParams.get();
                                    },
                                })}
                            />
                        </Flex>
                        <Output path={PATH_GET} />
                        <Output path={PATH_CLEAR} />
                    </Flex.column>
                }
            />
            <Ds.api
                title="get"
                disableLastBlock
                args="const [params, raw] = manageSearchParams.get();"
                returnProps={{
                    params: {
                        description: "Decoded query object.",
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
                args="const [payload, rawString] = manageSearchParams.set(object, options);"
                props={{
                    object: {
                        description:
                            "Values to encode into the query. null/undefined keys are skipped.",
                        type: "object",
                        required: true,
                    },
                    skipSetAndReturnEncoded: {
                        description: "If true, only returns encoded payload; does not navigate.",
                        type: "boolean",
                        defaultValue: "false",
                    },
                    maxLength: {
                        description: "If > 0 and payload exceeds length, query is cleared.",
                        type: "number",
                        defaultValue: "0",
                    },
                    disableAToB: {
                        description: "If true, writes raw (non-base64) query string.",
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
                args="manageSearchParams.clear(options);"
                props={{
                    skipSetAndReturnEncoded: {
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

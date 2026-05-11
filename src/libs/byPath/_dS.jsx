import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { byPath } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";
import { Button } from "../Button";

const dataReset = { user: { profile: { name: "Baris" } } };
const dataReset2 = { user: { profile: { name: "Baris" } }, items: [{ id: 1 }, { id: 2 }] };

const PATH_BASIC = "byPath-basic";
const PATH_MAPPING = "byPath-mapping";

const X = () => {
    const { data, setLocal } = baseStore.useLocal({
        data: dataReset,
    });
    const { outputButtonProps, Output, clearOutput } = Ds.useOutputViewer();

    return (
        <Ds.page
            title="byPath()"
            releasedOn="1.0.0"
            description="Path-based get/set/delete helpers. This function is not suitable for React components or state management. For state management, I recommend using 'baseStore', which integrates byPath directly. This function is more appropriate as a utility helper for use within isolated functions."
        >
            <Ds.block
                title="Get / Set / Delete"
                code={`import { byPath } from "${SYS.basePath}";

                const result = byPath.get(data, 'user.profile.name');
                byPath.set(data, "user.profile.name", "Selin");
                byPath.delete(data, 'user.profile.name');`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Typo.code>data = {JSON.stringify(data)}</Typo.code>
                        <Flex gap={10} full wrap>
                            <Button.plain
                                label="byPath.get(data, 'user.profile.name')"
                                {...outputButtonProps({
                                    path: PATH_BASIC,
                                    activeLabel: "get",
                                    fn: () => byPath.get(data, "user.profile.name"),
                                })}
                            />
                            <Button.plain
                                label='byPath.set(data, "user.profile.name", "Selin")'
                                {...outputButtonProps({
                                    path: PATH_BASIC,
                                    activeLabel: "set",
                                    fn: () => {
                                        const next = byPath.set(data, "user.profile.name", "Selin");
                                        setLocal((s) => {
                                            s.data = next;
                                        });
                                        return next;
                                    },
                                })}
                            />
                            <Button.plain
                                label="byPath.delete(data, 'user.profile.name')"
                                {...outputButtonProps({
                                    path: PATH_BASIC,
                                    activeLabel: "delete",
                                    fn: () => {
                                        const next = byPath.delete(data, "user.profile.name");
                                        setLocal((s) => {
                                            s.data = next;
                                        });
                                        return next;
                                    },
                                })}
                            />
                        </Flex>
                        <Button.plain
                            label="Reset"
                            onClick={() => {
                                setLocal((s) => {
                                    s.data = dataReset;
                                });
                                clearOutput(PATH_BASIC);
                            }}
                        />
                        <Output path={PATH_BASIC} />
                    </Flex.column>
                }
            />
            <Ds.block
                title="Mapping"
                description="Mapping is a helper function that allows you to pick/rename values from an object by paths. Shortly, it creates a new object with the mapped values."
                code={`import { byPath } from "${SYS.basePath}";

                    const mapped = byPath.mapping(data, {
                      username: "user.profile.name",
                      firstId: "items.0.id",
                    });`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Typo.pre>data = {JSON.stringify(dataReset2)}</Typo.pre>
                        <Button.plain
                            label="byPath.mapping(data, { username: 'user.profile.name', firstId: 'items.0.id' })"
                            {...outputButtonProps({
                                path: PATH_MAPPING,
                                activeLabel: "mapping",
                                fn: () =>
                                    byPath.mapping(dataReset2, {
                                        username: "user.profile.name",
                                        firstId: "items.0.id",
                                    }),
                            })}
                        />
                        <Output path={PATH_MAPPING} />
                    </Flex.column>
                }
            />
            <Ds.api
                args={[
                    "byPath.get(object, path);",
                    "byPath.set(object, path, value, enableDirectUpdate);",
                    "byPath.delete(object, path, enableDirectUpdate);",
                    "byPath.mapping(object, mappingObject);",
                ]}
                props={{
                    get: {
                        description: "get(obj, path)",
                        type: "(object, string) => any",
                        required: true,
                    },
                    set: {
                        description: "set(state, path, value, enableDirectUpdate?)",
                        type: "(any, string, any, boolean?) => any",
                        required: true,
                    },
                    delete: {
                        description: "delete(state, path, enableDirectUpdate?)",
                        type: "(any, string, boolean?) => any",
                        required: true,
                    },
                    mapping: {
                        description: "mapping(source, mapObject)",
                        type: "(object, object) => object",
                        required: true,
                    },
                }}
                returns="Object with get, set, delete, and mapping helpers."
            />
        </Ds.page>
    );
};

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { byPath } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";
import { Button } from "../Button";
import { Space } from "../Space";

const dataReset = { user: { profile: { name: "Baris" } } };
const dataReset2 = { user: { profile: { name: "Baris" } }, items: [{ id: 1 }, { id: 2 }] };

const X = () => {
    const { data, output, output2, setLocal } = baseStore.useLocal({
        data: dataReset,
        output: null,
        output2: null,
    });

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
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Typo.pre>data = {JSON.stringify(data)}</Typo.pre>
                        <Button.string
                            label="byPath.get(data, 'user.profile.name')"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output = byPath.get(data, "user.profile.name");
                                })
                            }
                        />
                        <Button.string
                            label='byPath.set(data, "user.profile.name", "Selin")'
                            onClick={() => {
                                const newData = byPath.set(data, "user.profile.name", "Selin");
                                setLocal((s) => {
                                    s.data = newData;
                                    s.output = JSON.stringify(newData);
                                });
                            }}
                        />
                        <Button.string
                            label="byPath.delete(data, 'user.profile.name')"
                            onClick={() => {
                                const newData = byPath.delete(data, "user.profile.name");
                                setLocal((s) => {
                                    s.data = newData;
                                    s.output = JSON.stringify(newData);
                                });
                            }}
                        />
                        <Button.plain
                            label="Reset"
                            onClick={() => {
                                setLocal((s) => {
                                    s.data = dataReset;
                                    s.output = null;
                                });
                            }}
                        />
                        <Space size="l" />
                        {output && <Typo.span balance>Output or Result:</Typo.span>}
                        <Typo.span balance>{output}</Typo.span>
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
                    <Flex.column xAlign="start" gap={10} padding={10}>
                        <Typo.pre>data = {JSON.stringify(dataReset2)}</Typo.pre>
                        <Button.plain
                            label="byPath.mapping(data, { username: 'user.profile.name', firstId: 'items.0.id' })"
                            onClick={() =>
                                setLocal((s) => {
                                    s.output2 = JSON.stringify(
                                        byPath.mapping(dataReset2, {
                                            username: "user.profile.name",
                                            firstId: "items.0.id",
                                        }),
                                    );
                                })
                            }
                        />
                        <Space size="l" />
                        {output2 && <Typo.span balance>Output or Result:</Typo.span>}
                        <Typo.span balance>{output2}</Typo.span>
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

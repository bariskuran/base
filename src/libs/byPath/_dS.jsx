import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { byPath } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";

const source = { user: { profile: { name: "Baris" } }, items: [{ id: 1 }] };
const mapped = byPath.mapping(source, { username: "user.profile.name", firstId: "items.0.id" });

const X = () => (
    <Ds.page title="<byPath>" releasedOn="1.0.0" description="Path based get/set/delete helpers.">
        <Ds.block
            title="Get / Set / Delete"
            code={`import { byPath } from "${SYS.basePath}";

const data = { user: { profile: { name: "Baris" } } };
const name = byPath.get(data, "user.profile.name");
const next = byPath.set(data, "user.profile.age", 29);
const cleared = byPath.delete(next, "user.profile.name");`}
            example={
                <Flex.column xAlign="start" gap={5}>
                    <Typo.span children={`get: ${byPath.get(source, "user.profile.name")}`} />
                    <Typo.span
                        children={`set age: ${JSON.stringify(
                            byPath.set(source, "user.profile.age", 29).user.profile,
                        )}`}
                    />
                    <Typo.span
                        children={`delete name: ${JSON.stringify(
                            byPath.delete(source, "user.profile.name").user.profile,
                        )}`}
                    />
                </Flex.column>
            }
        />
        <Ds.block
            title="Mapping"
            code={`const mapped = byPath.mapping(data, {
  username: "user.profile.name",
  firstId: "items.0.id",
});`}
            example={<Typo.span children={JSON.stringify(mapped)} />}
        />
        <Ds.api
            props={{
                get: {
                    description: "get(obj, path)",
                    type: "(object, string) => any",
                    required: true,
                    defaultValue: "function",
                },
                set: {
                    description: "set(state, path, value, enableDirectUpdate?)",
                    type: "(any, string, any, boolean?) => any",
                    required: true,
                    defaultValue: "function",
                },
                delete: {
                    description: "delete(state, path, enableDirectUpdate?)",
                    type: "(any, string, boolean?) => any",
                    required: true,
                    defaultValue: "function",
                },
                mapping: {
                    description: "mapping(source, mapObject)",
                    type: "(object, object) => object",
                    required: true,
                    defaultValue: "function",
                },
            }}
        />
    </Ds.page>
);

export default X;

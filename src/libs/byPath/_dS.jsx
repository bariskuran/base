import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { byPath } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { baseStore } from "../baseStore";
import { Button } from "../Button";

const dataReset = { user: { profile: { name: "Baris" } } };
const dataReset2 = { user: { profile: { name: "Baris" } }, items: [{ id: 1 }, { id: 2 }] };

const PATH_BASIC = "byPath-basic";
const PATH_MAPPING = "byPath-mapping";

const X = () => {
    const { data, set } = baseStore.useLocal({
        data: dataReset,
    });
    const { outputButtonProps, Output, clearOutput } = Ds.useOutputViewer();

    return (
        <Ds.page
            title="byPath()"
            releasedOn="1.0.0"
            description={{
                tr: "Yola dayalı get/set/delete yardımcılarıdır. Bu fonksiyon React componentleri veya state yönetimi için uygun değildir. State yönetiminde byPath'i doğrudan kullanan baseStore önerilir. Daha çok bağımsız fonksiyonlarda kullanılacak bir yardımcı olarak tasarlanmıştır.",
                en: "Path-based get/set/delete helpers. This function is not suitable for React components or state management. For state management, use baseStore, which integrates byPath directly. It is intended as a utility helper inside isolated functions.",
            }}
        >
            <Ds.block
                title={{ tr: "Get / Set / Delete", en: "Get / Set / Delete" }}
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
                                        set((s) => {
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
                                        set((s) => {
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
                                set((s) => {
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
                title={{ tr: "Mapping", en: "Mapping" }}
                description={{
                    tr: "Mapping, bir nesneden yollar aracılığıyla değer seçmenizi veya yeniden adlandırmanızı sağlayan yardımcı fonksiyondur. Kısaca eşlenen değerlerden yeni bir nesne üretir.",
                    en: "Mapping is a helper that lets you pick or rename values from an object by paths. In short, it creates a new object from the mapped values.",
                }}
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
                title="get"
                disableLastBlock
                args="const value = byPath.get(object, path);"
                props={{
                    object: {
                        description: { tr: "Kaynak nesne.", en: "Source object." },
                        type: "object",
                        required: true,
                    },
                    path: {
                        description: { tr: "Noktayla ayrılmış yol.", en: "Dot-separated path." },
                        type: "string",
                        required: true,
                    },
                }}
                returnProps={{
                    value: {
                        description: { tr: "Yoldaki değer; bulunamazsa undefined.", en: "Value at path, or undefined when missing." },
                        type: "any",
                    },
                }}
            />
            <Ds.api
                title="set"
                disableLastBlock
                args="const next = byPath.set(object, path, value, enableDirectUpdate);"
                props={{
                    object: {
                        description: { tr: "Kaynak nesne veya draft.", en: "Source object or draft." },
                        type: "any",
                        required: true,
                    },
                    path: {
                        description: { tr: "Noktayla ayrılmış yol.", en: "Dot-separated path." },
                        type: "string",
                        required: true,
                    },
                    value: {
                        description: { tr: "Yazılacak değer.", en: "Value to write." },
                        type: "any",
                        required: true,
                    },
                    enableDirectUpdate: {
                        description: { tr: "true olduğunda nesneyi yerinde değiştirir.", en: "Mutates object in place when true." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                }}
                returnProps={{
                    next: {
                        description: { tr: "Yazma işleminden sonraki güncellenmiş nesne veya state.", en: "Updated object or state after the write." },
                        type: "any",
                    },
                }}
            />
            <Ds.api
                title="delete"
                disableLastBlock
                args="const next = byPath.delete(object, path, enableDirectUpdate);"
                props={{
                    object: {
                        description: { tr: "Kaynak nesne veya draft.", en: "Source object or draft." },
                        type: "any",
                        required: true,
                    },
                    path: {
                        description: { tr: "Noktayla ayrılmış yol.", en: "Dot-separated path." },
                        type: "string",
                        required: true,
                    },
                    enableDirectUpdate: {
                        description: { tr: "true olduğunda nesneyi yerinde değiştirir.", en: "Mutates object in place when true." },
                        type: "boolean",
                        defaultValue: "false",
                    },
                }}
                returnProps={{
                    next: {
                        description: { tr: "Silme işleminden sonraki güncellenmiş nesne veya state.", en: "Updated object or state after delete." },
                        type: "any",
                    },
                }}
            />
            <Ds.api
                title="mapping"
                args="const picked = byPath.mapping(object, mappingObject);"
                props={{
                    object: {
                        description: { tr: "Kaynak nesne.", en: "Source object." },
                        type: "object",
                        required: true,
                    },
                    mappingObject: {
                        description: { tr: "outputKey → sourcePath eşleme nesnesi.", en: "Map of outputKey → sourcePath." },
                        type: "object",
                        required: true,
                    },
                }}
                returnProps={{
                    picked: {
                        description: { tr: "Eşleme yollarıyla seçilip yeniden adlandırılan değerleri içeren nesne.", en: "Object with values picked and renamed by mapping paths." },
                        type: "object",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

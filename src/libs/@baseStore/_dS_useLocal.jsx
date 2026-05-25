import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { baseStore } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";

const PATH_LOCAL = "baseStore-local";

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();
    const { title, viewCount, setLocal, setLocalByPath, localStore } = baseStore.useLocal({
        title: "Local draft",
        viewCount: 0,
    });

    return (
        <Ds.page
            title="baseStore.local"
            releasedOn="1.0.0"
            description={
                <>
                    <Typo.code>useLocal</Typo.code> temelde tek component scope&apos;u için tasarlandı.
                    Hızlı local state yönetimi için idealdir.
                    <br />
                    <br />
                    Teknik olarak <Typo.code>localStore</Typo.code> dışarı aktarılıp shared da
                    kullanılabilir; ancak bu yaklaşımı önermiyoruz. Shared ihtiyaçlarda{" "}
                    <Button.string to="/design-system/baseStore.external" label="baseStore.external" />{" "}
                    yaklaşımı daha temiz ve sürdürülebilir.
                </>
            }
        >
            <Ds.block
                title="React Component içinde useLocal"
                code={`import { baseStore } from "${SYS.basePath}";

const Component = () => {
    const { title, viewCount, setLocal, setLocalByPath, localStore } = baseStore.useLocal({
        title: "Local draft",
        viewCount: 0,
    });

    return (
        <>
            <p>{title} ({viewCount})</p>
            <button onClick={() => setLocal((s) => { s.viewCount += 1; })}>+1</button>
            <button onClick={() => setLocalByPath("title", "Updated title")}>set title</button>
        </>
    );
};`}
                description={
                    <>
                        <Typo.code>setLocal</Typo.code>, store.set ile aynı updater modelini kullanır.
                        <br />
                        <Typo.code>setLocalByPath(path, value)</Typo.code> shorthand&apos;dir ve current
                        implementation&apos;da top-level key set eder.
                    </>
                }
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Typo.span>
                            title: <Typo.code>{title}</Typo.code> · viewCount:{" "}
                            <Typo.code>{viewCount}</Typo.code>
                        </Typo.span>
                        <Flex wrap gap={10}>
                            <Button.plain
                                label="+1 viewCount (setLocal)"
                                onClick={() =>
                                    setLocal((s) => {
                                        s.viewCount += 1;
                                    })
                                }
                            />
                            <Button.plain
                                label='setLocalByPath("title", "DS Local")'
                                onClick={() => setLocalByPath("title", "DS Local")}
                            />
                            <Button.plain
                                label='setLocal({ title: "Merged", viewCount: 0 })'
                                onClick={() => setLocal({ title: "Merged", viewCount: 0 })}
                            />
                        </Flex>
                    </Flex.column>
                }
            />
            <Ds.block
                title="İzole Fonksiyon + localStore (Mümkün ama tavsiye değil)"
                description="localStore, Context ile alt componentlere/fonksiyonlara geçirilebilir. Yine de shared kullanım için create/use modeli daha doğru."
                code={`import { createContext, useContext } from "react";
import { baseStore } from "${SYS.basePath}";

const LocalStoreContext = createContext(null);

const ProviderComponent = ({ children }) => {
    const local = baseStore.useLocal({ count: 0 });
    return (
        <LocalStoreContext.Provider value={local.localStore}>
            {children}
        </LocalStoreContext.Provider>
    );
};

const useIncreaseFromService = () => {
    const store = useContext(LocalStoreContext);
    return () => {
        store.set((s) => {
            s.count += 1;
        });
        return store.get();
    };
};`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex wrap gap={10}>
                            <Button.plain
                                label="localStore.get()"
                                {...outputButtonProps({
                                    path: PATH_LOCAL,
                                    activeLabel: "get",
                                    fn: () => localStore.get(),
                                })}
                            />
                            <Button.plain
                                label="isolatedIncrease(2)"
                                {...outputButtonProps({
                                    path: PATH_LOCAL,
                                    activeLabel: "inc",
                                    fn: () => {
                                        const isolatedIncrease = (store, step = 1) => {
                                            store.set((s) => {
                                                s.viewCount += step;
                                            });
                                            return store.get();
                                        };
                                        return isolatedIncrease(localStore, 2);
                                    },
                                })}
                            />
                        </Flex>
                        <Output path={PATH_LOCAL} />
                    </Flex.column>
                }
            />
            <Ds.api
                args="const { ...state, setLocal, setLocalByPath, localStore } = baseStore.useLocal(initialState);"
                props={{
                    initialState: {
                        description: "Local store için başlangıç state'i.",
                        type: "object",
                        defaultValue: "{}",
                    },
                }}
                returnProps={{
                    state: {
                        description: "Store state alanları.",
                        type: "object",
                    },
                    setLocal: {
                        description: "localStore.set kısayolu.",
                        type: "function",
                    },
                    setLocalByPath: {
                        description: "Shorthand setter. Top-level key ataması yapar.",
                        type: "function",
                    },
                    localStore: {
                        description: "create ile üretilen store instance'ı.",
                        type: "object",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

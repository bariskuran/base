import { useMemo } from "react";
import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { baseStore } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";

const PATH_EXTERNAL = "baseStore-external";

const X = () => {
    const { outputButtonProps, Output } = Ds.useOutputViewer();
    const sharedStore = useMemo(
        () =>
            baseStore.create({
                counter: 0,
                profile: {
                    name: "Base User",
                },
            }),
        [],
    );

    const { counter, profile, set } = baseStore.use(sharedStore);
    const [onlyCounter, setCounter] = baseStore.use(sharedStore, (s) => s.counter);

    return (
        <Ds.page
            title="baseStore.external"
            releasedOn="1.0.0"
            description={
                <>
                    External/shared store modelidir. Bir store instance&apos;ını{" "}
                    <Typo.code>create</Typo.code> ile bir kez üretir, React tarafında{" "}
                    <Typo.code>use(store, selector?)</Typo.code> ile subscribe olursun.
                    <br />
                    <br />
                    Aynı store, React dışındaki izole fonksiyonlarda da{" "}
                    <Typo.code>store.get()</Typo.code> ve <Typo.code>store.set()</Typo.code> ile
                    kullanılabilir.
                </>
            }
        >
            <Ds.block
                title="Create + Use (React Component)"
                code={`import { baseStore } from "${SYS.basePath}";

const userStore = baseStore.create({
    counter: 0,
    profile: { name: "Base User" },
});

const UserCounter = () => {
    const { counter, profile, set } = baseStore.use(userStore);
    const [onlyCounter, setCounter] = baseStore.use(userStore, (s) => s.counter);

    return (
        <>
            <p>{profile.name}: {counter}</p>
            <button onClick={() => set((s) => { s.counter += 1; })}>+1</button>
            <button onClick={() => setCounter((s) => { s.counter += 5; })}>+5</button>
            <p>Selector onlyCounter: {onlyCounter}</p>
        </>
    );
};`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Typo.span>
                            {profile?.name}: <Typo.code>{counter}</Typo.code> (selector:{" "}
                            <Typo.code>{onlyCounter}</Typo.code>)
                        </Typo.span>
                        <Flex wrap gap={10}>
                            <Button.plain
                                label="+1 (set)"
                                onClick={() =>
                                    set((s) => {
                                        s.counter += 1;
                                    })
                                }
                            />
                            <Button.plain
                                label="+5 (set from selector)"
                                onClick={() =>
                                    setCounter((s) => {
                                        s.counter += 5;
                                    })
                                }
                            />
                            <Button.plain
                                label='set profile.name = "Baris"'
                                onClick={() =>
                                    set((s) => {
                                        s.profile.name = "Baris";
                                    })
                                }
                            />
                        </Flex>
                    </Flex.column>
                }
            />
            <Ds.block
                title="Isolated Function (Non-React)"
                description="Aynı store instance'ı izole utility/fonksiyonlarda da kullanılabilir."
                code={`import { baseStore } from "${SYS.basePath}";

const userStore = baseStore.create({ counter: 0 });

const increaseFromService = (step = 1) => {
    userStore.set((s) => {
        s.counter += step;
    });
    return userStore.get();
};

increaseFromService(3); // { counter: 3 }`}
                example={
                    <Flex.column gap={10} padding={10} full>
                        <Flex wrap gap={10}>
                            <Button.plain
                                label="sharedStore.get()"
                                {...outputButtonProps({
                                    path: PATH_EXTERNAL,
                                    activeLabel: "get",
                                    fn: () => sharedStore.get(),
                                })}
                            />
                            <Button.plain
                                label="increaseFromService(3)"
                                {...outputButtonProps({
                                    path: PATH_EXTERNAL,
                                    activeLabel: "service",
                                    fn: () => {
                                        sharedStore.set((s) => {
                                            s.counter += 3;
                                        });
                                        return sharedStore.get();
                                    },
                                })}
                            />
                            <Button.plain
                                label='sharedStore.set({ counter: 0 })'
                                {...outputButtonProps({
                                    path: PATH_EXTERNAL,
                                    activeLabel: "reset",
                                    fn: () => sharedStore.set({ counter: 0 }),
                                })}
                            />
                        </Flex>
                        <Output path={PATH_EXTERNAL} />
                    </Flex.column>
                }
            />
            <Ds.api
                title="create"
                disableLastBlock
                args="const store = baseStore.create(initialState);"
                props={{
                    initialState: {
                        description: "Store'un ilk state'i.",
                        type: "object",
                        defaultValue: "{}",
                    },
                }}
                returnProps={{
                    id: {
                        description: "Store instance id.",
                        type: "string",
                    },
                    get: {
                        description: "Anlık state'i döner.",
                        type: "function",
                    },
                    set: {
                        description:
                            "State günceller. object merge, primitive replace veya draft updater kabul eder.",
                        type: "function",
                    },
                    subscribe: {
                        description:
                            "React dışı dinleme için listener ekler. unsubscribe fonksiyonu döner.",
                        type: "function",
                    },
                    getVersion: {
                        description: "İç sürüm numarası (performans/cache için).",
                        type: "function",
                    },
                }}
            />
            <Ds.api
                title="use"
                args="const selected = baseStore.use(store, selector?, equalityFn?);"
                props={{
                    store: {
                        description: "`baseStore.create` ile üretilmiş store.",
                        type: "object",
                        required: true,
                    },
                    selector: {
                        description:
                            "Opsiyonel. Verilen alt state'e subscribe olur. Verilmezse tüm state döner.",
                        type: "function",
                    },
                    equalityFn: {
                        description: "Opsiyonel karşılaştırma fonksiyonu.",
                        type: "function",
                    },
                }}
                returnProps={{
                    selected: {
                        description:
                            "Selector yoksa state + set döner. Selector primitive dönerse [value, set], object dönerse object + set döner.",
                        type: "any",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

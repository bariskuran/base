import { useMemo } from "react";
import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { baseStore } from ".";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";

const PATH_EXTERNAL = "baseStore-external";

const testStore = baseStore.create({ test: 1 });

const TestCompoent = () => {
    const [test, set] = baseStore.use(testStore, (s) => [s.test, s.set]);

    const up = () => {
        testStore.set((s) => {
            s.test += 1;
        });
        // set((s) => {
        //     s.test += 1;
        // });
    };

    return (
        <Flex.column gap={10}>
            <Typo.span>Test: {test}</Typo.span>
            <Button label="Up" onClick={up} skipClickCooldown skipOnClickHold />
        </Flex.column>
    );
};

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
            title="baseStore.use"
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
            <Ds.block title="Create + Use (React Component)" example={<TestCompoent />} />
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

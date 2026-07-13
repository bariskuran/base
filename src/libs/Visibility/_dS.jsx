import { useState } from "react";
import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Visibility } from ".";

const Counter = () => {
    const [count, setCount] = useState(0);

    return (
        <Flex gap={10} yAlign="center">
            <Typo.p>Count: {count}</Typo.p>
            <Button.amedist label="+1" onClick={() => setCount((value) => value + 1)} flat />
        </Flex>
    );
};

const VisibilityExample = ({ component: Component = Visibility }) => {
    const [visible, setVisible] = useState(true);

    return (
        <Flex direction="column" gap={14}>
            <Button.amedist
                label={visible ? "Hide" : "Show"}
                onClick={() => setVisible((value) => !value)}
                flat
            />
            <Component visible={visible}>
                <Counter />
            </Component>
        </Flex>
    );
};

const X = () => (
    <Ds.page
        title="<Visibility>"
        releasedOn="1.0.0"
        description={{
            tr: "Visibility, bir React ağacını state'ini koruyarak gösterip gizler. Varsayılan Visibility ile Visibility.preserve aynı komponenttir. Ağacın görünürlük koşuluna göre mount edilmesi gereken yerlerde Visibility.mount kullanılır.",
            en: "Visibility shows and hides a React tree while preserving its state. The default Visibility and Visibility.preserve are the same component. Use Visibility.mount when the tree should mount according to the visibility condition.",
        }}
    >
        <Ds.block
            title={{ tr: "Temel Kullanım", en: "Basic usage" }}
            description={{
                tr: "visible zorunludur. Visibility'nin varsayılan davranışı preserve'dür; visible false olduğunda state korunur. Visibility.preserve aynı davranışın açık yazımıdır. Tek satırlık kullanımda content tercih edilir.",
                en: "visible is required. Visibility preserves state by default when visible is false. Visibility.preserve is the explicit form of the same behavior. Prefer content for single-line usage.",
            }}
            code={`import { Visibility } from "${SYS.basePath}";

<Visibility visible={isMenuOpen}>
    <Menu />
</Visibility>

<Visibility visible={isMenuOpen} content={<Menu />} />`}
            example={<VisibilityExample />}
        />
        <Ds.block
            title={{ tr: "Preserve", en: "Preserve" }}
            description={{
                tr: "React 19.2 ve üzerindeki native Activity ile DOM ve local state korunur; gizlenirken effect'ler cleanup edilir ve gizli güncellemeler düşük önceliğe alınır. Visibility.preserve, varsayılan Visibility ile aynıdır.",
                en: "On React 19.2 and later, native Activity retains DOM and local state, cleans up effects while hidden, and deprioritizes hidden updates. Visibility.preserve is equivalent to the default Visibility.",
            }}
            code={`<Visibility.preserve visible={visible}>
    <Counter />
</Visibility.preserve>`}
        />
        <Ds.block
            title={{ tr: "Mount", en: "Mount" }}
            description={{
                tr: "visible false olduğunda children render edilmez. Component unmount olur; effect cleanup'ları çalışır ve local state kaybolur. Örnekte sayacı artırıp gizleyin; tekrar gösterildiğinde sayaç sıfırlanır.",
                en: "When visible is false, children are not rendered. The component unmounts, effect cleanups run, and local state is discarded. Increment the counter, hide it, then show it again to see it reset.",
            }}
            code={`<Visibility.mount visible={visible}>
    <Counter />
</Visibility.mount>

<Visibility.mount visible={visible} content={<Counter />} />`}
            example={<VisibilityExample component={Visibility.mount} />}
        />
        <Ds.block
            title={{ tr: "React 17–19.1 Fallback", en: "React 17–19.1 fallback" }}
            description={{
                tr: "Native Activity bulunmuyorsa Visibility ve Visibility.preserve, display: none / display: contents kullanan bir wrapper'a geri döner. Bu fallback local state'i korur ancak React Activity'den farklı olarak effect'leri durdurmaz ve güncellemelerin önceliğini değiştirmez. Wrapper nedeniyle özel HTML nesting kuralları olan table benzeri yapılarda Visibility.mount tercih edilmelidir.",
                en: "When native Activity is unavailable, Visibility and Visibility.preserve fall back to a wrapper using display: none / display: contents. It retains local state but, unlike React Activity, does not stop effects or change update priority. Prefer Visibility.mount for structures with strict HTML nesting rules, such as tables, because the fallback adds a wrapper.",
            }}
        />
        <Ds.api
            args="<Visibility visible content />"
            props={{
                visible: {
                    description: {
                        tr: "Children'ın gösterilip gösterilmeyeceğini belirler.",
                        en: "Controls whether children are shown.",
                    },
                    type: "boolean",
                    required: true,
                },
                children: {
                    description: {
                        tr: "Görünürlüğü yönetilecek React içeriği.",
                        en: "React content whose visibility is managed.",
                    },
                    type: "ReactNode",
                },
                content: {
                    description: {
                        tr: "children aliası. İkisi birlikte verilirse content önceliklidir.",
                        en: "Alias for children. When both are supplied, content takes precedence.",
                    },
                    type: "ReactNode",
                    required: true,
                },
            }}
        />
    </Ds.page>
);

export default X;

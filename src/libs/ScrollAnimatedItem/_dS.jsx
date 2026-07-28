import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { Space } from "../Space";
import { Typo } from "../Typo";
import { ScrollAnimatedItem } from ".";

const DemoItem = ({ animationMs, children }) => (
    <ScrollAnimatedItem.amedist animationMs={animationMs}>
        <Flex padding={24} minHeight={160} xAlign="center" yAlign="center" bgColor="greys.shade20">
            <Typo.h4>{children}</Typo.h4>
        </Flex>
    </ScrollAnimatedItem.amedist>
);

const X = () => (
    <Ds.page
        title="<ScrollAnimatedItem>"
        releasedOn="1.0.0"
        description="IntersectionObserver tabanlı, tekrar eden giriş ve çıkış hareketlerini yöneten controller bileşeni."
    >
        <Ds.block
            title="Amedist"
            description="İçerik viewport kenarına göre translate edilir. Animasyon her yeniden girişte çalışır; reduced-motion tercihinde hareket kapatılır."
            code={`import { ScrollAnimatedItem } from "${SYS.basePath}";

<ScrollAnimatedItem.amedist
    animationMs={1000}
    distance={120}
    onEnter={(meta) => {}}
    onExit={(meta) => {}}
>
    <Content />
</ScrollAnimatedItem.amedist>`}
            example={
                <Flex.column gap={30} full>
                    <Space size={180} />
                    <DemoItem animationMs={1500}>1500ms text motion</DemoItem>
                    <Space size={220} />
                    <DemoItem animationMs={180}>180ms image motion</DemoItem>
                    <Space size={180} />
                </Flex.column>
            }
        />
        <Ds.api
            args="<ScrollAnimatedItem.amedist />"
            props={{
                animationMs: {
                    description: "Opacity + translate transition süresi.",
                    type: "number",
                    defaultValue: "800",
                },
                distance: {
                    description:
                        "Viewport yönündeki translate mesafesi. 0 ise yalnızca opacity animasyonu uygulanır.",
                    type: "number",
                    defaultValue: "240",
                },
                viewportMargin: {
                    description:
                        'IntersectionObserver rootMargin. Pozitif değer fade-in’i erkene, fade-out’u geçe alır (ör. "25% 0px 25% 0px").',
                    type: "string | number",
                    defaultValue: '"25% 0px 25% 0px"',
                },
                onEnter: {
                    description: "Giriş süreci başladığında meta verisiyle çağrılır.",
                    type: "fn",
                },
                onExit: {
                    description: "Çıkış süreci başladığında meta verisiyle çağrılır.",
                    type: "fn",
                },
                children: {
                    description: "Hareketi yönetilecek içerik.",
                    type: "ReactNode",
                    required: true,
                },
            }}
        />
    </Ds.page>
);

export default X;

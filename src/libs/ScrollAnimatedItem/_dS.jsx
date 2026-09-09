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
        description={{ tr: "IntersectionObserver tabanlı, tekrar eden giriş ve çıkış hareketlerini yöneten controller componenti.", en: "IntersectionObserver-based controller component that manages repeated enter and exit motion." }}
    >
        <Ds.block
            title="Amedist"
            description={{ tr: "İçerik viewport kenarına göre translate edilir. Animasyon her yeniden girişte çalışır; reduced-motion tercihinde hareket kapatılır.", en: "Content is translated relative to the viewport edge. The animation runs on every re-entry; motion is disabled for reduced-motion preferences." }}
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
                    description: { tr: "Opacity + translate transition süresi.", en: "Opacity + translate transition duration." },
                    type: "number",
                    defaultValue: "800",
                },
                distance: {
                    description: { tr: "Viewport yönündeki translate mesafesi. 0 ise yalnızca opacity animasyonu uygulanır.", en: "Translate distance in the viewport direction. When 0, only the opacity animation is applied." },
                    type: "number",
                    defaultValue: "240",
                },
                viewportMargin: {
                    description: { tr: 'IntersectionObserver rootMargin. Pozitif değer fade-in’i erkene, fade-out’u geçe alır (ör. "25% 0px 25% 0px").', en: 'IntersectionObserver rootMargin. A positive value moves fade-in earlier and fade-out later (e.g. "25% 0px 25% 0px").' },
                    type: "string | number",
                    defaultValue: '"25% 0px 25% 0px"',
                },
                onEnter: {
                    description: { tr: "Giriş süreci başladığında meta verisiyle çağrılır.", en: "Called with metadata when the enter sequence begins." },
                    type: "fn",
                },
                onExit: {
                    description: { tr: "Çıkış süreci başladığında meta verisiyle çağrılır.", en: "Called with metadata when the exit sequence begins." },
                    type: "fn",
                },
                children: {
                    description: { tr: "Hareketi yönetilecek içerik.", en: "Content whose motion is managed." },
                    type: "ReactNode",
                    required: true,
                },
            }}
        />
    </Ds.page>
);

export default X;

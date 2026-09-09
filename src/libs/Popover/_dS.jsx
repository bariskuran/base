import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { PopOver } from ".";
import { Flex } from "../Flex";
import { ButtonGroup } from "../ButtonGroup";
import { Button } from "../Button";
import { t } from "../getText";

const Panel = () => (
    <Flex.column gap={2}>
        <div>Action A</div>
        <div>Action B</div>
    </Flex.column>
);
const Panel2 = () => (
    <Flex.column gap={2} padding={2}>
        <div>Action A</div>
        <div>Action B</div>
        <div>Action C</div>
        <div>Action D</div>
        <div>Action E</div>
        <div>Action F</div>
        <div>Action G</div>
        <div>Action H</div>
        <div>Action I</div>
        <div>Action J</div>
        <div>Action H</div>
        <div>Action I</div>
        <div>Action J</div>
        <div>Action H</div>
        <div>Action I</div>
        <div>Action J</div>
    </Flex.column>
);

const LargeContent = () => {
    return (
        <Flex minWidth={1000} minHeight={700}>
            Large content 1000x700
        </Flex>
    );
};

const items = [
    {
        bgColor: "error",
        label: "test",
        hoverLabel: "test hover",
        prefix: {
            icon: "bullet",
        },
        onClick: () => console.log("click"),
    },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
    { label: "test2", onClick: () => console.log("click2") },
];

const groupProps = {
    bgColor: "success",
    prefix: { icon: "user" },
    size: 100,
};

const X = () => (
    <Ds.page
        title="<PopOver>"
        releasedOn="1.0.0"
        description={
            <>
                {t({ tr: "PopOver; FloatingUi, ScrollFlex, Button ve ButtonGroup gibi gelişmiş componentlerden oluşur. Bu nedenle kendi başına çok fazla özelliği yoktur; ancak söz konusu componentlerin sunduğu tüm özellikleri kullanabilir.", en: "PopOver is composed of advanced components such as FloatingUi, ScrollFlex, Button, and ButtonGroup. It therefore has few features of its own but can use all features provided by those components." })} <br />
                <br />{t({ tr: "PopOver'ın faydalı bir özelliği: sistem varsayılan olarak aynı anda yalnızca bir özel PopOver'a izin verir (FloatingUi ", en: "A useful PopOver feature: by default, the system allows only one exclusive PopOver at a time (see FloatingUi " })}<code>disableMultipleBlock</code>{t({ tr: "). Birden fazla panel açık kalacaksa PopOver üzerinde ", en: "). Use " })}<code>disableMultipleBlock</code>{t({ tr: " kullanın.", en: " on PopOver when multiple panels should stay open." })}
                <br />
                <br />
                <Button.string to="/design-system/floatingUi" label="FloatingUi" />
                <br />
                <Button.string to="/design-system/scrollFlex" label="ScrollFlex" />
                <br />
                <Button.string to="/design-system/button" label="Button" />
            </>
        }
    >
        <Ds.block
            title={{ tr: "Temel Kullanım", en: "Basic Usage" }}
            code={`import { PopOver } from "${SYS.basePath}";

                        <PopOver>content</PopOver>`}
            example={<PopOver>content</PopOver>}
        />
        <Ds.block
            title={{ tr: "Gelişmiş Kullanım", en: "Advanced Usage" }}
            code={`import { PopOver } from "${SYS.basePath}";

                    <PopOver buttonProps={{ icon: { flat: true } }}>
                        <Panel />
                    </PopOver>
                    <PopOver buttonProps={{ label: "Menu", outlined: true }}>
                        <Panel2 />
                    </PopOver>
                    <PopOver
                        buttonProps={{ label: "Menu", outlined: false }}
                        scrollFlexProps={{
                            enableDragging: true,
                            scrollBarProps: { variant: "primary", disableOpacityEffect: true },
                        }}
                    >
                        <LargeContent />
                    </PopOver>
`}
            example={
                <Flex gap={12}>
                    <PopOver buttonProps={{ icon: { flat: true } }}>
                        <Panel />
                    </PopOver>
                    <PopOver buttonProps={{ label: "Menu", outlined: true }}>
                        <Panel2 />
                    </PopOver>
                    <PopOver
                        buttonProps={{ label: "Menu", outlined: false }}
                        scrollFlexProps={{
                            enableDragging: true,
                            scrollBarProps: { variant: "primary", disableOpacityEffect: true },
                        }}
                    >
                        <LargeContent />
                    </PopOver>
                </Flex>
            }
        />
        <Ds.block
            title={{ tr: "PopOver ile ButtonGroup", en: "ButtonGroup with PopOver" }}
            description={{ tr: "ButtonGroup içindeki flat prop'u dış sarmalayıcıları kaldırır ve yerleşim kontrolünü PopOver'a verir. PopOver içindeki arayüzü scrollFlexProps ile yönetebilirsiniz.", en: "The ButtonGroup flat prop removes outer wrappers, giving layout control to PopOver. You can manage the UI inside PopOver with scrollFlexProps." }}
            code={`import { PopOver, ButtonGroup } from "${SYS.basePath}";

                   <PopOver
                    buttonProps={{ label: "flat ButtonGroup usage" }}
                    scrollFlexProps={{
                        flexProps: { gap: 5 },
                        scrollBarProps: {
                            disableOpacityEffect: true,
                            variant: "primary",
                        },
                    }}
                   >
                    <ButtonGroup items={items} groupProps={groupProps} flat />
                   </PopOver>`}
            example={
                <PopOver
                    buttonProps={{ label: "flat ButtonGroup usage" }}
                    scrollFlexProps={{
                        flexProps: { gap: 5 },
                        scrollBarProps: {
                            disableOpacityEffect: true,
                            variant: "primary",
                        },
                    }}
                >
                    <ButtonGroup items={items} groupProps={groupProps} flat />
                </PopOver>
            }
        />
        <Ds.block
            title={{ tr: "Stil", en: "Styling" }}
            description={{ tr: "bgColor ve color propları PopOver'ın arka plan ve metin rengini belirler. Theme rengi, theme path'i veya CSS rengi olabilir.", en: "bgColor and color set PopOver's background and text colour. They can be theme colours, theme paths, or CSS colours." }}
            code={`import { PopOver, ButtonGroup } from "${SYS.basePath}";

                   <PopOver bgColor="lightgrey" color="primary">
                    <Panel />
                   </PopOver>`}
            example={
                <PopOver bgColor="lightgrey" color="primary">
                    <Panel />
                </PopOver>
            }
        />
        <Ds.block
            title="disableArrow"
            code={`import { PopOver, ButtonGroup } from "${SYS.basePath}";

                   <PopOver disableArrow buttonProps={{ label: "Without Arrow", outlined: true }}>
                    <Panel />
                   </PopOver>`}
            example={
                <PopOver disableArrow buttonProps={{ label: "Without Arrow", outlined: true }}>
                    <Panel />
                </PopOver>
            }
        />
        <Ds.api
            args="<PopOver>{React.Node}</PopOver>"
            props={{
                children: {
                    description: { tr: "Dahili ScrollFlex içinde render edilen panel içeriği.", en: "Panel content rendered inside the internal ScrollFlex." },
                    type: "React Node",
                    required: true,
                },
                buttonProps: {
                    description: { tr: "Button API'sine bakın.", en: "See the Button API." },
                    type: "object",
                },
                scrollFlexProps: {
                    description: { tr: "ScrollFlex API'sine bakın.", en: "See the ScrollFlex API." },
                    type: "object",
                },
                _rest: {
                    description: { tr: "Kalan tüm proplar FloatingUi componentine aktarılır. FloatingUi API'sine bakın.", en: "All remaining props are passed to FloatingUi. See the FloatingUi API." },
                    type: "object",
                },
            }}
        />
    </Ds.page>
);

export default X;

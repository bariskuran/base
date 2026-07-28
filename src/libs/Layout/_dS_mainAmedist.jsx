import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";

const X = () => (
    <Ds.page
        title="<Layout.mainAmedist>"
        releasedOn="1.0.0"
        description={{
            tr: "Amedist sayfa kabuğu; header, footer ve menuContent slotlarını yerleştirir, menü lifecycle'ına göre ana içeriğin görünürlüğünü yönetir. Menü içeriğinin veri modelini veya iç tasarımını üretmez.",
            en: "The Amedist page shell places header, footer, and menuContent slots and controls main-content visibility through the menu lifecycle. It does not own the menu content's data model or internal design.",
        }}
    >
        <Ds.block
            title={{ tr: "Temel kullanım", en: "Basic usage" }}
            code={`import { Layout, Outlet } from "${SYS.basePath}";

<Layout.mainAmedist
    controllerId="main"
    header={<Layout.headerAmedist controllerId="main" logo={logo} />}
    footer={
        <Layout.footerAmedist
            controllerId="main"
            logo={<Logo />}
            links={<Links />}
            credit={<Credit />}
        />
    }
    menuContent={<MenuContent selectedLink={selectedLink} />}
>
    <Outlet />
</Layout.mainAmedist>`}
        />
        <Ds.block
            title={{ tr: "Controller kimliği", en: "Controller identity" }}
            description={{
                tr: "controllerId verilmezse default kullanılır. Aynı varyant ve controllerId ile birden fazla UI mount edilirse ilgili UI'ların tamamı görünür bir warning çıktısı verir. Toplu tetikleme için duplicate ID kullanılmamalıdır.",
                en: "controllerId defaults to default. Mounting multiple UIs with the same variant and controllerId makes every affected UI render a visible warning. Duplicate IDs must not be used as a broadcast mechanism.",
            }}
        />
        <Ds.api
            args="<Layout.mainAmedist children />"
            props={{
                children: {
                    description: {
                        tr: "Menü kapalı veya kapanıyorken gösterilen ana içerik.",
                        en: "Main content displayed while the menu is closed or closing.",
                    },
                    type: "ReactNode",
                    required: true,
                },
                header: {
                    description: { tr: "Header slotu.", en: "Header slot." },
                    type: "ReactNode",
                },
                footer: {
                    description: { tr: "Footer slotu.", en: "Footer slot." },
                    type: "ReactNode",
                },
                menuContent: {
                    description: {
                        tr: "Opening, open ve closing durumlarında menu alanında gösterilen proje içeriği.",
                        en: "Project-owned content shown in the menu area during opening, open, and closing states.",
                    },
                    type: "ReactNode",
                },
                controllerId: {
                    description: {
                        tr: "Bu main controller instance'ının benzersiz kimliği.",
                        en: "Unique identity of this main controller instance.",
                    },
                    type: "string",
                    defaultValue: "default",
                },
                visible: {
                    description: {
                        tr: "Layout ortak Visibility preserve kontrolü.",
                        en: "Shared Layout Visibility preserve control.",
                    },
                    type: "boolean",
                    defaultValue: "true",
                },
            }}
        />
    </Ds.page>
);

export default X;

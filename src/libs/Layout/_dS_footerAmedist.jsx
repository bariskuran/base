import Ds from "../DesignSystem";

const X = () => (
    <Ds.page
        title="<Layout.footerAmedist>"
        releasedOn="1.0.0"
        description={{
            tr: "Logo, links ve credit slotlarından oluşan Amedist footer varyantıdır.",
            en: "Amedist footer variant composed of logo, links, and credit slots.",
        }}
    >
        <Ds.block
            title={{ tr: "Temel kullanım", en: "Basic usage" }}
            code={`<Layout.footerAmedist
    minHeight="100vh"
    logo={<Logo />}
    links={<Links />}
    credit={<Credit />}
/>`}
        />
        <Ds.api
            args="<Layout.footerAmedist />"
            props={{
                minHeight: {
                    description: {
                        tr: "Number gelirse rem olarak normalize edilen minimum yükseklik.",
                        en: "Minimum height; numeric values are normalized as rem.",
                    },
                    type: "number | string",
                    defaultValue: "100vh",
                },
                logo: { description: { tr: "Logo slotu.", en: "Logo slot." }, type: "ReactNode" },
                links: {
                    description: { tr: "Links slotu.", en: "Links slot." },
                    type: "ReactNode",
                },
                credit: {
                    description: { tr: "Credit slotu.", en: "Credit slot." },
                    type: "ReactNode",
                },
                controllerId: {
                    description: {
                        tr: "Bu footer controller instance'ının benzersiz kimliği.",
                        en: "Unique identity of this footer controller instance.",
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

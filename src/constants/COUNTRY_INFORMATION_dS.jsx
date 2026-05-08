import Ds from "../libs/DesignSystem";
import { SYS } from "./SYS";

const X = () => {
    return (
        <Ds.page
            title="COUNTRY_INFORMATION"
            releasedOn="1.0.0"
            description="A country databank for generic information. This is a static object and not a function."
        >
            <Ds.block
                title="Sample"
                lastBlock
                code={`import { COUNTRY_INFORMATION } from "${SYS.basePath}";

                        // sample COUNTRY_INFORMATION.gb

                        gb: {
                            iso2: "GB",
                            iso3: "GBR",
                            numericCode: 826,
                            phoneCode: "44",
                            currency: "GBP",
                            currencySymbol: "£",
                            nativeName: "United Kingdom",
                            name: {
                                tr: "Birleşik Krallık",
                                en: "United Kingdom",
                                fr: "Royaume-Uni",
                                de: "Vereinigtes Königreich",
                                es: "Reino Unido",
                            },
                            officialName: {
                                tr: "Büyük Britanya ve Kuzey İrlanda Birleşik Krallığı",
                                en: "United Kingdom of Great Britain and Northern Ireland",
                                fr: "Royaume-Uni de Grande-Bretagne et d'Irlande du Nord",
                                de: "Vereinigtes Königreich Großbritannien und Nordirland",
                                es: "Reino Unido de Gran Bretaña e Irlanda del Norte"
                            },
                            capital: {
                                tr: "Londra",
                                en: "London",
                                fr: "Londres",
                                de: "London",
                                es: "Londres",
                            },
                            languages: [LANGUAGES.en],
                            fallbackLanguages: [LANGUAGES.fr],
                            continents: [CONTINENTS.europe],
                        },
                    `}
            />
        </Ds.page>
    );
};

export default X;

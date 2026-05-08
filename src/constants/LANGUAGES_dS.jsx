import Ds from "../libs/DesignSystem";
import { SYS } from "./SYS";

const X = () => {
    return (
        <Ds.page
            title="LANGUAGES"
            releasedOn="1.0.0"
            description="Language constants based on ISO 639-1 (name, nativeName, iso2/iso3, direction). Static object."
        >
            <Ds.block
                title="Sample"
                lastBlock
                code={`import { LANGUAGES } from "${SYS.basePath}";

                        // sample LANGUAGES.en

                        en: {
                            name: {
                                tr: "İngilizce",
                                en: "English",
                                fr: "Anglais",
                                de: "Englisch",
                                es: "Inglés",
                            },
                            nativeName: "English",
                            iso2: "EN",
                            iso3: "ENG",
                            direction: "ltr",
                        },
                    `}
            />
        </Ds.page>
    );
};

export default X;

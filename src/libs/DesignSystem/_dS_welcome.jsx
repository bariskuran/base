import Ds from "./index";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { t } from "../getText";

const X = () => (
    <Ds.page
        title={t({ tr: "Design System", en: "Design System" })}
        releasedOn="1.0.0"
        description={t({
            tr: (
                <>
                    <b>@bariskuran/base</b> bileşen ve yardımcı kütüphanelerinin canlı dokümantasyonu.
                    Kurulum için{" "}
                    <Button.string to="/design-system/how-to-setup" label="How To Setup" /> sayfasına,
                    <b>Base</b> ve <b>PROJECT_SETTINGS</b> detayları için{" "}
                    <Button.string to="/design-system/base" label="Base" /> sayfasına gidin.
                </>
            ),
            en: (
                <>
                    Live documentation for <b>@bariskuran/base</b> components and helpers. See{" "}
                    <Button.string to="/design-system/how-to-setup" label="How To Setup" /> for
                    installation and the <Button.string to="/design-system/base" label="Base" /> page
                    for <b>PROJECT_SETTINGS</b>.
                </>
            ),
        })}
    >
        <Ds.block
            title={t({ tr: "Navigasyon", en: "Navigation" })}
            description={t({
                tr: "Sol menüde Welcome ve How To Setup üstte; diğer sayfalar A–Z sıralıdır.",
                en: "The left nav keeps Welcome and How To Setup at the top; other pages are A–Z.",
            })}
            lastBlock
        />
    </Ds.page>
);

export default X;

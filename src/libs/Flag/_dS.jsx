import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flag } from ".";
import { Flex } from "../Flex";
import { Button } from "../Button";
import { t } from "../getText";

const X = () => (
    <Ds.page
        title="<Flag>"
        releasedOn="1.0.0"
        description={
            <>
                {t({ tr: "Flag componenti ülke/bölge bayraklarını dahili bayrak kütüphanesi ve Icon renderer üzerinden gösterir. Bir bayrak kodu bulunamazsa ", en: "The Flag component renders country and region flags through the internal flag library and Icon renderer. When a flag code is missing, it falls back to " })}<code>global</code>{t({ tr: " değerine döner.", en: "." })}
                <br />
                {t({ tr: "Şuraya bakın: ", en: "See " })}<Button.string to="/design-system/flagLibrary" label="Flag Library" />.
                <br />
                <br />
                {t({ tr: "Flag componenti Icon componenti üzerine kuruludur. Prop ayrıntıları için ", en: "Flag is built on top of the Icon component. See " })}
                <Button.string to="/design-system/icon" label="Icon" />{t({ tr: " sayfasına bakın. Ancak color, hoverColor, activeColor gibi stil propları Flag ile çalışmaz; icon yerine flag propunu kullanın.", en: " for its props. Note that style props such as color, hoverColor, and activeColor do not work with Flag; use the flag prop instead of icon." })}
            </>
        }
    >
        <Ds.block
            title={{ tr: "Temel kullanım", en: "Basic usage" }}
            code={`import { Flag } from "${SYS.basePath}";

                   <Flag flag="tr" />
                   <Flag flag="us" />
                   <Flag flag="de" />`}
            example={
                <Flex gap={12}>
                    <Flag flag="tr" />
                    <Flag flag="us" />
                    <Flag flag="de" />
                </Flex>
            }
        />
        <Ds.block
            title={{ tr: "Boyut", en: "Size" }}
            code={`import { Flag } from "${SYS.basePath}";

                   <Flag flag="tr" width={18} />
                   <Flag flag="gb" width={24} />
                   <Flag flag="gr" width={30} />`}
            example={
                <Flex gap={12}>
                    <Flag flag="gr" width={18} />
                    <Flag flag="gr" width={40} />
                    <Flag flag="gr" width={60} />
                </Flex>
            }
        />
        <Ds.block
            title={{ tr: "Geri dönüş davranışı", en: "Fallback behavior" }}
            lastBlock
            description={{ tr: "Bilinmeyen bir bayrak anahtarı verildiğinde Flag, global değerine döner.", en: "When an unknown flag key is provided, Flag falls back to global." }}
            code={`import { Flag } from "${SYS.basePath}";

                      <Flag flag="unknown-code" width={18} />
                      <Flag flag="global" width={18} />
`}
            example={
                <Flex gap={12}>
                    <Flag flag="unknown-code" width={18} />
                    <Flag flag="global" width={18} />
                </Flex>
            }
        />
    </Ds.page>
);

export default X;

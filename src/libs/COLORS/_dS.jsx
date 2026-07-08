import Ds from "../DesignSystem";
import { baseStore } from "../baseStore";
import { copyToClipboard } from "../copyToClipboard";
import { t } from "../getText";
import { S } from "./_styled";

const isColorString = (value) => typeof value === "string" && value.trim().length > 0;

const titleFromKey = (key) => key.charAt(0).toUpperCase() + key.slice(1);

const isScaleObject = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    return Object.values(value).some(isColorString);
};

const getPaletteGroups = (theme = {}) =>
    Object.entries(theme)
        .filter(([, value]) => isColorString(value) || isScaleObject(value))
        .map(([key, value]) => {
            if (isColorString(value)) {
                return {
                    key,
                    title: titleFromKey(key),
                    colors: [{ name: key, value }],
                };
            }

            return {
                key,
                title: titleFromKey(key),
                colors: Object.entries(value)
                    .filter(([, color]) => isColorString(color))
                    .map(([name, color]) => ({
                        name: `${key}.${name}`,
                        value: color,
                    })),
            };
        });

const ColorSwatch = ({ name, value }) => (
    <S.swatchButton
        type="button"
        $color={value}
        title={`${name}: ${value}`}
        aria-label={`${name}: ${value}`}
        onClick={() => copyToClipboard(value)}
    />
);

const ColorPalette = () => {
    const theme = baseStore.useGlobal((s) => s.theme);
    const groups = getPaletteGroups(theme);

    return (
        <S.palette>
            {groups.map(({ key, title, colors }) => (
                <S.group key={key}>
                    <S.groupTitle>
                        <b>{title}</b>
                    </S.groupTitle>
                    <S.swatches>
                        {colors.map(({ name, value }) => (
                            <ColorSwatch key={name} name={name} value={value} />
                        ))}
                    </S.swatches>
                </S.group>
            ))}
        </S.palette>
    );
};

const X = () => (
    <Ds.page
        title="COLORS"
        releasedOn="1.0.0"
        description={t({
            tr: "Base theme altında üretilen aktif renkleri ve scale gruplarını gösterir. Renk karesine tıklayınca renk kodu kopyalanır.",
            en: "Shows active colors and scale groups generated under the Base theme. Click a color square to copy its color value.",
        })}
    >
        <Ds.block
            title={t({ tr: "Renk Paleti", en: "Color Palette" })}
            description={t({
                tr: "Bu palet canlı theme verisinden okunur; primary, grey, primarys, greys gibi hali hazırda theme altında bulunan tüm renk gruplarını gösterir.",
                en: "This palette is read from the live theme data; it shows color groups already available under theme, such as primary, grey, primarys, and greys.",
            })}
            example={<ColorPalette />}
            lastBlock
        />
    </Ds.page>
);

export default X;

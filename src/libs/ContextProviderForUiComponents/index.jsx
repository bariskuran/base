/**
 * Ui componentleri için context provider.
 * buradaki amacım, ui componentleri iç içe geçtiğinde birbirlerinin variantları birbirlerini ezmesin. variant sadece en dıştaki ui componentinde çalışsın. diğer türlü çok çakışma oluyor.
 *
 * Örnek
 *
 * <Popover>
 *    <ButtonList>
 *        <ScrollFlex>
 *
 * Bunlar bu şekilde içiçe geçebiliyor gerçekten. Hepsinin kendi defaultVariantları var. Ve bunlar biribirini aslında ezmiyor ama görsel bir kakafoni oluşturuyor.
 *
 * Ayrıca, ilerleyen zamanlarda farklı bir value basmak istersem de bu componenti kullanacağım.
 *
 * şu anda __hasParentUiComponent propunu componentCreator içinde kullanıyorum.
 *
 */
import { createContext, useContext } from "react";

const UiComponentsContext = createContext(null);
const getUiContextValue = (extra = {}) => ({
    ...extra,
    __hasParentUiComponent: true,
});

export const useUiComponentsContext = () => useContext(UiComponentsContext) || {};

const ContextProviderForUiComponents = ({ children, value }) => {
    const base = getUiContextValue(value);
    return <UiComponentsContext.Provider value={base}>{children}</UiComponentsContext.Provider>;
};
export default ContextProviderForUiComponents;

//

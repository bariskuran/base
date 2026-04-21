import Ds from "../DesignSystem";
import { icons } from "./icons";
import { Icon } from "./";
import styled from "styled-components";
import { copyToClipboard } from "../copyToClipboard";
import { baseStore } from "../@baseStore";
import { sortBy } from "../sortBy";

const X = () => (
    <Ds.page
        title="Icon Library"
        releasedOn="1.0.0"
        description={`Icon komponenti ile kullanılan tüm iconları görüntüleyebilirsiniz. İsim ve keyword bazlı arama yapabilirsiniz. Kullanımı için Icon komponentinin dökümantasyonunu inceleyin.
            
            Base'in kendi icon seti hali hazırda mevcuttur. Ayrıca kendi iconlarınızı da proje dosyanız üzerinden ekleyebilirsiniz.`}
    >
        <Ds.block
            title="Adding new icons"
            description={`Proje tarafında, PROJECT_SETTINGS.iconsLibrary altında kendi icon setinizi
            [viewPortX, path, searchKeywords] 
            formatı ile ekleyebilirsiniz.
            
            viewportY yani icon yüksekliği her zaman 20px olmalıdır.`}
            code={`iconsLibrary: {
                        testIcon: [
                            "5.6, 20",
                            "M2.8,20c-1.5,0-2.7-1.2-2.7-2.7s1.2-2.7,2.7-2.7,2.7,1.2,2.7,2.7-1.2,2.7-2.7,2.7ZM4.3,9.5l-.7,2.8h-1.6l-.7-2.8C.3,5.8,0,3.8,0,2.8,0,.9,1.1,0,2.8,0s2.8.9,2.8,2.8-.3,3.1-1.3,6.7Z",
                            ["warning", "exclamation", "mark"],
                        ],
                    }
                `}
        />
        <Library />
    </Ds.page>
);

export default X;

const S = {
    Container: styled.div`
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
    `,
    Box: styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        border: 1px solid black;
        padding: 10px;
        flex: 0 0 150px;
        height: 150px;
        cursor: pointer;
        user-select: none;
        transition: all 0.25s ease-in-out;

        &:hover {
            background: rgba(0, 0, 0, 0.1);
        }

        &:active {
            transition: all 0.1s ease-in-out;
            background: rgba(0, 0, 0, 0.5);
        }
    `,
    Label: styled.span`
        font-size: 12px;
        font-weight: 600;
        color: black;
    `,
    Input: styled.input`
        flex: 0 0 100%;
        width: 100%;
        margin-bottom: 16px;
        padding: 6px 10px;
        font-size: 14px;
        width: 100%;
    `,
};

export const Library = () => {
    const [iconsLibrary] = baseStore.useGlobal((s) => [s._iconsLibrary]);
    const { searchText, setLocal } = baseStore.useLocal({ searchText: "" });

    /* Return */
    return (
        <S.Container>
            <S.Input
                type="text"
                placeholder="Search icons..."
                value={searchText}
                onChange={(e) => setLocal({ searchText: e.target.value })}
            />
            {Object.entries({ ...icons, ...iconsLibrary })
                .filter(([iconName, iconArr]) => {
                    if (!searchText) return true;
                    const lowerSearch = searchText.toLowerCase();
                    const keywords =
                        Array.isArray(iconArr) && iconArr.length > 2 && Array.isArray(iconArr[2])
                            ? iconArr[2].map((kw) => String(kw).toLowerCase())
                            : [];
                    return (
                        iconName.toLowerCase().includes(lowerSearch) ||
                        keywords.some((kw) => kw.includes(lowerSearch))
                    );
                })
                .sort(([aName], [bName]) => sortBy.asc(aName, bName))
                .map(([iconName]) => (
                    <S.Box
                        key={iconName}
                        onClick={() => {
                            copyToClipboard(`<Icon icon="${iconName}" width={20} />`);
                        }}
                    >
                        <Icon icon={iconName} width={24} color="black" />
                        <S.Label>{iconName}</S.Label>
                    </S.Box>
                ))}
        </S.Container>
    );
};

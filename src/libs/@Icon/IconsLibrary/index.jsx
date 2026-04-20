import { icons } from "../../@Icon/icons";
import { Icon } from "../../@Icon";
import styled from "styled-components";
import { copyToClipboard } from "../../copyToClipboard";
import { baseStore } from "../../@baseStore";
import { sortBy } from "../../sortBy";

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

export const IconsLibrary = () => {
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

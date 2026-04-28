import Ds from "../DesignSystem";
import { flags } from "./flags";
import { Flag } from ".";
import styled from "styled-components";
import { copyToClipboard } from "../copyToClipboard";
import { sortBy } from "../sortBy";
import { Button } from "../Button";
import { baseStore } from "../@baseStore";

const X = () => (
    <Ds.page
        title="Flag Library"
        releasedOn="1.0.0"
        description={
            <>
                You can browse all available flags here and copy a ready-to-use usage snippet.
                <br />
                <br />
                Check out <Button.string to="/design-system/flag" label="<Flag>" />.
            </>
        }
    >
        <Ds.block
            title="Usage"
            code={`<Flag flag="tr" width={20} />`}
            description="Click a card below to copy Flag usage."
        />
        <Ds.block title="Library" example={<Library />} />
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
            background: rgba(0, 0, 0, 0.08);
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
    `,
};

const Library = () => {
    const { searchText, setLocal } = baseStore.useLocal({ searchText: "" });

    return (
        <S.Container>
            <S.Input
                type="text"
                placeholder="Search flags..."
                value={searchText}
                onChange={(e) => setLocal({ searchText: e.target.value })}
            />
            {Object.keys(flags)
                .filter((name) => {
                    if (!searchText) return true;
                    return name.toLowerCase().includes(searchText.toLowerCase());
                })
                .sort((a, b) => sortBy.asc(a, b))
                .map((name) => (
                    <S.Box
                        key={name}
                        onClick={() => copyToClipboard(`<Flag flag="${name}" width={20} />`)}
                    >
                        <Flag flag={name} width={24} />
                        <S.Label>{name}</S.Label>
                    </S.Box>
                ))}
        </S.Container>
    );
};

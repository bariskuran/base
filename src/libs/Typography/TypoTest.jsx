import { Typo } from "./";
import { copyToClipboard } from "../copyToClipboard";

const veryLong =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const long =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const short = "Hello World";
const jsx = (
    <>
        <span>
            Merhaba <i style={{ fontSize: 50 }}>dünya</i>
        </span>
        <span>{long}</span>
    </>
);
const contentArray = [long, short, veryLong, short, long, short];

export const TypoTest = () => {
    return (
        <div
            style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}
        >
            {/* <Typo maxWidth={400} content={long} />
            <Typo width={500} content={long} />
            <Typo size={30} content={short} />
            <Typo size={14} weight={700} content={short} />
            <Typo size={14} color="red" content={short} />
            <Typo size={14} color="primary" content={short} />
            <Typo size={14} color="red" highlight="red" content={short} />
            <Typo size={14} highlight="primary" content={short} />
            <Typo size={14} content={long} align="right" />
            <Typo size={14} content={short} selfAlign="right" /> */}
            {/* <Typo size={14} content={veryLong} width={500} ellipsis /> */}
            <Typo size={14} content={jsx} ellipsis />
            <Typo size={14} content={jsx} clamp={2} />
            <span>--------</span>
            <Typo size={14} content={long} ellipsis="base" />
            <Typo size={14} content={long} clamp={2} ellipsis="base" />
            <Typo ellipsis="base" clamp={1}>
                {jsx}
            </Typo>
            <span>--------</span>
            <Typo size={14} content={long} copyable />
            <Typo clamp={2} copyable>
                {long}
            </Typo>
        </div>
    );
};

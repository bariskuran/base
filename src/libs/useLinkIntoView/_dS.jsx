import Ds from "../DesignSystem";

const X = () => {
    /* RETURN */
    return (
        <Ds.page
            title="useLinkIntoView()"
            releasedOn="1.0.0"
            description={`
                not ready yet.
                `}
        >
            <Ds.api
                args="useLinkIntoView({ basePath, behavior, block, extraDeps, getPathFromLink, inline, links, pathname });"
                returns="Tuple [isActive, activeNavItemRef] for scroll-into-view nav highlighting."
                props={{
                    pathname: {
                        description: "Current location pathname (e.g. useLocation().pathname).",
                        type: "string",
                        required: true,
                    },
                    links: {
                        description: "Nav items list; drives matching and effect deps.",
                        type: "array",
                        defaultValue: "[]",
                    },
                    basePath: {
                        description: "URL base when path segment is empty.",
                        type: "string",
                        defaultValue: '"/design-system"',
                    },
                    getPathFromLink: {
                        description: "Maps item to path segment; default link[1].",
                        type: "function",
                        defaultValue: "link => link[1]",
                    },
                    block: {
                        description: "scrollIntoView block option.",
                        type: "string",
                        defaultValue: '"center"',
                    },
                    inline: {
                        description: "scrollIntoView inline option.",
                        type: "string",
                        defaultValue: '"nearest"',
                    },
                    behavior: {
                        description: "scrollIntoView behavior.",
                        type: "string",
                        defaultValue: '"smooth"',
                    },
                    extraDeps: {
                        description: "Extra useLayoutEffect dependency values.",
                        type: "array",
                        defaultValue: "[]",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

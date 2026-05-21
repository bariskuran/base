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
                args="const [isActive, activeNavItemRef] = useLinkIntoView({ basePath, behavior, block, extraDeps, getPathFromLink, inline, links, pathname });"
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
                returnProps={{
                    isActive: {
                        description: "Returns true when the nav item matches the current pathname.",
                        type: "function",
                    },
                    activeNavItemRef: {
                        description: "Ref for the active nav item element (scrollIntoView target).",
                        type: "ref",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

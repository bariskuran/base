import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";

const X = () => (
    <Ds.page
        title="useRevealNavItem()"
        releasedOn="1.0.0"
        description={
            <>
                Reads the current route from React Router (useLocation), matches it to a nav item,
                attaches a ref on the active row, and scrolls it into view when the pathname or link
                list changes.
                <br />
                <br />
                Used in the Design System Layout sidebar — open any page from the left navigation to
                see it live. Must run under a Router (same as Design System Layout).
            </>
        }
    >
        <Ds.block
            title="Basic usage"
            code={`import { useRevealNavItem } from "${SYS.basePath}";

                   const [isActive, activeNavItemRef] = useRevealNavItem({
                    links: navItems,
                    basePath: "/",
                    getPathFromLink: (link) => link[1],
                   });

                   {navItems.map((entry) => {
                    const [name, path] = entry;
                    const isActive = isActive(entry);
                    return (
                        <Button
                            key={path}
                            ref={isActive ? activeNavItemRef : undefined}
                            to={path}
                            activeManually={isActive}
                            // ...other Button props
                        />
                    );
                   })}`}
        />
        <Ds.api
            disableLastBlock
            args="const [isActive, activeNavItemRef] = useRevealNavItem({ pathname, links, basePath, getPathFromLink, block, inline, behavior, extraDeps });"
            props={{
                pathname: {
                    description:
                        "Optional pathname override. Default: useLocation().pathname (hook must run inside a Router).",
                    type: "string",
                },
                links: {
                    description:
                        "Nav items list; used for isActive matching and scroll effect deps.",
                    type: "array",
                    defaultValue: "[]",
                },
                basePath: {
                    description: "URL base when path segment is empty (index route).",
                    type: "string",
                    defaultValue: '"/design-system"',
                },
                getPathFromLink: {
                    description: "Maps a link item to a path segment; default is link[1].",
                    type: "fn",
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
                    description:
                        "Predicate: true when the item matches the current pathname under basePath.",
                    type: "fn",
                },
                activeNavItemRef: {
                    description:
                        "Ref to attach to the active nav element; triggers scrollIntoView when pathname changes.",
                    type: "ref",
                },
            }}
        />
        <Ds.api
            disableLastBlock
            title="getPathFromLink"
            args="getPathFromLink(link);"
            props={{
                link: {
                    description: "Nav entry tuple (name, path, …).",
                    type: "array",
                    required: true,
                },
            }}
        />
        <Ds.api
            title="isActive"
            args="isActive(item);"
            props={{
                item: {
                    description: "Nav entry tuple (name, path, …).",
                    type: "array",
                    required: true,
                },
            }}
        />
    </Ds.page>
);

export default X;

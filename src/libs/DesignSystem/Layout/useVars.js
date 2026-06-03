import { useMatches } from "react-router-dom";
import { useEffect } from "react";
import { DEFAULT_PAGE_TITLE, resolvePageTitleFromMatches } from "./tools/pageTitle";

const useVars = () => {
    const matches = useMatches();
    const pageTitle = resolvePageTitleFromMatches(matches);
    useEffect(() => {
        document.title = DEFAULT_PAGE_TITLE + " | " + pageTitle;
    }, [pageTitle]);

    /*  Return */
    return {};
};
export default useVars;

import { useMatches } from "react-router-dom";
import { useEffect } from "react";

const defPageTitle = "Design System";

const useVars = () => {
    const matches = useMatches();
    const pageTitle =
        [...matches].reverse().find((m) => m.handle?.pageTitle)?.handle?.pageTitle || defPageTitle;
    useEffect(() => {
        document.title = defPageTitle + " | " + pageTitle;
    }, [pageTitle]);

    /*  Return */
    return {};
};
export default useVars;

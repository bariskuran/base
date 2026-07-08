import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import { formatDsNavLabel, getSitemap } from ".";

const DesignSystemRoutes = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                {getSitemap().map(([name, path, El, props]) => (
                    <Route
                        key={path || "index"}
                        path={path}
                        element={<El />}
                        {...props}
                        handle={{
                            pageTitle: formatDsNavLabel(name),
                        }}
                    />
                ))}
            </Route>
        </Routes>
    );
};

export default DesignSystemRoutes;

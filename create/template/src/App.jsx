import { Base, createImageCatalog } from "base";
import { PROJECT_SETTINGS } from "global/PROJECT_SETTINGS";
import imageCatalog from "./imageCatalog";

createImageCatalog(imageCatalog);

const App = () => <Base projectSettings={PROJECT_SETTINGS} />;
export default App;

import Ds from "../DesignSystem";
import { Button } from "../Button";

const X = () => {
    return (
        <Ds.page
            title="useSearchParams()"
            releasedOn="1.0.0"
            description={
                <>
                    This is the React hook version of manageSearchParams.
                    <br />
                    <br />
                    All core features/options live in{" "}
                    <Button.string
                        to="/design-system/manageSearchParams"
                        label="manageSearchParams"
                    />
                    .
                </>
            }
        >
            <Ds.api
                args="const [params, set, clear, raw] = useManageSearchParams({ mapping, defaults, setDefaultsOnMount, disableSetDefaults, replace, maxLength, skipSet, disableBase64, disableTypeControl });"
                returnProps={{
                    params: {
                        description: "Decoded params object returned by manageSearchParams.get().",
                        type: "object",
                    },
                    set: {
                        description:
                            "Wrapper for manageSearchParams.set(). Hook options.defaults apply on each set() unless disableSetDefaults is true.",
                        type: "function",
                    },
                    clear: {
                        description: "Wrapper for manageSearchParams.clear().",
                        type: "function",
                    },
                    raw: {
                        description: "Decoded raw query payload string when available.",
                        type: "string | undefined",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

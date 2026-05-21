import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";

const X = () => (
    <Ds.page
        title="cssNormalizeSize()"
        releasedOn="1.0.0"
        description="Internal helper for normalizing size-like values into CSS-safe output."
    >
        <Ds.block
            title="How it works (quick reminder)"
            code={`import { cssNormalizeSize } from "${SYS.basePath}";

                    cssNormalizeSize(12);         // "12rem"
                    cssNormalizeSize("12");       // "12rem"
                    cssNormalizeSize("12px");     // "12px"
                    cssNormalizeSize(" 1.5 rem "); // "1.5rem" (spaces normalized)
                    cssNormalizeSize(0);          // 0
                    cssNormalizeSize(null);       // undefined`}
            description={`This function is used by internal styling utilities.
                                
                    Rules:
                    - null/undefined -> undefined
                    - 0/"0" -> 0 (unitless zero)
                    - number -> "<n>rem"
                    - numeric string -> "<n>rem"
                    - already-unit strings (px, rem, em, %, vw, vh, etc.) stay as-is
                    - unknown strings are returned after trimming whitespace`}
        />
        <Ds.api
            args="const size = cssNormalizeSize(value);"
            props={{
                value: {
                    description: "Any potential css size input.",
                    type: "any",
                    required: true,
                },
            }}
            returnProps={{
                size: {
                    description: "Normalized CSS size value, or undefined for missing input.",
                    type: "string | number | undefined",
                },
            }}
        />
    </Ds.page>
);

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";

const X = () => (
    <Ds.page
        title="cssSpacingResolver()"
        releasedOn="1.0.0"
        description="Internal helper that resolves margin/padding shorthands + side overrides into a 4-side CSS string."
    >
        <Ds.block
            title="How it works (quick reminder)"
            code={`import { cssSpacingResolver } from "${SYS.basePath}";

                    cssSpacingResolver({ margin: "10 20" }); 
                    // "10rem 20rem 10rem 20rem"
                    
                    cssSpacingResolver({ margin: "10px", marginLeft: "5px" });
                    // "10px 10px 10px 5px"
                    
                    cssSpacingResolver({ padding: "4 8", paddingTop: "20" }, "padding");
                    // "20rem 8rem 4rem 8rem"`}
            description={`Used internally by layout/styling helpers.
                                
                    Flow:
                    - reads base shorthand from props[key] (default key = "margin")
                    - expands 1/2/3/4-value shorthand to top/right/bottom/left
                    - applies side-specific overrides (e.g. marginTop, marginLeft, kebab-case too)
                    - normalizes each side via cssNormalizeSize
                    - returns final "top right bottom left" string
                    - if all sides are missing, returns null`}
        />
        <Ds.api
            args='const spacing = cssSpacingResolver(props, key);'
            props={{
                props: {
                    description: "Object that may contain shorthand + side spacing fields.",
                    type: "object",
                    required: true,
                },
                key: {
                    description: 'Base key to resolve ("margin" or "padding", etc.).',
                    type: "string",
                    defaultValue: '"margin"',
                },
            }}
            returnProps={{
                spacing: {
                    description:
                        'Normalized "top right bottom left" CSS spacing string, or null when all sides are missing.',
                    type: "string | null",
                },
            }}
        />
    </Ds.page>
);

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { colorConverter } from ".";
import { Typo } from "../Typo";

const data = colorConverter("#3498db");

const X = () => (
    <Ds.page
        title="<colorConverter>"
        releasedOn="1.0.0"
        description="Converts a color into multiple color spaces and formats."
    >
        <Ds.block
            title="String Input"
            code={`import { colorConverter } from "${SYS.basePath}";

const data = colorConverter("#3498db");`}
            example={<Typo.span children={JSON.stringify(data)} />}
        />
        <Ds.block
            title="Object Input"
            code={`colorConverter({ hslArray: [200, 70, 45] });`}
            example={
                <Typo.span children={JSON.stringify(colorConverter({ hslArray: [200, 70, 45] }))} />
            }
        />
        <Ds.api
            props={{
                colorInput: {
                    description: "Color input string or supported object payload.",
                    type: "string | object",
                    required: true,
                    defaultValue: "undefined",
                },
                return: {
                    description:
                        "{ hex6, hex8, rgb/rgba, hsl/hsla, hsb/hsba, luminance, linearRgbaArray }",
                    type: "object",
                    required: true,
                    defaultValue: "{}",
                },
            }}
        />
    </Ds.page>
);

export default X;

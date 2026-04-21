import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { ScrollBar } from "./";
import { generateRandom } from "../generateRandom";

const longText = generateRandom.loremIpsum(100);
const Example1 = () => (
    <div
        style={{
            width: "300px",
            height: "100px",
            backgroundColor: "aliceblue",
        }}
    >
        <ScrollBar />
        {longText}
    </div>
);

const X = () => (
    <Ds.page
        title="ScrollBar"
        releasedOn="1.0.0"
        description="ScrollBar renders a scrollbar component for design system documentation, displaying a scrollbar with a truck and a thumb."
    >
        <Ds.block
            title="yAxis Usage"
            code={`import { ScrollBar } from "${SYS.basePath}";

                <div style={{ height: "100px" }}>
                    <ScrollBar />
                    {longText}
                </div>`}
            example={<Example1 />}
        />
        <Ds.api
            props={{
                props: {
                    description: "prop description",
                    type: "prop type",
                    required: true,
                    defaultValue: "prop default value",
                },
            }}
        />
    </Ds.page>
);
export default X;

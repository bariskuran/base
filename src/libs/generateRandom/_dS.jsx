import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { generateRandom } from ".";
import { Typography } from "../Typography";

const X = () => (
    <Ds.page
        title="<generateRandom>"
        releasedOn="1.0.0"
        description="Random number, text and lorem generators."
    >
        <Ds.block
            title="Number / Text / Lorem"
            code={`import { generateRandom } from "${SYS.basePath}";

generateRandom.number(10, 99);
generateRandom.text(12, { useUpperCase: true, useNumbers: true });
generateRandom.loremIpsum(15);`}
            example={
                <>
                    <Typography.span children={`number: ${generateRandom.number(10, 99)}`} />
                    <Typography.span
                        children={`text: ${generateRandom.text(12, {
                            useUpperCase: true,
                            useNumbers: true,
                        })}`}
                    />
                    <Typography.span children={generateRandom.loremIpsum(12)} />
                </>
            }
        />
        <Ds.api
            props={{
                "number(min,max,decimal,toLocaleString)": {
                    description: "Random numeric generator.",
                    type: "(number?, number?, number?, boolean?) => number|string",
                    required: false,
                    defaultValue: "(0,100,0,false)",
                },
                "text(length,settings)": {
                    description: "Random text generator.",
                    type: "(number?, object?) => string",
                    required: false,
                    defaultValue:
                        "(16,{ useLowerCase:true, useUpperCase:false, useNumbers:false, useSymbols:false })",
                },
                "loremIpsum(count,disableDot)": {
                    description: "Random lorem ipsum generator.",
                    type: "(number?, boolean?) => string",
                    required: false,
                    defaultValue: "(50,false)",
                },
            }}
        />
    </Ds.page>
);

export default X;

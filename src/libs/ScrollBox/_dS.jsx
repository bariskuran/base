import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { ScrollBox } from "./";
import { Button } from "../Button";
import { generateRandom } from "../generateRandom";
// import { baseStore } from "../@baseStore";
const longText = generateRandom.loremIpsum(1000);

const X = () => {
    // const { isHover, isActive, setLocalByPath } = baseStore.useLocal({
    //     isHover: false,
    //     isActive: false,
    // });

    /* RETURN */
    return (
        <Ds.page
            title="<ScrollBox>"
            releasedOn="1.0.0"
            description={`<ScrollBox> komponenti, <Flex>'i <ScrollBar> ile entegre ederek, istenilen ölçülerde, scroll edilebilen bir Flex oluşturur.`}
        >
            <Ds.block
                title="Basic usage"
                description="XXXX"
                code={`import { ScrollBox } from "${SYS.basePath}";
`}
                example={
                    <ScrollBox width={200} height={100}>
                        {longText}
                    </ScrollBox>
                }
            />
            <Ds.api
                props={{
                    icon: {
                        description:
                            "Icon name from the library or a custom icon array in the form of [viewBox, content].",
                        type: "string | array",
                        required: true,
                        defaultValue: "warning",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

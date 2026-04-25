import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { ScrollFlex } from "./";
import { generateRandom } from "../generateRandom";
import { Button } from "../Button";

const longText = generateRandom.loremIpsum(1000);

const X = () => {
    return (
        <Ds.page
            title="<ScrollFlex>"
            releasedOn="1.0.0"
            description={
                <>
                    ScrollFlex integrates Flex with a ScrollBar to create a scrollable Flex
                    container at any desired size.
                    <br />
                    <br />
                    It is ideal for everyday use. For more advanced scenarios, use{" "}
                    <Button.string to="/design-system/scrollBar" label="ScrollBar" /> with a
                    customized <Button.string to="/design-system/flex" label="Flex" /> or a
                    customized content area.
                </>
            }
        >
            <Ds.block
                title="Basic usage"
                description="It is recommended to specify both width and height when using ScrollFlex. This will give you the cleanest result."
                code={`import { ScrollFlex } from "${SYS.basePath}"
                
                        <ScrollFlex width={200} height={100}>
                            {longText}
                        </ScrollFlex>;`}
                example={
                    <ScrollFlex width={200} height={100}>
                        {longText}
                    </ScrollFlex>
                }
            />
            <Ds.api
                props={{
                    width: {
                        description: "ScrollBox width. Uses parent width when omitted.",
                        type: "number | string",
                        defaultValue: "100%",
                    },
                    height: {
                        description:
                            "ScrollBox height. Uses parent rect height when omitted and maxHeight is not provided.",
                        type: "number | string",
                        defaultValue: "parent height",
                    },
                    scrollBarProps: {
                        description: (
                            <>
                                Check out{" "}
                                <Button.string to="/design-system/scrollBar" label="ScrollBar" />{" "}
                                api.
                            </>
                        ),
                        type: "object",
                    },
                    flexProps: {
                        description: (
                            <>
                                Check out <Button.string to="/design-system/flex" label="Flex" />{" "}
                                api.
                            </>
                        ),
                        type: "object",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

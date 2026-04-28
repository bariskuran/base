import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { FloatingUi } from "../FloatingUi";

const X = () => {
    /* RETURN */
    return (
        <Ds.page
            title="<FloatingUi>"
            releasedOn="1.0.0"
            description="Button is combination of RRD's <Link>, HTML's<a> and <button> elements. It automatically detects the content and renders the appropriate element."
        >
            <Ds.block
                title="Basic Usage"
                code={`import { FloatingUi } from "${SYS.basePath}";

                        `}
                example={
                    <Flex xAlign="start" gap={10}>
                        <FloatingUi>
                            <div>FloatingUi</div>
                        </FloatingUi>
                    </Flex>
                }
            />
            <Ds.api
                props={{
                    variant: {
                        description: "Variant name or custom styled variant.",
                        type: "string | component",
                        required: false,
                        defaultValue: '"default"',
                    },
                }}
            />
        </Ds.page>
    );
};
export default X;

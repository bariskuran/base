import { DSBlock } from "../DSBlock";
import { Typo } from "../Typography";
import { DSApiViewer } from "../DSApiViewer";

export const X = () => {
    /* RETURN */
    return (
        <>
            <Typo.h3>DSCodeViewer</Typo.h3>
            <Typo.p>
                The DSCodeViewer component is used to display code in a styled container.
            </Typo.p>
            <DSBlock
                title="Basic Usage"
                description="The DSCodeViewer component is used to display code in a styled container."
                code={`const { setLocal, showOnClickValues, isHover, clickBlocker, isActive } = baseStore.useLocal({
                showOnClickValues: false,
                isHover: false,
                isActive: false,
                clickBlocker: false,
            });`}
                example={<div>Example</div>}
            />
            <DSApiViewer
                api={[
                    {
                        name: "test1",
                        description: "test1 description",
                        type: "string",
                        required: true,
                        defaultValue: "test1 default",
                    },
                    {
                        name: "test1",
                        description: "test1 description",
                        type: "string",
                        required: true,
                        defaultValue: "test1 default",
                    },
                    {
                        name: "test1",
                        description: "test1 description",
                        type: "string",
                        required: true,
                        defaultValue: "test1 default",
                    },
                ]}
            />
        </>
    );
};
export default X;

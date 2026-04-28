import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { scrollLock } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";

const X = () => (
    <Ds.page title="<scrollLock>" releasedOn="1.0.0" description="Locks/unlocks document scrolling.">
        <Ds.block
            title="Basic Usage"
            code={`import { scrollLock } from "${SYS.basePath}";

scrollLock(true);
// ...
scrollLock(false);`}
            example={
                <Flex xAlign="start" gap={10}>
                    <Button label="Lock scroll" onClick={() => scrollLock(true)} />
                    <Button label="Unlock scroll" onClick={() => scrollLock(false)} />
                </Flex>
            }
        />
        <Ds.api
            props={{
                boo: {
                    description: "True to lock scroll, false to restore.",
                    type: "boolean",
                    required: true,
                    defaultValue: "undefined",
                },
                return: {
                    description: "void",
                    type: "void",
                    required: true,
                    defaultValue: "undefined",
                },
            }}
        />
    </Ds.page>
);

export default X;

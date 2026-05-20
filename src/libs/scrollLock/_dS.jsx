import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { scrollLock } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Space } from "../Space";
import { baseStore } from "../@baseStore";

const X = () => {
    const { status, setLocal } = baseStore.useLocal({ status: "idle" });

    return (
        <Ds.page
            title="scrollLock()"
            releasedOn="1.0.0"
            description="Locks/unlocks document scrolling."
        >
            <Ds.block
                title="Basic usage"
                code={`import { scrollLock } from "${SYS.basePath}";

                        scrollLock(true);

                        scrollLock(false);`}
                example={
                    <Flex.column gap={10} padding={10}>
                        <Flex gap={10}>
                            <Button
                                label="Lock scroll"
                                onClick={() => {
                                    scrollLock(true);
                                    setLocal((s) => {
                                        s.status = "locked";
                                    });
                                }}
                            />
                            <Button
                                label="Unlock scroll"
                                onClick={() => {
                                    scrollLock(false);
                                    setLocal((s) => {
                                        s.status = "unlocked";
                                    });
                                }}
                            />
                        </Flex>
                        <Space size="s" />
                        <Typo.span balance>Last action: {status}</Typo.span>
                    </Flex.column>
                }
            />
            <Ds.api
                args="scrollLock(boo);"
                returns="void."
                props={{
                    boo: {
                        description: "True to lock scroll, false to restore.",
                        type: "boolean",
                        required: true,
                    },
                }}
            />
            <Space size={2000} />
        </Ds.page>
    );
};

export default X;

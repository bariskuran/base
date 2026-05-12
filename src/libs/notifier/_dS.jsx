import { useCallback, useState } from "react";
import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { notifier } from ".";
import { Flex } from "../Flex";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";

const QueuePeek = () => {
    const [count] = baseStore.useGlobal((s) => [s._notifier?.count ?? 0]);
    return <Typo.code codeFormat={false}>Current count: {count}</Typo.code>;
};

const X = () => {
    const [lastId, setLastId] = useState(null);
    const [stickyId, setStickyId] = useState(null);

    const captureAdd = useCallback((fn) => {
        const id = fn();
        if (id) setLastId(id);
    }, []);

    return (
        <Ds.page
            title="notifier"
            releasedOn="1.0.0"
            description={
                <>
                    <Typo.p>
                        Add to global notification queue / remove single entry / clear all.
                        NotifierListener must be rendered at the root of the app.
                    </Typo.p>
                    <Typo.p>
                        Notifications and Notifier Settings are stored in GlobalData. And
                        notifierSettings are located at PROJECT_SETTINGS.notifierSettings.
                    </Typo.p>
                    <Typo.code>
                        {`notifierSettings: {
                            killAfter: 5, // secs, default is 5
                            disableNotifier: true, // default is false
                            disableAutoKill: true, // default is false
                            closingDelay: 0.5, // secs, default is 0.5
                            variant: "plain", // default notification variant
                        },`}
                    </Typo.code>
                    <QueuePeek />
                </>
            }
        >
            <Ds.block
                title="Basic usage"
                code={`import { notifier } from "${SYS.basePath}";

                    const id = notifier.add("nofitication text");
                    notifier.remove(id);
                    notifier.clear();`}
                example={
                    <Flex gap={8} wrap full>
                        <Button.plain
                            label="add (killAfter: 8)"
                            onClick={() => captureAdd(() => notifier.add("Added with autoKill."))}
                        />
                        <Button.plain
                            label="remove (last id)"
                            disabled={!lastId}
                            onClick={() => {
                                if (lastId) notifier.remove(lastId);
                            }}
                        />
                        <Button.plain label="clear()" onClick={() => notifier.clear()} />
                    </Flex>
                }
            />
            <Ds.block
                title="disableAutoKill + remove"
                code={`import { notifier } from "${SYS.basePath}";

                    const id = notifier.add("disableAutoKill: true", { disableAutoKill: true });
                    notifier.remove(id);`}
                description="The notification will stay until closed; use the close icon on the notification or notifier.remove(id) to dismiss it."
                example={
                    <Flex gap={10} wrap full>
                        <Button.plain
                            label="add (disableAutoKill)"
                            onClick={() => {
                                const id = notifier.add("disableAutoKill: true", {
                                    disableAutoKill: true,
                                });
                                if (id) setStickyId(id);
                            }}
                        />
                        <Button.plain
                            label="remove (sticky id)"
                            disabled={!stickyId}
                            onClick={() => {
                                if (stickyId) notifier.remove(stickyId);
                            }}
                        />
                    </Flex>
                }
            />
            <Ds.block
                title="bgColor (success / error)"
                code={`notifier.add("Tamam", { bgColor: "success", killAfter: 5 });
                    notifier.add("Hata", { bgColor: "error", killAfter: 5 });`}
                description="Use 'bgColor' (theme key or color) for the visible color;"
                example={
                    <Flex gap={8} wrap>
                        <Button.plain
                            label="success"
                            onClick={() =>
                                notifier.add("bgColor:'success'", {
                                    bgColor: "success",
                                })
                            }
                        />
                        <Button.plain
                            label="error"
                            onClick={() =>
                                notifier.add("bgColor: 'error'", {
                                    bgColor: "error",
                                })
                            }
                        />
                    </Flex>
                }
            />
            <Ds.block
                title="Multiple calls"
                code={`import { NotifierListener } from "${SYS.basePath}/libs/NotifierListener";

                        <NotifierListener />
                        <NotifierListener.plain />`}
                example={
                    <Flex gap={8} wrap>
                        <Button.plain
                            label="x40"
                            onClick={() =>
                                Array.from({ length: 40 }).forEach((_, index) =>
                                    notifier.add(`item: ${index + 1}`, { disableAutoKill: true }),
                                )
                            }
                        />
                    </Flex>
                }
            />
            <Ds.block
                title="NotifierListener variants"
                code={`import { NotifierListener } from "${SYS.basePath}/libs/NotifierListener";

                        <NotifierListener />
                        <NotifierListener.plain />`}
                example={
                    <Flex gap={8} wrap>
                        <Button.plain
                            label="variant usage"
                            onClick={() =>
                                notifier.add("variant usage", {
                                    variant: "test",
                                })
                            }
                        />
                    </Flex>
                }
            />
            <Ds.api
                args={[
                    "notifier.add(notification, { killAfter, closingDelay, disableAutoKill, bgColor, variant })",
                    "notifier.remove(queueId)",
                    "notifier.clear()",
                ]}
                returns="notifier.add → queueId | null; notifier.remove / notifier.clear → boolean."
                props={{
                    killAfter: {
                        description: "Kill after (seconds).",
                        type: "number",
                    },
                    closingDelay: {
                        description: "Closing delay (seconds).",
                        type: "number",
                    },
                    disableAutoKill: {
                        description: "Disable auto kill.",
                        type: "boolean",
                    },
                    bgColor: {
                        description: "Background color.",
                        type: "string",
                    },
                    variant: {
                        description:
                            "Notification variant name or custom styled variant. Overrides notifierSettings.variant for that notification.",
                        type: "string | React component",
                    },
                    notification: {
                        description: "Notification.",
                        type: "string | object",
                    },
                    queueId: {
                        description:
                            "Prepared queueId. (add creates it as return. remove uses it as argument.)",
                        type: "number",
                    },
                }}
                returnProps={{
                    queueId: {
                        description:
                            "Returns the queueId of the added notification. (notifier.add)",
                        type: "number | null",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

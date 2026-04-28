import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { sleep } from ".";
import { Button } from "../Button";
import { useState } from "react";

const SleepPreview = () => {
    const [label, setLabel] = useState("Ready");
    return (
        <Button
            label={label}
            onClick={async () => {
                setLabel("Waiting 500ms...");
                await sleep(500);
                setLabel("Done");
            }}
        />
    );
};

const X = () => (
    <Ds.page title="<sleep>" releasedOn="1.0.0" description="Promise based delay helper.">
        <Ds.block
            title="Basic Usage"
            code={`import { sleep } from "${SYS.basePath}";

await sleep(500);`}
            example={<SleepPreview />}
        />
        <Ds.api
            props={{
                ms: { description: "Delay duration in milliseconds.", type: "number", required: true, defaultValue: "undefined" },
                return: { description: "Promise resolved after given delay.", type: "Promise<void>", required: true, defaultValue: "Promise" },
            }}
        />
    </Ds.page>
);

export default X;

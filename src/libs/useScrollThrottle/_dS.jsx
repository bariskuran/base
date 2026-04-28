import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useScrollThrottle } from ".";
import { useState } from "react";
import { Typography } from "../Typography";

const Demo = () => {
    const [count, setCount] = useState(0);
    useScrollThrottle(() => setCount((v) => v + 1), 120);
    return <Typography.span>{`throttled scroll calls: ${count}`}</Typography.span>;
};

const X = () => (
    <Ds.page title="<useScrollThrottle>" releasedOn="1.0.0" description="Throttles callback on window scroll.">
        <Ds.block
            title="Throttled Scroll Callback"
            code={`import { useScrollThrottle } from "${SYS.basePath}";

useScrollThrottle(() => {
  // on scroll
}, 120);`}
            example={<Demo />}
        />
        <Ds.api
            props={{
                callback: { description: "Function called on throttled scroll.", type: "function", required: true, defaultValue: "undefined" },
                delay: { description: "Minimum interval in milliseconds.", type: "number", required: false, defaultValue: "100" },
            }}
        />
    </Ds.page>
);

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useScrollThrottle } from ".";
import { Typo } from "../Typo";
import { baseStore } from "../@baseStore";

const X = () => {
    const { count, setLocal } = baseStore.useLocal({ count: 0 });
    useScrollThrottle(
        () =>
            setLocal((s) => {
                s.count += 1;
            }),
        120,
    );

    return (
        <Ds.page
            title="useScrollThrottle()"
            releasedOn="1.0.0"
            description="Throttles callback on window scroll."
        >
            <Ds.block
                title="Throttled Scroll Callback"
                code={`import { useScrollThrottle } from "${SYS.basePath}";

useScrollThrottle(() => {
    // on scroll
}, 120);`}
                example={<Typo.span>{`throttled scroll calls: ${count}`}</Typo.span>}
            />
            <Ds.api
                args="useScrollThrottle(callback, delay);"
                returns="void."
                props={{
                    callback: {
                        description: "Function called on throttled scroll.",
                        type: "function",
                        required: true,
                    },
                    delay: {
                        description: "Minimum interval in milliseconds.",
                        type: "number",
                        defaultValue: "100",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;

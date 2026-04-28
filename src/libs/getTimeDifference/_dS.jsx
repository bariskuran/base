import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { getTimeDifference } from ".";
import { Typography } from "../Typography";

const a = Date.now();
const b = a + 1000 * 60 * 60 * 26 + 3500; // 1 day + 2h + 3.5s
const diff = getTimeDifference(a, b);

const X = () => (
    <Ds.page
        title="<getTimeDifference>"
        releasedOn="1.0.0"
        description="Returns signed breakdown between two timestamps."
    >
        <Ds.block
            title="Basic Usage"
            code={`import { getTimeDifference } from "${SYS.basePath}";

const diff = getTimeDifference(startTs, endTs);`}
            example={<Typography.span children={JSON.stringify(diff)} />}
        />
        <Ds.api
            props={{
                a: {
                    description: "Start timestamp or Date.",
                    type: "number | Date",
                    required: true,
                    defaultValue: "undefined",
                },
                b: {
                    description: "End timestamp or Date.",
                    type: "number | Date",
                    required: true,
                    defaultValue: "undefined",
                },
                return: {
                    description:
                        "{ ts, sign, totalDays, day, hour, minute, second, millisecond, diff }",
                    type: "object",
                    required: true,
                    defaultValue: "computed",
                },
            }}
        />
    </Ds.page>
);

export default X;

import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Button } from "../Button";

const X = () => {
    return (
        <Ds.page
            title="useDelayedFunction()"
            releasedOn="1.0.0"
            description={
                <>
                    This is a hook version of the 'delayedFunction', designed for use in React
                    components. Its core functionality is contained within the delayedFunction
                    itself.
                    <br />
                    <br />
                    Check out{" "}
                    <Button.string to="/design-system/delayedFunction" label="delayedFunction" /> to
                    see core props and tests.
                </>
            }
        >
            <Ds.block
                title="Basic Usage"
                lastBlock
                code={`import { useDelayedFunction } from "${SYS.basePath}";

                        const { run, cancel, runNow, isPending } = delayedFunction(fn, { delay: 500 });`}
            />
        </Ds.page>
    );
};

export default X;

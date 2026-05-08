import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Button } from "../Button";

const X = () => {
    return (
        <Ds.page
            title="useDebouncedFunction()"
            releasedOn="1.0.0"
            description={
                <>
                    This is a hook version of the 'debouncedFunction', designed for use in React
                    components. Its core functionality is contained within the debouncedFunction
                    itself.
                    <br />
                    <br />
                    Check out{" "}
                    <Button.string
                        to="/design-system/debouncedFunction"
                        label="debouncedFunction"
                    />{" "}
                    to see core props and tests.
                </>
            }
        >
            <Ds.block
                title="Basic Usage"
                lastBlock
                code={`import { useDebouncedFunction } from "${SYS.basePath}";

                    const debuncedFunction = useDebouncedFunction(fn, 
                        { 
                            delay,
                            isThrottle,
                            getFirst,
                            functionName,
                            onStart,
                            onEnd,
                        },
                    );

                    debuncedFunction();`}
            />
        </Ds.page>
    );
};

export default X;

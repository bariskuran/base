import { Button } from "./";

export const ButtonTest = () => {
    return (
        <>
            <Button onClick={() => console.log("click")} label="both enabled" />
            {/* <Button onClick={() => console.log("click")} label="2" /> */}
        </>
    );
};

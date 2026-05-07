import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flag } from ".";
import { Flex } from "../Flex";
import { Button } from "../Button";

const X = () => (
    <Ds.page
        title="<Flag>"
        releasedOn="1.0.0"
        description={
            <>
                Flag component renders country/region flags via internal flag library and Icon
                renderer. If a flag code is missing, it falls back to <code>global</code>.
                <br />
                <br />
                Check out <Button.string to="/design-system/flagLibrary" label="Flag Library" />.
            </>
        }
    >
        <Ds.block
            title="Basic usage"
            code={`import { Flag } from "${SYS.basePath}";

<Flex gap={12} xAlign="start">
  <Flag flag="tr" width={18} />
  <Flag flag="us" width={18} />
  <Flag flag="de" width={18} />
</Flex>`}
            example={
                <Flex gap={12} xAlign="start">
                    <Flag flag="tr" width={18} />
                    <Flag flag="us" width={18} />
                    <Flag flag="de" width={18} />
                </Flex>
            }
        />
        <Ds.block
            title="Fallback behavior"
            description="When an unknown flag key is provided, Flag falls back to 'global'."
            code={`<Flex gap={12} xAlign="start">
  <Flag flag="unknown-code" width={18} />
  <Flag flag="global" width={18} />
</Flex>`}
            example={
                <Flex gap={12} xAlign="start">
                    <Flag flag="unknown-code" width={18} />
                    <Flag flag="global" width={18} />
                </Flex>
            }
        />
        <Ds.api
            args="<Flag />"
            props={{
                flag: {
                    description:
                        "Flag key from internal flag library (typically ISO-like lowercase code).",
                    type: "string",
                    defaultValue: '"global"',
                },
                width: {
                    description: "Rendered flag size (Icon width/size rules apply).",
                    type: "number | string",
                    defaultValue: "10",
                },
                color: {
                    description: "Optional color override passed to Icon.",
                    type: "string",
                    defaultValue: "library default",
                },
                hoverManually: {
                    description: "Manual hover state forwarding to Icon.",
                    type: "boolean",
                    defaultValue: "false",
                },
                activeManually: {
                    description: "Manual active state forwarding to Icon.",
                    type: "boolean",
                    defaultValue: "false",
                },
                pendingManually: {
                    description: "Manual pending state forwarding to Icon.",
                    type: "boolean",
                    defaultValue: "false",
                },
                popTipProps: {
                    description: "Optional PopTip configuration forwarded to Icon.",
                    type: "object",
                    defaultValue: "{}",
                },
            }}
        />
    </Ds.page>
);

export default X;

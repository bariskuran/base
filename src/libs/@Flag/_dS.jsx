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
                Check out <Button.string to="/design-system/flagLibrary" label="Flag Library" />.
                <br />
                <br />
                Flag component is built on top of the 'Icon' component. Check out{" "}
                <Button.string to="/design-system/icon" label="Icon" /> for props. But keep in mind
                style props like color, hoverColor, activeColor, etc. doesn't work with Flag. And
                instead of 'icon' prop, use 'flag' prop.
            </>
        }
    >
        <Ds.block
            title="Basic usage"
            code={`import { Flag } from "${SYS.basePath}";

                  <Flag flag="tr" />
                  <Flag flag="us" />
                  <Flag flag="de" />`}
            example={
                <Flex gap={12} xAlign="start">
                    <Flag flag="tr" />
                    <Flag flag="us" />
                    <Flag flag="de" />
                </Flex>
            }
        />
        <Ds.block
            title="Size"
            code={`import { Flag } from "${SYS.basePath}";

                  <Flag flag="tr" width={18} />
                  <Flag flag="gb" width={24} />
                  <Flag flag="gr" width={30} />`}
            example={
                <Flex gap={12} xAlign="start">
                    <Flag flag="gr" width={18} />
                    <Flag flag="gr" width={40} />
                    <Flag flag="gr" width={60} />
                </Flex>
            }
        />
        <Ds.block
            title="Fallback behavior"
            lastBlock
            description="When an unknown flag key is provided, Flag falls back to 'global'."
            code={`import { Flag } from "${SYS.basePath}";

                      <Flag flag="unknown-code" width={18} />
                      <Flag flag="global" width={18} />
                    `}
            example={
                <Flex gap={12} xAlign="start">
                    <Flag flag="unknown-code" width={18} />
                    <Flag flag="global" width={18} />
                </Flex>
            }
        />
    </Ds.page>
);

export default X;

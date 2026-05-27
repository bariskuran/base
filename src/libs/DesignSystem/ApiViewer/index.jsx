import S from "./_styled";
import { PopTip } from "../../PopTip";
import { Typo } from "../../Typo";
import Block from "../Block";
import { copyToClipboard } from "../../copyToClipboard";
import { Flex } from "../../Flex";
import { Button } from "../../Button";
import { Icon } from "../../@Icon";

const ApiViewer = ({ props, args, returns, returnProps, disableLastBlock, title, full }) => {
    const hasProps = props && typeof props === "object" && Object.keys(props).length > 0;
    const hasReturnProps =
        returnProps && typeof returnProps === "object" && Object.keys(returnProps).length > 0;
    if (!hasProps && !hasReturnProps && !args && !returns) return null;

    const sortedEntries = Object.entries(props || {}).sort(
        ([nameA, metaA = {}], [nameB, metaB = {}]) => {
            const reqA = !!metaA.required;
            const reqB = !!metaB.required;
            if (reqA !== reqB) return reqA ? -1 : 1;
            return String(nameA).localeCompare(String(nameB), undefined, {
                sensitivity: "base",
            });
        },
    );

    const sortedReturnProps = Object.entries(returnProps || {}).sort(
        ([nameA, metaA = {}], [nameB, metaB = {}]) => {
            const reqA = !!metaA.required;
            const reqB = !!metaB.required;
            if (reqA !== reqB) return reqA ? -1 : 1;
            return String(nameA).localeCompare(String(nameB), undefined, {
                sensitivity: "base",
            });
        },
    );

    const blockTitle =
        title != null && String(title).trim() !== "" ? `${String(title).trim()} Api` : "Api";

    return (
        <Block
            lastBlock={!disableLastBlock}
            title={blockTitle}
            example={
                <Flex.column gap={10} marginTop={5} full>
                    {args && (
                        <Flex.column
                            gap={10}
                            marginBottom={hasProps || hasReturnProps || returns ? 40 : 0}
                            full
                            minWidth={0}
                        >
                            {typeof args === "string" ? (
                                <Typo.code
                                    lineHeight={1.5}
                                    balance
                                    copy
                                    content={args}
                                    codeFormat={false}
                                    codeFormatJsxProps={false}
                                    codeFormatCalls={false}
                                    padding={10}
                                    whiteSpace="pre-wrap"
                                    {...(full ? { full: true } : {})}
                                />
                            ) : Array.isArray(args) ? (
                                args.map((arg, i) => (
                                    <Typo.code
                                        lineHeight={1.5}
                                        balance
                                        copy
                                        content={arg}
                                        codeFormat={false}
                                        codeFormatJsxProps={false}
                                        codeFormatCalls={false}
                                        key={i}
                                        padding={10}
                                        whiteSpace="pre-wrap"
                                        {...(full ? { full: true } : {})}
                                    />
                                ))
                            ) : null}
                        </Flex.column>
                    )}
                    {hasProps && (
                        <Flex.column
                            gap={10}
                            marginBottom={hasReturnProps || returns ? 40 : 0}
                            full
                            minWidth={0}
                        >
                            <Typo.span weight="bold">Arguments</Typo.span>
                            <PropContainer obj={sortedEntries} />
                        </Flex.column>
                    )}
                    {(hasReturnProps || (returns && !hasReturnProps)) && (
                        <Flex.column gap={10} full>
                            <Typo.span weight="bold">Return Arguments</Typo.span>
                            {hasReturnProps && <PropContainer obj={sortedReturnProps} />}
                            {returns && !hasReturnProps && <Typo.span>{returns}</Typo.span>}
                        </Flex.column>
                    )}
                </Flex.column>
            }
        />
    );
};
export default ApiViewer;

const PropContainer = ({ obj = [] }) => {
    if (!Array.isArray(obj) || obj.length === 0) return null;

    return (
        <S.container>
            <S.row $striped>
                <div>*</div>
                <div>Name</div>
                <div>Type</div>
                <div>Description</div>
                <div>Default Value</div>
            </S.row>
            {obj.map(([name, item], index) => (
                <PropTable key={name} name={name} item={item} striped={index % 2 === 0} />
            ))}
        </S.container>
    );
};

const formatDefaultValue = (value) => {
    if (value == null || value === "") return "—";
    if (typeof value === "function") return value.toString();
    if (typeof value === "object") {
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return "[object]";
        }
    }
    return value;
};

const PropTable = ({ name, item, striped }) => {
    const { description, type, required, defaultValue } = item || {};
    const defaultValueDisplay = formatDefaultValue(defaultValue);

    /* Return */
    return (
        <S.row key={name} $striped={striped}>
            <div>
                <PopTip content="Required">
                    {required ? <Icon icon="asteriks" width={9} /> : ""}
                </PopTip>
            </div>
            {name !== "return" ? (
                <Button.withCopyIcon onClick={() => copyToClipboard(name)} label={name} />
            ) : (
                <Typo.span>{name}</Typo.span>
            )}
            <div>{type}</div>
            <div>{description}</div>
            <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {defaultValueDisplay}
            </div>
        </S.row>
    );
};

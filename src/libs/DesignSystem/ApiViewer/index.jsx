import S from "./_styled";
import { PopTip } from "../../PopTip";
import { Typo } from "../../Typo";
import Block from "../Block";
import { copyToClipboard } from "../../copyToClipboard";
import { Flex } from "../../Flex";
import { Button } from "../../Button";
import { Icon } from "../../@Icon";

const Com = ({ arg }) => <Button.withCopyIcon onClick={() => copyToClipboard(arg)} label={arg} />;

const ApiViewer = ({ props, args, returns, returnProps, disableLastBlock }) => {
    /* RETURN */
    if (!props || typeof props !== "object" || Object.keys(props).length === 0) return null;

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

    return (
        <Block
            lastBlock={!disableLastBlock}
            title="Api"
            example={
                <Flex.column gap={10} marginTop={5} full>
                    {args && (
                        <Flex.column gap={10} marginBottom={40} aria-label="Arguments">
                            {typeof args === "string" ? (
                                <Com arg={args} />
                            ) : Array.isArray(args) ? (
                                args.map((arg, i) => <Com arg={arg} key={i} />)
                            ) : null}
                        </Flex.column>
                    )}
                    <PropContainer obj={sortedEntries} />
                    {returns && (
                        <Flex marginTop={20}>
                            <span>
                                <b>Returns: </b>
                            </span>{" "}
                            {returns}
                        </Flex>
                    )}
                    <PropContainer obj={sortedReturnProps} />
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

const PropTable = ({ name, item, striped }) => {
    const { description, type, required, defaultValue } = item || {};

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
            <div>{defaultValue}</div>
        </S.row>
    );
};

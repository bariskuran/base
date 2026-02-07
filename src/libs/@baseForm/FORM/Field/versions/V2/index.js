import { Icon } from "../../../../Icon";
import { Skeleton } from "../../../../Skeleton";
import { Container, DebugWrapper } from "./_styled";

export const V2 = ({
    children,
    fieldState,
    conditionalStyledProps,
    isReadyOnAllConditionsMet,
    // errors,
    // onOpenChange,
    helperActions,
    onHelperClick,
    // label,
    labelIcon,
    debugMode,
    name,
    nonHeaderField,
    // isRequired,
}) => {
    const { value, lastSubmittedValue } = fieldState || {};

    /* Special Actions For "SEARCH" Field */
    const enableSearchClear = name === "search" && value && value === lastSubmittedValue;
    const clear = () => helperActions?.find((i) => i.label === "Clear Value")?.onClick?.();
    /* Return */
    return (
        <DebugWrapper
            aria-label="DebugWrapper"
            className={nonHeaderField ? "nonHeaderField" : ""}
            $nonHeaderField={nonHeaderField}
        >
            <Container
                aria-label="Helper Container"
                {...conditionalStyledProps}
                $enableSearchClear={enableSearchClear}
            >
                <Skeleton
                    show={!isReadyOnAllConditionsMet}
                    useForm
                    aria-label={name + "skeletonV2"}
                />
                <div id="labelIcon" onClick={onHelperClick}>
                    {labelIcon && <Icon icon={labelIcon} width={14} />}
                </div>
                <div id="content">{children}</div>
                {enableSearchClear && (
                    <div id="actionsArea" onClick={clear}>
                        <Icon icon="close" width={10} />
                    </div>
                )}
            </Container>
            {debugMode && (
                <div id="debugArea">{JSON.stringify(fieldState)?.split(",")?.join(", ")}</div>
            )}
        </DebugWrapper>
    );
};

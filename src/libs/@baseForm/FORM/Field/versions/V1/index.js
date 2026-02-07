import { Icon } from "../../../../Icon";
import { Skeleton } from "../../../../Skeleton";
import { Container, DebugWrapper } from "./_styled";
import { PopoverMenu } from "../../../../PopoverMenu";

export const V1 = ({
    children,
    fieldState,
    conditionalStyledProps,
    isReadyOnAllConditionsMet,
    errors,
    onOpenChange,
    helperActions,
    onHelperClick,
    label,
    debugMode,
    name,
    hideActions,
    nonHeaderField,
}) => {
    /* Return */
    return (
        <DebugWrapper
            aria-label="DebugWrapper"
            className={nonHeaderField ? "nonHeaderField" : ""}
            $nonHeaderField={nonHeaderField}
        >
            <Container aria-label="FormField" {...conditionalStyledProps}>
                <Skeleton
                    show={!isReadyOnAllConditionsMet}
                    useForm
                    aria-label={name + "skeletonV1"}
                />
                <div id="required" />
                <div id="label" onClick={onHelperClick}>
                    {label}
                </div>
                <div id="content" onClick={onHelperClick}>
                    {children}
                </div>
                {!hideActions && (
                    <div id="actionsArea">
                        <PopoverMenu items={helperActions} onOpenChange={onOpenChange} />
                    </div>
                )}
                <div id="errorText">
                    {errors?.length > 0 &&
                        `Field ${errors?.[0]}${errors?.length > 1 ? ` (${errors.length - 1} more ${errors.length === 2 ? "error" : "errors"})` : ""}`}
                </div>
            </Container>
            {debugMode && (
                <div id="debugArea">{JSON.stringify(fieldState)?.split(",")?.join(", ")}</div>
            )}
        </DebugWrapper>
    );
};

import { createPortal } from "react-dom";
import S from "./_styled";
import { useVars } from "./useVars";
import { Box } from "./Box";
import { ScrollFlex } from "../../ScrollFlex";
import { Flex } from "../../Flex";

export const Base = () => {
    const { displayQueue, onExitComplete, theme, BoxComponent, openingMs } = useVars();

    if (typeof document === "undefined") return null;

    return createPortal(
        <S.container aria-label="NotifierListener container">
            <ScrollFlex.plain
                width="100%"
                height="100%"
                autoWidth={false}
                scrollBarProps={{
                    disableX: true,
                    fillMode: true,
                    edgeMargin: 0,
                    trackMargin: 0,
                }}
            >
                <Flex.column
                    gap={10}
                    full
                    width="100%"
                    xAlign="stretch"
                    paddingBottom={10}
                    paddingLeft={6}
                    paddingRight={6}
                >
                    {displayQueue.map((item) => (
                        <Box
                            key={item.queueId}
                            item={item}
                            BoxComponent={BoxComponent}
                            theme={theme}
                            openingMs={openingMs}
                            onExitComplete={onExitComplete}
                        />
                    ))}
                </Flex.column>
            </ScrollFlex.plain>
        </S.container>,
        document.body,
    );
};

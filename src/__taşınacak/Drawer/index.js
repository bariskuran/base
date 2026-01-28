import { Drawer as AntDrawer } from "antd";
import { baseStore } from "../baseStore";
import { useBase } from "../useBase";
import { V1 } from "./versions/V1";
import { Icon } from "../Icon";

const versions = {
    default: V1,
    //
    V1,
};

export const Drawer = ({
    onClose: externalOnClose,
    onOpen: externalOnOpen,
    isOpen,
    title,
    pageTitle,
    size = "m", // s m l
    footer,
    children,
    destroyOnClose = true,
    ver,
    ...props
}) => {
    const [isDrawerEnabled, set, winW, isMobile] = useBase((s) => [
        s.isDrawerEnabled,
        s.set,
        s.winW,
        s.isMobile,
    ]);
    const Version = versions?.[ver] || versions.default;

    const afterOpenChange = (boo) => {
        if (!boo) return;
        externalOnOpen && externalOnOpen?.(baseStore);
    };

    const onClose = () => {
        set({ isDrawerEnabled: false });
        externalOnClose?.(baseStore);
    };

    return (
        <Version.drawerContainer size={size}>
            <AntDrawer
                onClose={onClose}
                open={isOpen && isDrawerEnabled}
                afterOpenChange={afterOpenChange}
                destroyOnClose={destroyOnClose}
                footer={footer && <Version.drawerFooter>{footer}</Version.drawerFooter>}
                title={
                    <Version.titleArea onClick={onClose}>
                        <Icon
                            icon="fullArrowLeft"
                            width={18}
                            color="#fff"
                            style={{ marginRight: 10 }}
                        />
                        <Version.textArea>
                            <div>{title}</div>
                            <div>{pageTitle}</div>
                        </Version.textArea>
                    </Version.titleArea>
                }
                width={
                    isMobile
                        ? 320
                        : winW < 961
                          ? winW
                          : size === "l"
                            ? "90%"
                            : size === "s"
                              ? "45%"
                              : "75%"
                }
                {...props}
            >
                <Version.drawerChildren>{children}</Version.drawerChildren>
            </AntDrawer>
        </Version.drawerContainer>
    );
};

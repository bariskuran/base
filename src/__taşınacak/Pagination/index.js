import { V1 } from "./version/V1";
import { Pagination as AntPagination } from "antd";
import { Icon } from "../Icon";

const versions = { V1 };

export const Pagination = (p = {}) => {
    const {
        ver = "V1",
        simple = true,
        showSizeChanger = false,
        size = "small",
        hideOnSinglePage = true,
        enableTop = true,
        // topIconVersion
        total,
        // enableTotalText,
        // lastFetchedAt,
        ...rest
    } = p;
    const Component = versions?.[ver] || versions.V1;

    /* */
    return (
        <Component>
            <TotalText {...p} />
            <div id="pagination-area">
                <AntPagination
                    simple={simple}
                    showSizeChanger={showSizeChanger}
                    size={size}
                    total={total}
                    hideOnSinglePage={hideOnSinglePage}
                    {...rest}
                />
            </div>
            {enableTop && <TopIcon {...p} />}
        </Component>
    );
};

const TotalText = ({ dataSize, enableTotalText, total, lastFetchedAt }) =>
    enableTotalText && (
        <div id="total-text">
            <div>
                Showing {dataSize} items of <b>&nbsp;{total}</b>
            </div>
            {lastFetchedAt && (
                <div style={{ display: "block" }}>
                    Last fetched at:
                    <b>{lastFetchedAt}</b>
                </div>
            )}
        </div>
    );

const TopIcon = () => {
    /* Return */
    return (
        <div
            id="top-area"
            onClick={() => {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }}
        >
            <Icon icon="fullArrowUp" width={18} />
        </div>
    );
};

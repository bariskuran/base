import S, { FORM } from "../../DesignSystem/navigationStyles";
import { useDC, useDS } from "../../";

const testStoreColumnsOrder = FORM.createFormStore();

export const Ds = () => {
    const [isReadyOnAllConditionsMet, columnsState] = useDC(testStoreColumnsOrder, (s) => [
        s.isReadyOnAllConditionsMet,
        s.columnsState,
    ]);

    const ds = useDS({ debugMode: true, useSearchParams: false, useCache: false });

    const jointTP = {
        disabled: ds.disabled,
        hidden: ds.hidden,
        disableHelper: ds.disableHelper,
        debugMode: ds.debugMode,
        hideClear: ds.hideClear,
        labelIcon: ds.labelIcon && "check",
        tooltip:
            ds.tooltip &&
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        confirmation: ds.confirmation && "Confirmation Test",
        rules: ds.rules && [FORM.RULES.hasToBeFilled, FORM.RULES.hasToBeAValidPasswordBasic],
        descriptionText: ds.description && (
            <>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. <br />
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. <br />
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
            </>
        ),
    };

    return (
        <>
            <S.container>
                <S.title>ColumnOrder </S.title>
            </S.container>

            <FORM.manager
                settings={{
                    formName: "testFormColumnsOrder", // mandatory if useCache is true
                    storeFile: testStoreColumnsOrder,
                    version: "V1", // this should be FORM.field + fields version. Buttons and buttonArea should have their own version. CHECK this
                    //
                    useSearchParams: ds.useSearchParams,
                    useLS: ds.useCache,
                    cacheExporter: null, // (values) => values
                    cacheImporter: null, // (values) => values
                    debounceTime: 1000,
                    //
                    needManualApprovalForIsReady: false,
                    //
                    onChange: (a) => console.log("change", a),
                    // onBlur: (a) => console.log("blur", a),
                    // onFocus: (a) => console.log("focus", a),
                    onSubmit: (a) => console.log("submit", a),
                    onReset: (a) => console.log("reset", a),
                    onCancel: (a) => console.log("cancel", a),
                    //
                    flexDirection: "column",
                    flexGap: 20,
                    flexJustify: "center",
                    flexAlign: "center",
                }}
            >
                <FORM.columnOrder
                    // form={["Columns", "columnsState"]}
                    columns={columnsState}
                    isLast
                    isReadyOnAllConditionsMet={isReadyOnAllConditionsMet}
                    {...jointTP}
                />
            </FORM.manager>
        </>
    );
};

import { useRef, useMemo, useEffect } from "react";
import { V1 } from "./versions/V1";
import { FORM } from "../../FORM";
import { useBase } from "../../useBase";
import { useDS } from "../../useDashStore";
import { useEffectAfterMount } from "../../useEffectAfterMount";
import { S } from "./_styled";
import { fn } from "./_functions";
import { DatePicker as DatePickerOrj } from "antd";
import { Select } from "antd";
const { RangePicker } = DatePickerOrj;

const versions = { V1 };

export const FieldDateRange = ({ form, ...rest }) => (
    <FORM.field form={[Date, "dateRange", form?.[0], form?.[1]]} {...rest} />
);

export const FieldDateRangeTime = ({ form, ...rest }) => (
    <FORM.field form={[Date, "dateRange", form?.[0], form?.[1]]} enableTime {...rest} />
);

export const Date = (props = {}) => {
    const { fieldVersion, value, inputProps, fieldRef, focusManually, onChange, onFocus } = props;
    const { onBlur, onClick, changeDefaultValue: changeDef, name } = props;
    const { enableTime, ...otherInputProps } = inputProps || {};
    const { isOpen, set } = useDS({ isOpen: false });

    /* Prepare date presets */
    const [date, dateFormat, presets, todayEnd] = useBase(fn.baseFn);
    const getDateFormat = enableTime ? dateFormat + " HH:NN" : dateFormat; // this uses internal getDate Formats
    const presetsMemo = useMemo(() => presets(date, getDateFormat), [presets]);

    const [sDate, sHH1, sHH2] = useMemo(() => fn.split(value), [value]);
    const innerRef = useRef(null);
    const activeRef = fieldRef || innerRef;

    /* Handlers and Effects */
    const onOpenChange = (isOpen) => fn.handleOpen(isOpen, set);

    /* Exporters Importers */
    const convertedValue = useMemo(() => fn.valueImporter(value, presetsMemo), [value]);
    const valueExporter = (...args) =>
        fn.valueExporter(args, presetsMemo, sHH1, sHH2, onChange, name);
    const valueExporterTime = (t1, t2) =>
        fn.valueExporterTime(t1, t2, sDate, onChange, value, set, name);
    const fillEmpty = () => fn.fillEmtpty(value, activeRef, valueExporter, presetsMemo, changeDef);

    /* Effects */
    useEffectAfterMount(() => fn.focusManually(focusManually, set, isOpen), [focusManually]);
    useEffect(fillEmpty, []); /* Blur input on close - antHack */

    /* Return */
    const Version = versions?.[fieldVersion] || versions.default;
    return (
        <Version>
            {typeof value === "string" && isOpen === false ? (
                <div id="stringArea" onClick={() => set({ isOpen: true })}>
                    {value}
                </div>
            ) : (
                <RangePicker
                    {...otherInputProps}
                    // open={true}
                    open={isOpen}
                    onOpenChange={onOpenChange}
                    ref={activeRef}
                    disabledDate={(current) => current?.valueOf?.() > todayEnd?.ts}
                    presets={presetsMemo}
                    value={convertedValue}
                    onChange={valueExporter}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    allowClear={false}
                    onClick={onClick}
                    format={enableTime ? dateFormat + " HH:mm" : dateFormat} // this uses dayjs formats
                    {...(enableTime && {
                        renderExtraFooter: () => (
                            <S.container>
                                <S.label>Start Time:</S.label>
                                <Select
                                    value={sHH1}
                                    onChange={valueExporterTime}
                                    options={fn.h.map((i) => ({
                                        label: `${i}:00`,
                                        value: `${i}:00`,
                                    }))}
                                    style={{ width: "100%", minWidth: "100rem" }}
                                />
                                <S.label>End Time:</S.label>
                                <Select
                                    value={sHH2}
                                    onChange={(val) => valueExporterTime(null, val)}
                                    options={fn.h.map((i) => ({
                                        label: `${i}:59`,
                                        value: `${i}:59`,
                                    }))}
                                    style={{ width: "100%", minWidth: "50rem" }}
                                />
                            </S.container>
                        ),
                    })}
                />
            )}
        </Version>
    );
};

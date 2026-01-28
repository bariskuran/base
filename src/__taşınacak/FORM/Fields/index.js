import InputField, { Input } from "./Input";
import SearchField from "./Search";
import ButtonField, { Button } from "./Button";

import ButtonAreaField, { ButtonArea } from "./ButtonArea";
import ButtonCancelField from "./ButtonCancel";
import ButtonResetToDefaultsField from "./ButtonResetToDefaults";
import ButtonResetToLastSubmittedField from "./ButtonResetToLastSubmitted";
import ButtonSubmitField from "./ButtonSubmit";
import SelectField, { Select } from "./Select";
import SelectMultipleField from "./Select/SelectMultiple";
import BooleanField, { Boolean } from "./Boolean";
import SwitchField, { Switch } from "./Switch";
import NumberField, { Number } from "./Number";
import Pagination from "./Pagination";
import ColumnOrder from "./ColumnOrder";
import FooterField, { Footer } from "./Footer";
import RadioField, { Radio } from "./Radio";

export const Fields = {
    // Input based
    Input,
    input: InputField,
    search: SearchField,

    // Button based
    Button,
    button: ButtonField,
    buttonArea: ButtonAreaField,
    ButtonArea: ButtonArea,
    buttonCancel: ButtonCancelField,
    buttonResetToDefaults: ButtonResetToDefaultsField,
    buttonResetToLastSubmitted: ButtonResetToLastSubmittedField,
    buttonSubmit: ButtonSubmitField,

    // Select based
    Select,
    selectMultiple: SelectMultipleField,
    select: SelectField,
    Boolean,
    boolean: BooleanField,

    // switch based
    Switch,
    switch: SwitchField,

    // number based
    Number,
    number: NumberField,

    // radio based
    Radio,
    radio: RadioField,

    // others
    pagination: Pagination,
    columnOrder: ColumnOrder,
    Footer,
    footer: FooterField,

    // checkbox: FieldCheckbox,
    // color: FieldColor,
    // rate: FieldRate,
    // slider: FieldSlider,
    // dateTime: FieldDateRangeTime,
    // date: FieldDateRange,
    // uploadFile: FieldUploadFile,
    // uploadImage: FieldUploadImage,
    // weightSlider: FieldWeightSlider,
};

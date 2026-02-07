import S, { Syntax } from "../DesignSystem/navigationStyles";

const syn1 = `
// Usage
import {RULES} from "dash";

    <FORM.field
        rules={[FORM.RULES.hasToBeFilled, FORM.RULES.hasToBeAValidPasswordBasic]}
        //...
    />
`;
const syn2 = `
// Defining A New Rule

newRule: (props = {})=>{
    const {value, fields, field, helpers, storeFile,} = props;

    return [isValid, errorMsg, { 
        setRequired: false, // this changes the field's required state
        setHidden: false, // this changes the field's hidden state
    }];
},
`;

export const Ds = () => {
    return (
        <S.container>
            <S.title>{title}</S.title>
            <S.description>{desc1}</S.description>
            <Syntax>{syn1}</Syntax>
            <Syntax>{syn2}</Syntax>
            <S.description>
                <p>
                    <span>
                        <S.h>hasToBeFilled</S.h> Validates that the given input is not empty. It
                        supports validation for strings, arrays, objects, and numbers. Strings and
                        arrays are checked for a minimum length of 1, objects are checked for at
                        least one key, and numbers are always considered valid unless they are not
                        provided.
                    </span>
                </p>
            </S.description>
            <Syntax>
                {`
                    const result = VAL_RULES.hasToBeFilled({ value: "" });
console.log(result);  // Output: [false, "has to be filled."]`}
            </Syntax>
            <S.description>
                <p>
                    <span>
                        <S.h>hasToBeAValidPasswordBasic</S.h> Checks if the password has at least 8
                        characters. This is a basic strength validation for passwords.
                    </span>
                </p>
            </S.description>
            <Syntax>
                {`const result = VAL_RULES.hasToBeAValidPasswordBasic({ value: "12345" });
console.log(result);  // Output: [false, "has to be min 8 characters."]`}
            </Syntax>
            <S.description>
                <p>
                    <span>
                        <S.h>hasToBeAValidPasswordAdvanced</S.h> Ensures that the password meets a
                        higher security standard, including at least 12 characters with at least one
                        uppercase letter, one number, and one symbol.
                    </span>
                </p>
            </S.description>
            <Syntax>
                {`const result = VAL_RULES.hasToBeAValidPasswordAdvanced({ value: "Example@123" });
console.log(result);  // Output: [false, "has to be min 12 characters includes min 1 uppercase, 1 symbol, 1 number."]`}
            </Syntax>
            <S.description>
                <p>
                    <span>
                        <S.h>hasToBeAValidPhoneNumber</S.h> Validates that the input is a valid
                        phone number format, accommodating various formats with or without country
                        codes, parentheses, and hyphens.
                    </span>
                </p>
            </S.description>
            <Syntax>
                {`
                const result = VAL_RULES.hasToBeAValidPhoneNumber({ value: "+123-456-7890" });
                console.log(result);  // Output: [true, "has to be a valid phone number."]
                `}
            </Syntax>
            <S.description>
                <p>
                    <span>
                        <S.h>hasToBeAValidEmail</S.h> Checks if the provided email address is in a
                        valid format using a regular expression that matches most common email
                        patterns.
                    </span>
                </p>
            </S.description>
            <Syntax>
                {`const result = VAL_RULES.hasToBeAValidEmail({ value: "test@example.com" });
console.log(result);  // Output: [true, "has to be a valid e-mail"]`}
            </Syntax>
            <S.description>
                <p>
                    <span>
                        <S.h>hasToBeAValidUrl</S.h> Validates URLs to ensure they are in a proper
                        format, starting with "https://" and following a standard URL format. It
                        uses a regular expression to check the validity.
                    </span>
                </p>
            </S.description>
            <Syntax>
                {`const result = VAL_RULES.hasToBeAValidUrl({ value: "https://www.example.com" });
console.log(result);  // Output: [true, "has to be a valid url."]`}
            </Syntax>
            <S.description>
                <p>
                    <span>
                        <S.h>hasToBeAValidPostback</S.h> Specifically validates postback URLs,
                        ensuring they start with "https://" and follow a valid URL format according
                        to a regular expression.
                    </span>
                </p>
            </S.description>
            <Syntax>
                {`const result = VAL_RULES.hasToBeAValidPostback({ value: "https://www.example.com/postback" });
console.log(result);  // Output: [true, "has to be a valid postback url which includes https://"]`}
            </Syntax>
        </S.container>
    );
};
const title = "RULES or FORM.RULES";
const desc1 = (
    <p>
        <span>
            RULES are used in <S.h>FORM.field</S.h> to check the input data. <S.h>FORM.manager</S.h>
            uses them to check fields validation. It gets formStore's existing values. RULEs are
            specially written functions and new rules may need to be written when necessary. Below
            you can find the rules to be followed for new forms to be written.
        </span>
        <span>
            <S.h>Remember</S.h>, all new rules must take a specified object and return a specified
            object.
        </span>
    </p>
);

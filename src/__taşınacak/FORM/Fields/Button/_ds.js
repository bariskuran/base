import S, { Syntax, FORM } from "../../DesignSystem/navigationStyles";

const title = "<Button>";
const desc1 = (
    <p>
        <span>
            FORM.button covers all <S.h>&lt;a&gt;</S.h> - <S.h>&lt;Link&gt;</S.h> or{" "}
            <S.h>&lt;button&gt;</S.h> or even <S.h>icon buttons</S.h>. Depending on href and onClick
            props, FORM.button will render either a button or a link or a. If href starts with http
            it will be an &lt;a&gt;. Else it will be a &lt;Link&gt;. If !href it will be a button.
            If you leave label empty, then it is a icon button.
        </span>
        <span>
            In addition, although other input fields generally use the same versions, different
            design versions can be used for the button.
        </span>
        <span>
            If button used inside Form.field, features such as tooltip, confirmation can be used.
        </span>
    </p>
);
const syn1 = `
// If you want to use tooltip, confirmation etc use FORM version.
    import { FORM } from "dash";
    <FORM.button form = {[label, ver]} // ... other props

    import { Button } from "dash";
    <Button ver, fieldRef, inputProps = {{ label, onClick, primary:true }} /> // Put field props inside inputProps.

// JOINT PROPS  
    onClick,
    href,
    preIcon,
    sufIcon,
    iconSize = 14, // default is 14
    disableIconAnimation,
    isLoading,
    primary,
    secondary,
    error,
    success,
    hoverManually,
    disableAfterClick = 2000, // default is 2000
/>
`;

export const Ds = () => {
    return (
        <S.container>
            <S.title>{title}</S.title>
            <S.description>{desc1}</S.description>
            <Syntax>{syn1}</Syntax>
            <S.description>
                <p>
                    <span>
                        <S.h>Button</S.h> is a component designed to handle various visual states
                        and behaviors based on props. It allows the application of different button
                        versions (V1, V2, V3) and customizes appearance and functionality based on
                        the provided props and global state (e.g., whether the application is in a
                        mobile view).
                    </span>
                </p>
            </S.description>
            <S.description>
                Key Features
                <ul>
                    <li>
                        Versioning Support: Choose between multiple button styles (V1, V2, V3) via
                        the ver prop.
                    </li>
                    <li>
                        Responsive Design: Automatically adjusts styles if the application is in a
                        mobile view.
                    </li>
                    <li>
                        Customizable: Supports primary, secondary, error, and success states. It
                        also handles icons, loading states, and tooltip configurations.
                    </li>
                    <li>
                        State Management: Integrates with global state for consistent behavior
                        across the application.
                    </li>
                </ul>
            </S.description>
            <S.description>
                Props
                <ul>
                    <li>
                        ver: Specifies the version of the button to use. Defaults to 'default',
                        which maps to V1.
                    </li>
                    <li>
                        primary, secondary, error, success: Boolean props to specify the button's
                        theme.
                    </li>
                    <li>isLoading: Indicates if the button is in a loading state.</li>
                    <li>preIcon, sufIcon: Icons to display before or after the label.</li>
                    <li>disableIconAnimation: Disables the icon animation if true.</li>
                    <li>tooltip, tooltipPlacement: Configures a tooltip for the button.</li>
                    <li>confirmation: Optional confirmation dialog before the action.</li>
                    <li>hoverManually: Manually triggers hover state styles.</li>
                </ul>
            </S.description>
            <Syntax>
                {`
            <FORM.buttonArea justify="flex-start">
            <FORM.button
                ver="V1"
                primary
                label="Click Me"
                onClick={() => { }}
                tooltip="This is a button V1"
                tooltipPlacement="topRight"
                preIcon="plusIcon"
                sufIcon="arrowRight"
            />
            <FORM.button
                ver="V2"
                primary
                label="Click Me"
                onClick={() => { }}
                tooltip="This is a button V2 without icon"
                tooltipPlacement="topRight"
            />
             <FORM.button
                ver="V3"
                primary
                label="Click Me"
                onClick={() => { }}
                tooltip="This is a button V3"
                tooltipPlacement="topRight"
                preIcon="plusIcon"
                sufIcon="arrowRight"
            />
            </FORM.buttonArea>
                `}
            </Syntax>
            <FORM.buttonArea justify="flex-start">
                <FORM.button
                    ver="V1"
                    primary
                    label="Click Me"
                    onClick={() => {}}
                    tooltip="This is a button V1"
                    tooltipPlacement="topRight"
                    preIcon="plusIcon"
                    sufIcon="arrowRight"
                />
                <FORM.button
                    ver="V2"
                    primary
                    label="Click Me"
                    onClick={() => {}}
                    tooltip="This is a button V2 without icon"
                    tooltipPlacement="topRight"
                />
                <FORM.button
                    ver="V3"
                    primary
                    label="Click Me"
                    onClick={() => {}}
                    tooltip="This is a button V3"
                    tooltipPlacement="topRight"
                    preIcon="plusIcon"
                    sufIcon="arrowRight"
                />
            </FORM.buttonArea>
        </S.container>
    );
};

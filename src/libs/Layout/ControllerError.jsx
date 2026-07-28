import styled from "styled-components";
import { Icon } from "../Icon";

const Root = styled.div`
    width: 100%;
    min-height: 70rem;
    box-sizing: border-box;
    padding: 20rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rem;
    color: ${({ theme }) => theme.error || theme.foreground};
    background: ${({ theme }) => theme.colorAlpha(theme.background, 90)};
    border: 1px solid currentColor;
    font-size: 14rem;
    line-height: 1.4;
`;

export const ControllerError = ({ controllerName, controllerId }) => (
    <Root role="alert" data-layout-controller-error={`${controllerName}:${controllerId}`}>
        <Icon icon="warning" width={20} color="inherit" flat />
        <span>
            Multiple same controllerId usage. Check your code or contact with a developer. (
            {controllerName}:{controllerId})
        </span>
    </Root>
);

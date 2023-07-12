import { styled } from "styled-components";

export const StyledButton = styled.button`
    border-radius: 4px;
    border-style: solid;
    /* border-width: 1px; */
    width: ${(props) => (props.wide ? "100%" : "fit-content")};

    padding: 8px 8px;
    transition: 0.2s;

    border-color: ${(props) =>
        props.primary ? props.theme.specialBg : props.theme.border};
    background-color: ${(props) => {
        if (props.disabled) {
            return props.theme.backgroundRaised;
        }
        if (props.primary) {
            return props.theme.specialBg;
        }
        return props.theme.background;
    }};
    color: ${(props) => {
        if (props.disabled) {
            return props.theme.border;
        }
        if (props.primary) {
            return props.theme.light;
        }
        return props.theme.text;
    }};

    &:hover {
        background-color: ${(props) => {
            if (props.disabled) {
                return props.theme.backgroundRaised;
            }
            if (props.primary) {
                return props.theme.specialBgRaised;
            } else {
                return props.theme.borderSoft;
            }
        }};
        color: ${(props) => {
            if (props.disabled) {
                return props.theme.border;
            }
            if (props.primary) {
                return props.theme.light;
            } else {
                return props.theme.textStrong;
            }
        }};
    }

    &::selection {
        border-color: ${(props) => props.theme.outline};
    }
`;

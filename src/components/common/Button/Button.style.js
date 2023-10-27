import { styled } from "styled-components";

export const StyledButton = styled.button`
    border-radius: ${(props) => (props.round ? "100%" : "4px")};

    border-style: solid;
    border-width: ${(props) => (props.outline ? "1px" : "0px")};
    border-color: ${(props) => props.theme.outline};
    width: ${(props) => (props.wide ? "100%" : "fit-content")};
    min-width: 36px;

    padding: 8px 8px;
    transition: 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1em;

    user-select: none;

    border-color: ${(props) =>
        props.primary ? props.theme.specialBg : props.theme.border};
    background-color: ${(props) => {
        if (props.disabled) {
            return props.theme.backgroundRaised;
        }
        if (props.primary) {
            return props.theme.specialBg;
        }
        if (props.secondary) {
            return props.theme.backgroundRaised;
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

export const LoaderSpinner = styled.div`
    border: 10px solid ${(props) => props.theme.backgroundRaised};
    border-top: 10px solid ${(props) => props.theme.special};
    border-radius: 50%;
    width: 0.9em;
    height: 0.9em;
    margin: auto;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

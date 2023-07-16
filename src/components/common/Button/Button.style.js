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

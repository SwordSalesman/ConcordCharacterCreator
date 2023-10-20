import { TextareaAutosize } from "@mui/material";
import { styled } from "styled-components";

export const TextInputWrapper = styled.div`
    width: 100%;
    margin: 6px 0;
`;

export const TextInputTitle = styled.div``;

export const StyledTextField = styled(TextareaAutosize)`
    background-color: ${(props) => props.theme.backgroundRaised};
    resize: none;
    width: 95%;
    padding: 5px 5px;
    color: ${(props) => props.theme.text};

    border-radius: 5px;

    transition: 0.2s;

    line-height: 1.2rem;
    letter-spacing: -0.2px;

    border: ${(props) =>
        props.invalid ? `2px solid ${props.theme.error}` : "default"};
`;

export const StyledInputField = styled.input`
    background-color: ${(props) => props.theme.backgroundRaised};
    resize: none;
    width: 95%;
    color: ${(props) => props.theme.text};

    padding: 5px 5px;

    border-radius: 5px;

    transition: 0.2s;

    line-height: 1.2rem;
    letter-spacing: -0.2px;

    border: ${(props) =>
        props.invalid ? `2px solid ${props.theme.error}` : "default"};
`;

export const FieldWarning = styled.p`
    color: ${(props) => props.theme.error};
    font-style: italic;
    font-size: 0.8em;
`;

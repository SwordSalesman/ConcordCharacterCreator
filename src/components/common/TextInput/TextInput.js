import classNames from "classnames";
import {
    StyledInputField,
    StyledPasswordField,
    StyledTextField,
    TextInputTitle,
    TextInputWrapper,
} from "./TextInput.style";
import { TextField } from "@mui/material";
import { useTheme } from "styled-components";

function TextInput({
    value,
    onChange,
    title,
    placeholder,
    maxRows,
    trim,
    password,
    email,
    ...rest
}) {
    const theme = useTheme();

    const handleChange = (event) => {
        const value = trim ? event.target.value.trim() : event.target.value;
        onChange(value);
    };

    return (
        <TextInputWrapper>
            <TextInputTitle>{title}</TextInputTitle>
            {password || email ? (
                <StyledInputField
                    value={value || ""}
                    onChange={handleChange}
                    placeholder={placeholder}
                    variant='outlined'
                    spellcheck='false'
                    maxLength='1000'
                    maxRows={maxRows}
                    type={password ? "password" : "text"}
                    {...rest}
                />
            ) : (
                <StyledTextField
                    value={value || ""}
                    onChange={handleChange}
                    placeholder={placeholder}
                    variant='outlined'
                    spellcheck='false'
                    maxLength='1000'
                    maxRows={maxRows}
                    {...rest}
                />
            )}
        </TextInputWrapper>
    );
}

export default TextInput;

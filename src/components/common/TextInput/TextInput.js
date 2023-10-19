import {
    StyledInputField,
    StyledTextField,
    TextInputTitle,
    TextInputWrapper,
} from "./TextInput.style";

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
                    minRows={2}
                    maxRows={maxRows}
                    {...rest}
                />
            )}
        </TextInputWrapper>
    );
}

export default TextInput;

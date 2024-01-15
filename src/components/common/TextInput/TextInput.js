import {
	FieldWarning,
	StyledInputField,
	StyledTextField,
	TextInputTitle,
	TextInputWrapper,
} from "./TextInput.style";
import React from "react";

function TextInput({
	value,
	onChange,
	title,
	placeholder,
	maxRows,
	trim,
	password,
	fixed,
	invalid,
	invalidText,
	...rest
}) {
	const handleChange = (event) => {
		const value = trim ? event.target.value.trim() : event.target.value;
		onChange(value);
	};

	return (
		<TextInputWrapper>
			<TextInputTitle>{title}</TextInputTitle>
			{password || fixed ? (
				<StyledInputField
					value={value || ""}
					onChange={handleChange}
					placeholder={placeholder}
					variant='outlined'
					spellcheck='false'
					maxLength='3000'
					maxRows={maxRows}
					type={password ? "password" : "text"}
					invalid={invalid}
					autoComplete={password ? "current-password" : ""}
					{...rest}
				/>
			) : (
				<StyledTextField
					value={value || ""}
					onChange={handleChange}
					placeholder={placeholder}
					variant='outlined'
					spellcheck='false'
					maxLength='3000'
					minRows={3}
					maxRows={maxRows}
					invalid={invalid}
					{...rest}
				/>
			)}
			{invalid ? <FieldWarning>{invalidText}</FieldWarning> : null}
		</TextInputWrapper>
	);
}

export default TextInput;

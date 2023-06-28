import classNames from "classnames";
import {
  StyledTextField,
  TextInputTitle,
  TextInputWrapper,
} from "./TextInput.style";
import { TextField } from "@mui/material";
import { useTheme } from "styled-components";

function TextInput({ value, onChange, title, placeholder, ...rest }) {
  const theme = useTheme();

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <TextInputWrapper>
      <TextInputTitle>{title}</TextInputTitle>
      <StyledTextField
        value={value || ""}
        onChange={handleChange}
        placeholder={placeholder}
        variant="outlined"
        spellcheck="false"
        maxLength="1000"
      />
    </TextInputWrapper>
  );
}

export default TextInput;

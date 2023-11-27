import { LoaderSpinner, StyledButton } from "./Button.style";
import React from "react";

function Button({
    onClick,
    primary,
    secondary,
    outline,
    disabled,
    wide,
    round,
    small,
    loading,
    children,
    ...rest
}) {
    return (
        <StyledButton
            onClick={onClick}
            primary={primary}
            secondary={secondary}
            outline={outline}
            wide={wide}
            round={round}
            small={small}
            disabled={disabled || loading}
            {...rest}
        >
            {loading ? <LoaderSpinner /> : children}
        </StyledButton>
    );
}

export default Button;

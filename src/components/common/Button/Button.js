import { LoaderSpinner, StyledButton } from "./Button.style";

function Button({
    onClick,
    primary,
    secondary,
    outline,
    disabled,
    wide,
    round,
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
            disabled={disabled || loading}
            {...rest}
        >
            {loading ? <LoaderSpinner /> : children}
        </StyledButton>
    );
}

export default Button;

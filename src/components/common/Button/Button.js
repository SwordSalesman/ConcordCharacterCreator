import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { LoaderSpinner, StyledButton } from "./Button.style";

function Button({
    onClick,
    icon,
    primary,
    secondary,
    disabled,
    wide,
    loading,
    children,
    ...rest
}) {
    var renderedIcon = null;
    if (icon === "plus") {
        renderedIcon = <AiOutlinePlus />;
    }
    if (icon === "minus") {
        renderedIcon = <AiOutlineMinus />;
    }

    return (
        <StyledButton
            onClick={onClick}
            primary={primary}
            secondary={secondary}
            wide={wide}
            disabled={disabled || loading}
            {...rest}
        >
            {loading ? (
                <LoaderSpinner />
            ) : (
                <>
                    {renderedIcon}
                    {children}
                </>
            )}
        </StyledButton>
    );
}

export default Button;

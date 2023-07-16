import classNames from "classnames";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { LoaderSpinner, StyledButton } from "./Button.style";
import { CircularProgress } from "@mui/material";

function Button({
    onClick,
    icon,
    active,
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
            primary={active}
            wide={wide}
            loading={loading}
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

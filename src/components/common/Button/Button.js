import classNames from "classnames";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { StyledButton } from "./Button.style";

function Button({ onClick, icon, active, disabled, wide, children, ...rest }) {
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
            disabled={disabled}
            wide={wide}
            {...rest}
        >
            {renderedIcon}
            {children}
        </StyledButton>
    );
}

export default Button;

import classNames from "classnames";
import { StyledChip } from "./Chip.styled";

function Chip({ children, onClick, selected, shadow, inactive, ...rest }) {
  const handleClick = () => {
    if (!inactive) {
      onClick();
    }
  };

  return (
    <StyledChip
      selected={selected}
      shadow={shadow}
      disabled={inactive}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </StyledChip>
  );
}

export default Chip;

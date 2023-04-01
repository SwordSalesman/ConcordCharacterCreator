import classNames from "classnames";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

function Button({ onClick, icon, children, ...rest }) {
  var renderedIcon = null;
  if (icon === "plus") {
    renderedIcon = <AiOutlinePlus />;
  }
  if (icon === "minus") {
    renderedIcon = <AiOutlineMinus />;
  }

  const classes = classNames(
    "w-6 h-6 rounded-full text-white text-xl select-none",
    "bg-gray-400 hover:bg-gray-300 active:bg-gray-400 border border-gray-50 cursor-pointer drop-shadow",
    "transition-all",
    "m-1 p-[1px]",
    rest.className
  );

  return (
    <div className={classes} onClick={onClick}>
      {renderedIcon}
      {children}
    </div>
  );
}

export default Button;

import classNames from "classnames";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

function Button({ onClick, icon, active, disabled, children, ...rest }) {
  var renderedIcon = null;
  if (icon === "plus") {
    renderedIcon = <AiOutlinePlus />;
  }
  if (icon === "minus") {
    renderedIcon = <AiOutlineMinus />;
  }

  const classes = classNames(
    "w-fit rounded-lg select-none",
    "border cursor-pointer",
    "transition-all",
    "m-1 py-1 px-2",
    rest.className,
    {
      "bg-gray-100 border-gray-500 hover:bg-gray-300 active:bg-gray-400":
        !disabled,
      "bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white border-gray-500 hover:border-gray-600":
        active && !disabled,
      "bg-gray-200 text-gray-400 border-gray-400 cursor-auto": disabled,
      "w-6 h-6 rounded-full py-0.5 px-0.5": icon,
    }
  );

  return (
    <div className={classes} onClick={!disabled && onClick}>
      {renderedIcon}
      {children}
    </div>
  );
}

export default Button;

import classNames from "classnames";

function Chip({ children, onClick, selected, shadow, inactive, ...rest }) {
  const handleClick = () => {
    if (!inactive) {
      onClick();
    }
  };

  const classes = classNames(
    "px-[5px] m-1 h-6 w-fit",
    "border border-gray-300 rounded-lg",
    " flex flex-row",
    "bg-gray-50 hover:bg-gray-200",
    "cursor-pointer",
    "whitespace-nowrap",
    "transition-all",
    rest.className,
    {
      "bg-slate-500 hover:bg-slate-500 text-white cursor-default": selected,
      "drop-shadow bg-white": shadow,
      "bg-gray-200 text-gray-400 hover:bg-gray-200 cursor-default":
        inactive && !selected,
    }
  );

  return (
    <div className={classes} onClick={handleClick}>
      {children}
    </div>
  );
}

export default Chip;

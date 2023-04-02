import classNames from "classnames";

function Chip({ children, onClick, selected, shadow, inactive, ...rest }) {
  const handleClick = () => {
    if (!inactive) {
      onClick();
    }
  };

  const classes = classNames(
    "px-[5px] m-[2px] h-6 w-fit",
    "border border-gray-300 rounded-lg",
    "flex items-center",
    "cursor-pointer select-none",
    "whitespace-nowrap",
    "transition-all",
    rest.className,
    {
      "bg-gray-50 hover:bg-gray-200": !inactive,
      "drop-shadow bg-white": shadow,
      "bg-gray-100 text-gray-400 cursor-auto": inactive,
      "bg-slate-500 hover:bg-slate-400 text-white": selected,
    }
  );

  return (
    <div className={classes} onClick={handleClick}>
      {children}
    </div>
  );
}

export default Chip;

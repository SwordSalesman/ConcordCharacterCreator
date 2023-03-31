import classNames from "classnames";

function SectionDivider({ left, right, ...rest }) {
  const leftClasses = classNames(
    "flex justify-between mb-1",
    "bg-gradient-to-r from-transparent to-gray-300 mx-1",
    "text-gray-900 font-sans font-medium tracking-tigher uppercase leading-5",
    "transition-all",
    rest.className,
    {
      "via-[#a8a8a850] to-gray-500": right !== undefined,
    }
  );

  const rightClasses = classNames(
    "pr-1 ml-1",
    //"bg-gradient-to-r from-transparent to-gray-500",
    //"w-14 text-right pr-2",
    "text-white "
  );

  return (
    <div className={leftClasses}>
      <div className="">{left}</div>
      {right !== undefined && <div className={rightClasses}>{right}</div>}
    </div>
  );
}

export default SectionDivider;

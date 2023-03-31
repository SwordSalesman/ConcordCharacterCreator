import classNames from "classnames";

function SectionDivider({ text, number, ...rest }) {
  const mainClasses = classNames(
    "flex justify-between mb-1",
    //"bg-gradient-to-r from-gray-500 to-gray-400",
    "bg-gradient-to-r from-transparent to-gray-300 mx-1",
    //"border-b-2 border-gray-400 mx-2",
    "text-gray-900 font-sans font-medium tracking-wider leading-5",
    "transition-all",
    rest.className
  );

  const numberClasses = classNames(
    "pr-1 ml-1",
    //"bg-gradient-to-r from-gray-400 to-gray-400 text-white",
    "bg-gradient-to-r from-transparent to-gray-500",
    "w-14 text-right pr-2",
    "text-white "
  );

  return (
    <div className={mainClasses}>
      <div className="">{text}</div>
      {number !== undefined && <div className={numberClasses}>{number}</div>}
    </div>
  );
}

export default SectionDivider;

import { GiOpenBook } from "react-icons/gi";
import classNames from "classnames";

const root = "http://concordlarpaus.wikidot.com/";

function WikiLink({ path, ...rest }) {
  //const url = path ? root + path.join(":") : root;
  const url = path ? root + path : root;

  const handleClick = (e) => {
    e.stopPropagation();
  };

  const classes = classNames(
    "text-white opacity-50 bg-slate-500 hover:bg-slate-400",
    "rounded-lg w-[25px] h-[25px] text-xl",
    "cursor-help transition-all",
    "flex justify-center items-center",
    rest.className
  );

  return (
    <a href={url} onClick={handleClick} target="_blank" rel="noreferrer">
      <div title={url} className={classes}>
        <GiOpenBook />
      </div>
    </a>
  );
}

export default WikiLink;

import { GiOpenBook } from "react-icons/gi";
import classNames from "classnames";

const root = "http://concordlarpaus.wikidot.com/";

function WikiLink({ path, ...rest }) {
  const url = path ? root + path.join(":") : root;

  const classes = classNames(
    "text-white bg-gray-300 hover:bg-gray-400",
    "rounded-lg w-[25px] h-[25px] text-xl px-[3px] py-[2px]",
    "cursor-help",
    rest.className
  );

  return (
    <a href={url} target="_blank" rel="noreferrer">
      <div title={url} className={classes}>
        <GiOpenBook />
      </div>
    </a>
  );
}

export default WikiLink;

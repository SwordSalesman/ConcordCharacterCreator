import { GiOpenBook } from "react-icons/gi";
import classNames from "classnames";

const root = "http://concordlarpaus.wikidot.com/";

function WikiLink({ path, ...rest }) {
  const url = path ? root + path.join(":") : root;

  const classes = classNames(
    "text-white bg-red-300 hover:bg-red-400",
    "rounded-full w-[26px] h-[26px] text-xl p-[3.1px]",
    rest.className
  );

  return (
    <div title={url} className={classes}>
      <a href={url} target="_blank" rel="noreferrer">
        <GiOpenBook />
      </a>
    </div>
  );
}

export default WikiLink;

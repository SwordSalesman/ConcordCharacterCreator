import classNames from "classnames";
import { useState } from "react";
import { BiChevronDown, BiChevronLeft } from "react-icons/bi";
import WikiLink from "./WikiLink";

function Accordion({ items }) {
  const [expandedIndex, setExpandedIndex] = useState(-1);

  const handleLabelClick = (clickedIndex) => {
    if (expandedIndex === clickedIndex) {
      setExpandedIndex(-1);
    } else {
      setExpandedIndex(clickedIndex);
    }
  };

  // Render each of the Accordion items
  const renderedItems = items.map((item, index) => {
    const expanded = index === expandedIndex;

    const icon = (
      <div className="flex">
        <span className="text-2xl mr-1">
          {expanded ? <BiChevronDown /> : <BiChevronLeft />}
        </span>
        {item.link && <WikiLink path={item.link} />}
      </div>
    );

    const contentClasses = classNames(
      "m-1",
      "flex w-full flex-wrap overflow-auto overflow-x-hidden max-h-0",
      "transition-all duration-[500ms]",
      {
        "max-h-52": expanded,
      }
    );

    return (
      <li key={index} className="w-full">
        <div
          className="flex justify-between p-1 px-2 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-300 rounded items-center cursor-pointer"
          onClick={() => handleLabelClick(index)}
        >
          {item.label}
          {icon}
        </div>
        <div className={contentClasses}>{item.content}</div>
      </li>
    );
  });

  return <ul className="rounded w-full">{renderedItems}</ul>;
}

export default Accordion;

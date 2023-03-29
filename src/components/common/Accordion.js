import { useState } from "react";
import { BiChevronDown, BiChevronLeft } from "react-icons/bi";

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
      <span className="text-2xl">
        {expanded ? <BiChevronDown /> : <BiChevronLeft />}
      </span>
    );

    const contentClasses =
      "border-b p-1 flex w-full flex-wrap overflow-hidden max-h-0 transition-all duration-[400ms]" +
      (expanded ? " max-h-48 " : "");

    return (
      <li key={index}>
        <div
          className="flex justify-between p-2 px-3 bg-gray-100 border-b items-center cursor-pointer"
          onClick={() => handleLabelClick(index)}
        >
          {item.label}
          {icon}
        </div>
        {
          //<TransitionWrapper show={expanded} enter>
          <div className={contentClasses}>{item.content}</div>
          //</TransitionWrapper>
        }
      </li>
    );
  });

  return (
    <ul className="border-x border-t rounded w-[340px]">{renderedItems}</ul>
  );
}

export default Accordion;

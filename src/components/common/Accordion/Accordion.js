import classNames from "classnames";
import { useState } from "react";
import { BiChevronDown, BiChevronLeft, BiChevronUp } from "react-icons/bi";
import WikiLink from "../WikiLink/WikiLink";
import {
    AccordionContent,
    AccordionHeader,
    AccordionWrapper,
} from "./Accordion.style";

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
            <div className='flex'>
                <span className='text-2xl mr-1'>
                    {expanded ? <BiChevronDown /> : <BiChevronUp />}
                </span>
                {item.link && <WikiLink path={item.link} />}
            </div>
        );

        return (
            <>
                <AccordionHeader onClick={() => handleLabelClick(index)}>
                    {item.label}
                    {icon}
                </AccordionHeader>
                <AccordionContent expanded={expanded}>
                    {item.content}
                </AccordionContent>
            </>
        );
    });

    return <AccordionWrapper>{renderedItems}</AccordionWrapper>;
}

export default Accordion;

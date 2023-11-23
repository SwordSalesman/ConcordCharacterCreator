import React, { useState } from "react";
import { BiChevronUp } from "react-icons/bi";
import WikiLink from "../WikiLink/WikiLink";
import {
    AccordionArrow,
    AccordionContent,
    AccordionHeader,
    AccordionWrapper,
} from "./Accordion.style";

function Accordion({ items }) {
    const [expandedIndexes, setExpandedIndexes] = useState(
        new Array(items.length).fill(false)
    );

    const handleLabelClick = (clickedIndex) => {
        const newIndexes = expandedIndexes.map((expandedValue, index) => {
            if (index === clickedIndex) {
                return !expandedValue;
            }
            return expandedValue;
        });
        setExpandedIndexes(newIndexes);
    };

    // Render each of the Accordion items
    const renderedItems = items.map((item, index) => {
        const expanded = expandedIndexes[index];

        const icon = (
            <div style={{ display: "flex" }}>
                <AccordionArrow expanded={expanded}>
                    <BiChevronUp size={25} />
                </AccordionArrow>
                {item.link && <WikiLink path={item.link} />}
            </div>
        );

        return (
            <React.Fragment key={index + "wrapper"}>
                <AccordionHeader
                    onClick={() => handleLabelClick(index)}
                    key={index}
                >
                    {item.label}
                    {icon}
                </AccordionHeader>
                <AccordionContent expanded={expanded} key={index + "c"}>
                    {item.content}
                </AccordionContent>
            </React.Fragment>
        );
    });

    return <AccordionWrapper>{renderedItems}</AccordionWrapper>;
}

export default Accordion;

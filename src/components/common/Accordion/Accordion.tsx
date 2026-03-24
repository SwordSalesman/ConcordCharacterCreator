import React, { useState } from "react";
import { BiChevronUp } from "react-icons/bi";
import WikiLink from "../WikiLink/WikiLink";
import { cn } from "@/lib/utils";

interface AccordionItem {
	label: React.ReactNode;
	content: React.ReactNode;
	link?: string;
}

function Accordion({ items }: { items: AccordionItem[] }) {
	const [expandedIndexes, setExpandedIndexes] = useState(new Array(items.length).fill(false));

	const handleLabelClick = (clickedIndex: number) => {
		const newIndexes = expandedIndexes.map((expandedValue: boolean, index: number) => {
			if (index === clickedIndex) return !expandedValue;
			return expandedValue;
		});
		setExpandedIndexes(newIndexes);
	};

	const renderedItems = items.map((item, index) => {
		const expanded = expandedIndexes[index];

		const icon = (
			<div className="flex">
				<div
					className={cn(
						"mr-1.5 transition-transform duration-300",
						expanded ? "rotate-0" : "-rotate-180",
					)}
				>
					<BiChevronUp size={25} />
				</div>
				{item.link && <WikiLink path={item.link} />}
			</div>
		);

		return (
			<React.Fragment key={index + "wrapper"}>
				<button
					key={index}
					className="flex w-full justify-between items-center px-1.5 py-[3px] my-0.5 border border-border rounded-md transition-colors duration-200 bg-background-raised hover:cursor-pointer max-[600px]:px-[11px] max-[600px]:py-2"
					onClick={() => handleLabelClick(index)}
				>
					{item.label}
					{icon}
				</button>
				<div
					key={index + "c"}
					className={cn(
						"flex flex-wrap overflow-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] transition-all",
						expanded ? "h-fit mb-2.5" : "h-0 mb-0",
					)}
				>
					{item.content}
				</div>
			</React.Fragment>
		);
	});

	return (
		<div className="flex flex-col [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
			{renderedItems}
		</div>
	);
}

export default Accordion;

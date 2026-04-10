import React, { useState } from "react";
import { BiChevronUp } from "react-icons/bi";
import * as RadixAccordion from "@radix-ui/react-accordion";
import WikiLink from "../WikiLink/WikiLink";
import { cn } from "@/lib/utils";

interface AccordionItem {
	label: string;
	content: React.ReactNode;
	link?: string;
}

function Accordion({ items }: { items: AccordionItem[] }) {
	const [openItems, setOpenItems] = useState<string[]>([]);

	return (
		<RadixAccordion.Root
			type="multiple"
			value={openItems}
			onValueChange={setOpenItems}
			className="flex flex-col w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]"
		>
			{items.map((item, index) => {
				const value = String(index);
				const expanded = openItems.includes(value);

				return (
					<RadixAccordion.Item key={item.label} value={value}>
						<RadixAccordion.Trigger className="flex w-full justify-between items-center my-0.5 border border-border rounded-md transition-colors duration-200 bg-background-raised hover:cursor-pointer px-3 sm:px-1.5 py-2 sm:py-1">
							{item.label}
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
						</RadixAccordion.Trigger>
						<RadixAccordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
							<div className="flex flex-wrap overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] mb-2.5">
								{item.content}
							</div>
						</RadixAccordion.Content>
					</RadixAccordion.Item>
				);
			})}
		</RadixAccordion.Root>
	);
}

export default Accordion;

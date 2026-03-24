import WikiLink from "../WikiLink/WikiLink";
import React from "react";
import { RiErrorWarningFill } from "react-icons/ri";

export function AccordionSection({ title, link, warning, children }: any) {
	return (
		<div className="w-full">
			<div className="flex w-full justify-center items-center gap-2.5">
				<p>{title}</p>
				{link && <WikiLink path={link} />}
			</div>
			{warning && <Warning>{warning}</Warning>}
			<div className="flex w-full flex-wrap justify-center gap-1">{children}</div>
		</div>
	);
}

export function Warning({ children }: any) {
	return (
		<div className="flex items-center gap-1.5 text-[0.8em] leading-[1.3em] italic text-left px-2 py-1 m-1 mb-1.5 rounded-[10px] bg-destructive/30 animate-warning-fade-in">
			<div className="w-[30px] opacity-60">
				<RiErrorWarningFill size={24} />
			</div>
			{children}
		</div>
	);
}

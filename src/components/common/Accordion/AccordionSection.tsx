import WikiLink from "../WikiLink/WikiLink";
import { RiErrorWarningFill } from "react-icons/ri";

export function AccordionSection({
	title,
	link,
	warning,
	children,
	align = "center",
}: {
	title: string;
	link?: string;
	warning?: string;
	children: React.ReactNode;
	align?: "left" | "center" | "right";
}) {
	return (
		<div className="w-full">
			<div className={`flex w-full items-center gap-2.5 justify-${align}`}>
				<p>{title}</p>
				{link && <WikiLink path={link} />}
			</div>
			{warning && <Warning>{warning}</Warning>}
			<div className={`flex w-full flex-wrap gap-1 justify-${align}`}>{children}</div>
		</div>
	);
}

export function AccordionSectionSkeleton({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full">
			<div className="flex w-full flex-wrap gap-1">{children}</div>
		</div>
	);
}

export function Warning({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-center gap-1.5 text-[0.8em] leading-[1.3em] italic text-left px-2 py-1 m-1 mb-1.5 rounded-[10px] bg-destructive/30 animate-warning-fade-in">
			<div className="w-[30px] opacity-60">
				<RiErrorWarningFill size={24} />
			</div>
			{children}
		</div>
	);
}

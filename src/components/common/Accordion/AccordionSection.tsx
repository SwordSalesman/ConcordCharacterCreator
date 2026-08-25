import { Warning } from "../Warning";
import WikiLink from "../WikiLink/WikiLink";

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

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionWrapper({
	children,
	title,
	icon,
	subtitle,
	className,
	hide,
	action,
}: {
	children?: ReactNode;
	title: string;
	icon?: ReactNode;
	subtitle?: string;
	className?: string;
	hide?: boolean;
	action?: ReactNode;
}) {
	return (
		<section
			className={cn(hide ? "hidden" : `flex animate-in fade-in`, "flex-col gap-2", className)}
		>
			<div className="flex justify-between items-center gap-2 border-b border-dashed">
				<div className="flex flex-col gap-1 p-1 px-0 pt-0">
					<div className="flex items-center gap-1.5">
						{icon ? icon : <></>}
						<h2 className="text-lg font-bold leading-4">{title}</h2>
					</div>
					{subtitle ? (
						<p className="text-sm text-muted-foreground leading-4">{subtitle}</p>
					) : null}
				</div>
				{action ? <div className="py-1">{action}</div> : null}
			</div>
			{children ? <div className="">{children}</div> : null}
		</section>
	);
}

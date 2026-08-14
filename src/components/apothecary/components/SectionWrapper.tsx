import { ReactNode } from "react";
import { FaBalanceScaleLeft } from "react-icons/fa";

export function SectionWrapper({
	children,
	title,
	icon,
	subtitle,
	className,
	hide,
}: {
	children?: ReactNode;
	title: string;
	icon?: ReactNode;
	subtitle?: string;
	className?: string;
	hide?: boolean;
}) {
	return (
		<section
			className={`flex flex-col gap-2 ${className ? className : ""} ${hide ? "hidden" : "inline"} animate-in fade-in`}
		>
			<div className="">
				<div className="flex items-center gap-1">
					{icon ? icon : <></>}
					<h2 className="text-lg font-bold leading-4">{title}</h2>
				</div>
				{subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
			</div>
			{children ? <div className="">{children}</div> : null}
		</section>
	);
}

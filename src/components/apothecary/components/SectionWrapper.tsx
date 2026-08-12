import { ReactNode } from "react";
import { FaBalanceScaleLeft } from "react-icons/fa";

export function SectionWrapper({
	children,
	title,
	icon,
	subtitle,
}: {
	children: ReactNode;
	title: string;
	icon?: ReactNode;
	subtitle?: string;
}) {
	return (
		<section className="flex flex-col gap-2">
			<div className="">
				<div className="flex items-center gap-1">
					{icon ? icon : <></>}
					<h2 className="text-lg font-bold leading-4">{title}</h2>
				</div>
				{subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
			</div>
			<div className="">{children}</div>
		</section>
	);
}

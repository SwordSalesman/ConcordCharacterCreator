import { RiErrorWarningFill } from "react-icons/ri";

export function Warning({
	variant,
	children,
}: {
	variant?: "error" | "warning";
	children: React.ReactNode;
}) {
	return (
		<div
			className={`flex items-center gap-1.5 text-[0.8em] leading-[1.3em] italic text-left px-2 py-1 m-1 mb-1.5 rounded-[10px] ${variant === "warning" ? "bg-warning/30" : "bg-destructive/30"} animate-warning-fade-in`}
		>
			<div className="w-[30px] opacity-60">
				<RiErrorWarningFill size={24} />
			</div>
			{children}
		</div>
	);
}

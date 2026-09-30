import { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ManagerProps {
	children: ReactNode;
	className?: string;
}

interface ManagerSectionProps {
	children: ReactNode;
	className?: string;
}

interface ManagerListProps extends ManagerSectionProps {
	actions?: ReactNode;
}

interface ManagerListItemProps extends ManagerSectionProps {
	active?: boolean;
	onClick?: MouseEventHandler<HTMLLIElement>;
}

export function Manager({ children, className }: ManagerProps) {
	return (
		<div
			className={cn(
				"mx-auto mt-2 flex flex-col gap-2 font-[Arial,sans-serif] sm:h-[90vh] sm:flex-row min-h-[600px] max-w-[1400px] w-full",
				className,
			)}
		>
			{children}
		</div>
	);
}

export function ManagerList({ children, actions, className }: ManagerListProps) {
	return (
		<div
			className={cn(
				"flex flex-none flex-col items-center justify-center gap-1.5 h-[400px] sm:flex-1 sm:h-full",
				className,
			)}
		>
			{actions}
			<div className="relative flex-1 w-full overflow-y-scroll border border-border rounded-tl-lg rounded-tr-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
				{children}
			</div>
		</div>
	);
}

export function ManagerListFilter({ children, className }: ManagerSectionProps) {
	return (
		<div
			className={cn(
				"sticky top-0 z-6 flex flex-col gap-1.5 border-b border-border bg-background-raised p-1.5",
				className,
			)}
		>
			{children}
		</div>
	);
}

export function ManagerListItems({ children, className }: ManagerSectionProps) {
	return (
		<ul
			className={cn(
				"overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
				className,
			)}
		>
			{children}
		</ul>
	);
}

export function ManagerListItem({
	children,
	active = false,
	onClick,
	className,
}: ManagerListItemProps) {
	return (
		<li
			onClick={onClick}
			className={cn(
				"relative flex cursor-pointer flex-col justify-between overflow-hidden border-b border-border p-2 text-sm hover:brightness-95 dark:hover:brightness-110",
				active ? "bg-background-300" : "bg-background",
				className,
			)}
		>
			{children}
		</li>
	);
}

export function ManagerContent({ children, className }: ManagerSectionProps) {
	return (
		<div className={cn("flex flex-col justify-between max-h-full sm:flex-2", className)}>
			{children}
		</div>
	);
}

export function ManagerContentCard({ children, className }: ManagerSectionProps) {
	return (
		<div
			className={cn(
				"h-full  overflow-y-scroll p-2 pb-8 pt-8 text-sm sm:pb-14 sm:pt-0 [&::-webkit-scrollbar]:hidden [&_li]:ml-4 [-ms-overflow-style:none] [scrollbar-width:none]",
				className,
			)}
		>
			{children}
		</div>
	);
}

export function ManagerContentSubmitPanel({ children, className }: ManagerSectionProps) {
	return (
		<div className={cn("relative", className)}>
			<div className="absolute -top-8 h-10 w-full bg-gradient-to-t from-background-raised to-transparent" />
			<div className="relative z-1 h-full max-h-[450px] overflow-scroll border bg-background p-3 text-sm rounded-tl-lg rounded-tr-lg flex flex-col gap-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
				{children}
			</div>
		</div>
	);
}

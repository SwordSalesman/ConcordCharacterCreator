import toast from "react-hot-toast";

interface ChipProps {
	children: React.ReactNode;
	onClick?: () => void;
	selected?: boolean;
	skillstyle?: boolean;
	shadow?: boolean;
	inactive?: boolean;
	inactiveReason?: string;
	className?: string;
	[key: string]: any;
}

export function ChipSkillWrapper({ children }: { children: React.ReactNode }) {
	return <div className="rounded-full border-solid border w-5 h-5 leading-4.5">{children}</div>;
}

export function Chip({
	children,
	onClick,
	selected,
	skillstyle,
	shadow,
	inactive,
	inactiveReason,
	className,
	...rest
}: ChipProps) {
	const handleClick = () => {
		if (!inactive && onClick) {
			onClick();
		} else if (inactiveReason) {
			toast(inactiveReason);
		}
	};

	// Tailwind classes
	let baseClasses =
		"flex justify-center items-center gap-1 font-sans border border-solid cursor-pointer py-1 px-2 text-[0.92em] transition-colors duration-200";
	let radius = skillstyle ? "rounded-l-[20px] rounded-r-[8px]" : "rounded-lg";
	let shadowClass = shadow ? "shadow-md" : "";
	let bg = selected ? "bg-primary" : "bg-card";
	let colorClass = selected ? "text-primary-foreground" : "text-foreground";
	let interactive = `${
		inactive
			? "bg-muted text-muted-foreground"
			: "sm:hover:brightness-95 dark:hover:brightness-[120%]"
	}`;

	// Responsive classes
	let responsive = "sm:px-1 sm:py-0.5";

	return (
		<button
			type="button"
			className={`${baseClasses} ${radius} ${shadowClass} ${bg} ${colorClass} ${responsive} ${interactive} ${className}`}
			onClick={handleClick}
			{...rest}
		>
			{children}
		</button>
	);
}

// Removed styled-components. If you need SkillCost, use Tailwind classes in your JSX.

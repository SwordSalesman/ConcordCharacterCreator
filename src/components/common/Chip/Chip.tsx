import toast from "react-hot-toast";

interface ChipProps {
	children: React.ReactNode;
	onClick?: () => void;
	selected?: boolean;
	skillstyle?: boolean;
	shadow?: boolean;
	inactive?: boolean;
	inactiveReason?: string;
	[key: string]: any;
}

export function Chip({
	children,
	onClick,
	selected,
	skillstyle,
	shadow,
	inactive,
	inactiveReason,
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
		"flex justify-center items-center gap-1 font-sans border border-solid cursor-pointer py-1 px-2 text-[0.92em] ";
	let radius = skillstyle ? "rounded-sm rounded-l-full" : "rounded-lg";
	let shadowClass = shadow ? "shadow-md" : "";
	let bg = selected ? "bg-primary" : "bg-background";
	let colorClass = selected ? "text-primary-foreground" : "text-foreground";
	let interactive = `${
		inactive ? "opacity-80" : "sm:hover:brightness-95 dark:hover:brightness-[120%]"
	}`;

	// Responsive classes
	let responsive = "sm:px-2 sm:py-0.5";

	return (
		<button
			type="button"
			className={`${baseClasses} ${radius} ${shadowClass} ${bg} ${colorClass} ${responsive} ${interactive}`}
			onClick={handleClick}
			{...rest}
		>
			{children}
		</button>
	);
}

// Removed styled-components. If you need SkillCost, use Tailwind classes in your JSX.

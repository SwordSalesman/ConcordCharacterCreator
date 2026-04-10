import { cn } from "@/lib/utils";

export const contentNarrow = "px-2 max-w-[600px]";
export const contentMedium = "px-2 max-w-[740px]";
export const contentWide = "px-2 max-w-[1200px]";

export default function ContentWrapper({
	layout = "medium",
	className,
	children,
}: {
	layout?: "wide" | "medium" | "narrow";
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				`flex flex-col min-w-[300px] py-2 m-auto mb-6 ${
					layout === "wide"
						? contentWide
						: layout === "narrow"
							? contentNarrow
							: contentMedium
				}`,
				className,
			)}
		>
			{children}
		</div>
	);
}

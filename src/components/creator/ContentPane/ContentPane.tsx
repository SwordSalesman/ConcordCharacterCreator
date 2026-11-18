import React, { HTMLAttributes } from "react";

interface ContentPaneProps extends HTMLAttributes<HTMLDivElement> {
	layout?: "narrow" | "default";
}

export const ContentPane: React.FC<ContentPaneProps> = ({
	layout,
	children,
	className,
	...rest
}) => {
	return (
		<div
			className={`flex flex-col relative flex-1 mb-2.5 w-full sm:mb-0 sm:w-auto overflow-auto scrollbar-hide ${layout === "narrow" ? "w-full sm:max-w-112.5" : ""} ${className}`}
			{...rest}
		>
			{children}
		</div>
	);
};

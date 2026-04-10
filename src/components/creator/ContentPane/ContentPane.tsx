import React, { ReactNode, HTMLAttributes } from "react";

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
			className={`flex flex-col relative flex-1 mb-2.5 w-full sm:mb-0 sm:w-auto overflow-auto scrollbar-hide ${layout === "narrow" ? "w-full sm:max-w-[450px]" : ""} ${className}`}
			{...rest}
		>
			{children}
		</div>
	);
};

interface PaneBackgroundImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	imageCenter?: boolean;
}

export const PaneBackgroundImage: React.FC<PaneBackgroundImageProps> = ({
	imageCenter = false,
	className = "",
	...props
}) => {
	// Centering logic
	const translate = imageCenter
		? "-translate-x-1/2 translate-y-[5%]"
		: "-translate-x-full translate-y-[5%]";
	return (
		<img
			className={`absolute top-[40%] left-1/2 w-[300px] h-[300px] opacity-10 z-0 ${translate} ${className}`}
			style={{
				MozTransform: "translate(-50%, -50%)",
				msTransform: "translate(-50%, -50%)",
				OTransform: "translate(-50%, -50%)",
				WebkitTransform: "translate(-50%, -50%)",
				transform: "translate(-50%, -50%)",
			}}
			{...props}
		/>
	);
};

import React, { ReactNode, HTMLAttributes } from "react";

interface ContentPaneProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	mobileHide?: boolean;
	style?: React.CSSProperties;
}

export const ContentPane: React.FC<ContentPaneProps> = ({
	children,
	mobileHide: mobileHide,
	style,
	...rest
}) => {
	const mobileHideClass = mobileHide ? "hidden md:block" : "";
	return (
		<div
			className={`relative flex-1 md:h-fit md:mb-0 md:w-auto mb-2.5 w-full ${mobileHideClass}`}
			style={style}
			{...rest}
		>
			<div className="relative flex flex-col z-1 w-full h-full overflow-auto scrollbar-hide">
				{children}
			</div>
		</div>
	);
};

interface PaneBackgroundImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	imageCenter?: boolean;
	mobileHide?: boolean;
}

export const PaneBackgroundImage: React.FC<PaneBackgroundImageProps> = ({
	imageCenter = false,
	mobileHide = false,
	className = "",
	...props
}) => {
	const mobileHideClass = mobileHide ? "hidden md:block" : "";
	// Centering logic
	const translate = imageCenter
		? "-translate-x-1/2 translate-y-[5%]"
		: "-translate-x-full translate-y-[5%]";
	return (
		<img
			className={`absolute top-[40%] left-1/2 w-[300px] h-[300px] opacity-10 z-0 ${translate} ${mobileHideClass} ${className}`}
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

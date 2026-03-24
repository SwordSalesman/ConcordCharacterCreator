import React, { ReactNode, HTMLAttributes } from "react";

interface ContentPaneProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	mobileshow?: boolean;
	style?: React.CSSProperties;
}

/**
 * ContentPane component using Tailwind CSS for styling.
 */
export const ContentPane: React.FC<ContentPaneProps> = ({
	children,
	mobileshow,
	style,
	...rest
}) => {
	// Hide on mobile if mobileshow is false
	const mobileHideClass = mobileshow ? "" : "hidden md:block";
	return (
		<div
			className={`relative flex-1 md:h-fit md:mb-0 md:w-auto mb-2.5 w-full ${mobileHideClass}`}
			style={style}
			{...rest}
		>
			<div className="relative flex flex-col z-20 w-full h-full overflow-auto scrollbar-hide">
				{children}
			</div>
		</div>
	);
};

/**
 * PaneBackgroundImage component using Tailwind CSS for styling.
 * @param props - src, alt, imageCenter, mobileshow, and other img props
 */
interface PaneBackgroundImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	imageCenter?: boolean;
	mobileshow?: boolean;
}

export const PaneBackgroundImage: React.FC<PaneBackgroundImageProps> = ({
	imageCenter = false,
	mobileshow = false,
	className = "",
	...props
}) => {
	// Hide on mobile if mobileshow is false
	const mobileHideClass = mobileshow ? "" : "hidden md:block";
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

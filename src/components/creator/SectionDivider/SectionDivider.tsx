import React from "react";

function SectionDivider({ left, right }: { left: string; right?: string }) {
	return (
		<div className="flex justify-center gap-2 mt-1.5 text-special">
			<div>{left}</div>
			{right && <div>{right}</div>}
		</div>
	);
}

export default SectionDivider;

export function SectionLine({ children }: { children?: React.ReactNode }) {
	return (
		<div className="flex justify-center items-center gap-2.5 w-full">{children}</div>
	);
}

export function SectionWrapper({ children }: { children?: React.ReactNode }) {
	return (
		<div className="flex flex-wrap justify-center items-center mb-[5px] min-[600px]:mb-[15px]">
			{children}
		</div>
	);
}

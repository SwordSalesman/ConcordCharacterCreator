import React from "react";

// to do - refactor this shit

function SectionDivider({ left, right }: { left: string; right?: string }) {
	return (
		<div className="flex justify-center gap-2 mt-1.5 text-special">
			<div>{left}</div>
			{right && <div>{right}</div>}
		</div>
	);
}

export default SectionDivider;

export function SectionWrapper({ children }: { children?: React.ReactNode }) {
	return <div className="flex flex-wrap gap-1 justify-center items-center">{children}</div>;
}

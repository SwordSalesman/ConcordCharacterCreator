import React from "react";

// to do - refactor this shit

export function SectionDivider({ children }: { children?: React.ReactNode }) {
	return <div className="flex justify-center gap-2 mt-1.5 text-special">{children}</div>;
}

export function SectionWrapper({ children }: { children?: React.ReactNode }) {
	return <div className="flex flex-wrap gap-1 justify-center items-center">{children}</div>;
}

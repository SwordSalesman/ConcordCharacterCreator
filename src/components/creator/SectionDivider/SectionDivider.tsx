function SectionDivider({ left, right }: { left: string; right?: string }) {
	return (
		<div className="flex justify-center gap-2 mt-1.5 text-special">
			<div>{left}</div>
			{right && <div>{right}</div>}
		</div>
	);
}

export default SectionDivider;

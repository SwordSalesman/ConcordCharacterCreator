export function NewWrapper({ isNew, children }: { isNew: boolean; children: React.ReactNode }) {
	return (
		<div className={`relative`}>
			<div
				className={`${isNew ? "opacity-100 animate-wiggle" : "opacity-0"} duration-300 h-6 w-6 rounded-full bg-primary absolute -top-3 -right-3 flex items-center justify-center text-white text-lg z-10 pointer-events-none`}
			>
				!
			</div>
			{children}
		</div>
	);
}

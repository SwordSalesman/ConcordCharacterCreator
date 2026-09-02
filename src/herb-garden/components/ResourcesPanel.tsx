import { displayNumber } from "../helpers/numberHelper";

type ResourceCard = {
	emoji: string;
	name: string;
	amount: number;
};

export function ResourcesPanel({
	money,
	herbTotal,
	potionTotal,
	compact = false,
}: {
	money: number;
	herbTotal: number;
	potionTotal: number;
	compact?: boolean;
}) {
	function ResourceCard({ emoji, name, amount }: ResourceCard) {
		return (
			<div
				className={`relative flex gap-1.5 border-1 rounded-md pt-1 sm:pt-2 px-2 pb-4 sm:pb-5 flex-1 justify-center items-center text-sm sm:text-md ${compact ? "mb-3" : "mb-4"}`}
			>
				<div className="flex flex-col justify-center items-center gap-0.5 sm:flex-row sm:gap-2">
					<span>{emoji}</span>
					<span className="text-xs sm:text-sm">{name}</span>
				</div>
				<div
					className={`absolute text-muted-foreground bg-background rounded-md border-1 px-2 min-w-14 h-7 flex justify-center items-center ${compact ? "bottom-[-12px]" : "bottom-[-14px]"}`}
				>
					{displayNumber(amount)}
				</div>
			</div>
		);
	}

	return (
		<div className={`sticky top-0 z-10 overflow-hidden duration-300`}>
			<div
				className={`overflow-hidden bg-background pt-2 pb-0 px-0 transition-all duration-150 pointer-events-none`}
			>
				<div className="grid grid-cols-4 gap-1 sm:grid-cols-4">
					<ResourceCard emoji="🌱" name="Herbs" amount={herbTotal} />
					<ResourceCard emoji="⚗️" name="Potions" amount={potionTotal} />
					<ResourceCard emoji="🗝️" name="Keys" amount={money} />
					<ResourceCard emoji="🪵" name="Thunderoak" amount={0} />
				</div>
			</div>
			<div className="h-4 w-full bg-gradient-to-b from-background to-transparent pointer-events-none"></div>
		</div>
	);
}

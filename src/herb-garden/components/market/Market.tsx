import { HERBS, POTION_IDS, PotionId, POTIONS } from "../data/gameData";
import { useContext, type CSSProperties } from "react";
import { GameContext } from "../../context/gameContext";
import { useApothecaryAnimation } from "../../context/animationContext";
import { displayNumber } from "../../helpers/numberHelper";
import { Button } from "@/components/common/Button/Button";
import { MdTrendingUp } from "react-icons/md";

function getDemandHue(demand: number, minDemand: number, maxDemand: number) {
	const demandRange = maxDemand - minDemand;
	const normalizedDemand = demandRange > 0 ? (demand - minDemand) / demandRange : 0.5;
	return Math.max(0, normalizedDemand) * 120;
}

function TrendIcon({ className }: { className?: string }) {
	return (
		<div
			className={`text-xs text-white rounded-full w-5 h-5 flex justify-center items-center overflow-hidden bg-contrast z-1 ${className ?? ""}`}
		>
			<MdTrendingUp size={16} />
		</div>
	);
}

export function Market() {
	const {
		canSellPotion,
		sellPotion,
		potions,
		unlockedPotions,
		isUpgradePurchased,
		getEffectivePotionDemand,
		minPotionDemand,
		maxPotionDemand,
		activeTrend,
		trendRemainingMs,
		isPotionTrending,
		getEffectivePotionSellValue,
	} = useContext(GameContext);
	const { registerAnchor } = useApothecaryAnimation();
	const sellAnchor = (potionId: PotionId) => registerAnchor(`sell:${potionId}`);
	const demandEnabled = isUpgradePurchased("market.demand_based_pricing");
	const trendsEnabled =
		isUpgradePurchased("market.trends_tags") || isUpgradePurchased("market.trends_ingredients");

	const trendTag = activeTrend?.tag
		? `${activeTrend.tag[0].toUpperCase()}${activeTrend.tag.slice(1)}`
		: null;
	const trendHerbs =
		activeTrend?.herbIds?.map((herbId) => HERBS[herbId].emoji).join(" & ") ?? null;

	const activeTrendBonus = activeTrend?.tag && activeTrend.herbIds ? 100 : 50;

	return (
		<div className="flex flex-col gap-2">
			{trendsEnabled && activeTrend && (
				<div className="flex items-center justify-between text-sm">
					<span className="flex items-center gap-1.5">
						<TrendIcon className="animate-quick-fade-in" />
						<span className="">
							{trendHerbs && !trendTag ? "Potions with " + trendHerbs : null}

							{trendTag ? (
								<>
									<span className="font-bold">
										{trendTag}
										{" Potions"}
									</span>
								</>
							) : null}
							{trendHerbs && trendTag ? " with " + trendHerbs : null}
						</span>
						<span className="text-contrast">(+{activeTrendBonus}%)</span>
					</span>
					<span className="font-mono text-muted-foreground">
						{Math.ceil(trendRemainingMs / 1000)}s
					</span>
				</div>
			)}
			<div className="grid gap-1 grid-cols-1">
				{POTION_IDS.filter((potionId) => unlockedPotions[potionId]).map((potionId) => {
					const trending = isPotionTrending(potionId);
					const totalPotionDemand = getEffectivePotionDemand(potionId);

					const demandHue = getDemandHue(
						totalPotionDemand,
						minPotionDemand,
						maxPotionDemand,
					);

					return (
						<div key={potionId} className="flex gap-2">
							<div className="flex items-center justify-center font-mono min-w-4">
								{displayNumber(potions[potionId])}
							</div>
							<Button
								ref={sellAnchor(potionId)}
								onClick={() => {
									canSellPotion(potionId) && sellPotion(potionId, 1);
								}}
								className="w-full flex flex-1 h-fit relative justify-between duration-100 hover:scale-103 active:scale-98 p-0 h-fit"
								disabled={!canSellPotion(potionId)}
							>
								{trending && (
									<TrendIcon className="absolute -top-1 -right-1 animate-quick-fade-in" />
								)}
								<div className="flex flex-col items-start p-2 px-3">
									<span className="text-wrap text-left">
										{POTIONS[potionId].name}
									</span>
								</div>
								<span className="flex items-center">
									<span className="px-2 h-full flex relative gap-1 items-center font-mono">
										<span className="flex gap-0.5 items-center">
											<span>
												{displayNumber(
													getEffectivePotionSellValue(potionId),
												)}
											</span>
											<span>🗝️</span>
										</span>
										{demandEnabled && (
											<span
												className={
													"text-xs text-[hsl(var(--demand-hue)_80%_38%)] dark:text-[hsl(var(--demand-hue)_75%_62%)]"
												}
												style={
													{
														"--demand-hue": demandHue,
													} as CSSProperties
												}
											>
												(
												{(getEffectivePotionDemand(potionId) * 100).toFixed(
													0,
												)}
												%)
											</span>
										)}
									</span>
								</span>
							</Button>
						</div>
					);
				})}
			</div>
		</div>
	);
}

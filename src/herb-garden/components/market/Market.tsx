import { POTION_IDS, PotionId, POTIONS } from "../data/gameData";
import { useContext, type CSSProperties } from "react";
import { GameContext } from "../../context/gameContext";
import { useApothecaryAnimation } from "../../context/animationContext";
import { displayNumber } from "../../helpers/numberHelper";
import { Button } from "@/components/common/Button/Button";

function getDemandHue(demand: number, minDemand: number, maxDemand: number) {
	const demandRange = maxDemand - minDemand;
	const normalizedDemand = demandRange > 0 ? (demand - minDemand) / demandRange : 0.5;
	return Math.min(1, Math.max(0, normalizedDemand)) * 120;
}

export function Market() {
	const {
		canSellPotion,
		sellPotion,
		potions,
		unlockedPotions,
		isUpgradePurchased,
		getPotionDemand,
		minPotionDemand,
		maxPotionDemand,
		getEffectivePotionSellValue,
	} = useContext(GameContext);
	const { registerAnchor } = useApothecaryAnimation();
	const sellAnchor = (potionId: PotionId) => registerAnchor(`sell:${potionId}`);
	const demandEnabled = isUpgradePurchased("market.demand_based_pricing");

	return (
		<div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
			{POTION_IDS.filter((potionId) => unlockedPotions[potionId]).map((potionId) => {
				const demandHue = getDemandHue(
					getPotionDemand(potionId),
					minPotionDemand,
					maxPotionDemand,
				);

				return (
					<Button
						key={potionId}
						ref={sellAnchor(potionId)}
						onClick={() => {
							canSellPotion(potionId) && sellPotion(potionId, 1);
						}}
						className="w-full flex justify-between duration-100 hover:scale-103 active:scale-98 p-0"
						disabled={!canSellPotion(potionId)}
					>
						<div className="flex flex-col items-start p-2 px-3">
							<span>{POTIONS[potionId].name}</span>
						</div>
						<span className="flex px-3 h-full items-center">
							<span
								className="border-r-1 h-full flex relative gap-1 items-center px-2 font-mono text-[hsl(var(--demand-hue)_80%_38%)] dark:text-[hsl(var(--demand-hue)_75%_62%)]"
								style={{ "--demand-hue": demandHue } as CSSProperties}
							>
								<span className="flex gap-0.5 items-center">
									<span>
										{displayNumber(getEffectivePotionSellValue(potionId))}
									</span>
									<span>🗝️</span>
								</span>
								{demandEnabled && (
									<span className="text-xs">
										({(getPotionDemand(potionId) * 100).toFixed(0)}%)
									</span>
								)}
							</span>
							<div className="h-full flex items-center pl-2 font-mono">
								{displayNumber(potions[potionId])}
							</div>
						</span>
					</Button>
				);
			})}
		</div>
	);
}

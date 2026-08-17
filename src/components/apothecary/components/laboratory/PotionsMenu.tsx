import { useContext } from "react";
import { Button } from "@/components/common/Button/Button";
import { Modal } from "@/components/common/Modal/Modal";
import { HERB_IDS, HERBS, POTION_IDS, PotionId, POTIONS } from "../../gameData";
import { GameContext } from "../../gameContext";

export function PotionsMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
	const { unlockedPotions, getPotionUnlockCost, canUnlockPotion, unlockPotion } =
		useContext(GameContext);

	const potionsByTier: Record<number, PotionId[]> = {};
	POTION_IDS.forEach((potionId: PotionId) => {
		const tier = POTIONS[potionId].tier;
		if (!potionsByTier[tier]) {
			potionsByTier[tier] = [];
		}
		potionsByTier[tier].push(potionId);
	});

	const tiers = Object.keys(potionsByTier)
		.map(Number)
		.sort((a, b) => a - b);

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={<div className="text-center">Learn Recipes</div>}
			body={
				<div className="flex flex-col gap-2 max-h-100 overflow-y-auto">
					{tiers.map((tier) => (
						<div key={tier} className="flex flex-col gap-2">
							<div className="text-xs font-semibold uppercase text-center tracking-wide text-muted-foreground px-1 py-4">
								Tier {tier}
							</div>
							{potionsByTier[tier].map((potionId) => {
								const cost = getPotionUnlockCost(potionId);
								return (
									<div
										key={potionId}
										className="flex flex-col sm:flex-row justify-center items-center gap-2 border-1 border-border rounded-md"
									>
										<span className="flex flex-col flex-1 text-center sm:border-r-1 p-2">
											<div className="">{POTIONS[potionId].name}</div>
											{!unlockedPotions[potionId] ? (
												<>
													<div className="flex gap-4 justify-between text-sm pt-2">
														<span className="text-muted-foreground">
															Recipe
														</span>
														<span>
															{Object.entries(
																POTIONS[potionId].recipe,
															).map(([herbId, amount]) => (
																<span key={herbId}>
																	{HERBS[
																		herbId as (typeof HERB_IDS)[number]
																	].emoji.repeat(amount)}{" "}
																</span>
															))}{" "}
														</span>
													</div>
													<div className="flex gap-4 justify-between text-sm">
														<span className="text-muted-foreground">
															Sell value
														</span>
														<span>
															{POTIONS[potionId].sellValue} 🗝️
														</span>
													</div>
												</>
											) : null}
										</span>
										<div className="flex-1 flex justify-center pb-2 sm:pb-0">
											{unlockedPotions[potionId] ? (
												<span className="text-muted-foreground italic">
													Recipe learned
												</span>
											) : (
												<Button
													disabled={!canUnlockPotion(potionId)}
													onClick={() => unlockPotion(potionId)}
													size="sm"
												>
													Learn Recipe
													<span>({cost} 🗝️)</span>
												</Button>
											)}
										</div>
									</div>
								);
							})}
						</div>
					))}
				</div>
			}
		/>
	);
}

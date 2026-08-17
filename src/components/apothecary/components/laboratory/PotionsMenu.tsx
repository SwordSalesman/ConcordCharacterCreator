import { useContext } from "react";
import { Button } from "@/components/common/Button/Button";
import { Modal } from "@/components/common/Modal/Modal";
import { HERB_IDS, HERBS, POTION_IDS, PotionId, POTIONS } from "../data/gameData";
import { GameContext } from "../../context/gameContext";

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
			size="medium"
			body={
				<div className="flex flex-col gap-2 max-h-100 overflow-y-auto">
					{tiers.map((tier) => (
						<div key={tier} className="flex flex-col gap-2">
							<div className="text-sm font-semibold uppercase text-center tracking-wide text-muted-foreground px-1 py-2">
								Tier {tier}
							</div>
							<div className="rounded-md text-center flex flex-col gap-2">
								{potionsByTier[tier].map((potionId) => (
									<Button
										disabled={!canUnlockPotion(potionId)}
										onClick={() => {
											unlockPotion(potionId);
											onClose();
										}}
										// size="sm"
										// className="h-12"
										key={potionId}
										className={`flex h-fit flex-row items-center justify-between rounded-md p-2 ${unlockedPotions[potionId] && "opacity-50"}`}
									>
										<div className="flex flex-col gap-1">
											<div className={`items-center flex text-lg`}>
												{POTIONS[potionId].name}
											</div>
											<span className={``}>
												<div className="flex gap-2 text-sm">
													<span className="text-muted-foreground text-sm text-left">
														Recipe
													</span>
													<span>
														{Object.entries(
															POTIONS[potionId].recipe,
														).map(([herbId, amount]) => {
															const emoji =
																HERBS[
																	herbId as (typeof HERB_IDS)[number]
																].emoji;
															return (
																<span key={herbId}>
																	{amount > 1
																		? `${amount}${emoji}`
																		: emoji.repeat(amount)}{" "}
																</span>
															);
														})}
													</span>
												</div>
											</span>
											<div className={`flex gap-2 text-sm items-center`}>
												<span className="text-muted-foreground">
													Sell price
												</span>
												<span>{POTIONS[potionId].sellValue} 🗝️</span>
											</div>
										</div>
										<div className="flex  text-lg">
											<span>{getPotionUnlockCost(potionId)} 🗝️</span>
										</div>
										{/* <div className={`flex justify-center`}>
											{unlockedPotions[potionId] ? (
												<span className="text-muted-foreground italic">
													Learned
												</span>
											) : (
												<Button
													disabled={!canUnlockPotion(potionId)}
													onClick={() => {
														unlockPotion(potionId);
														onClose();
													}}
													// size="sm"
													className="h-12"
												>
													<div className="flex flex-col p-1">
														Learn
														<span>
															({getPotionUnlockCost(potionId)} 🗝️)
														</span>
													</div>
												</Button>
											)}
										</div> */}
									</Button>
								))}
							</div>
						</div>
					))}
				</div>
			}
		/>
	);
}

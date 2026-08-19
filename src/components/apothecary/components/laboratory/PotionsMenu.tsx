import { useContext } from "react";
import { Button } from "@/components/common/Button/Button";
import { Modal } from "@/components/common/Modal/Modal";
import { HERB_IDS, HERBS, POTION_IDS, PotionId, POTIONS } from "../data/gameData";
import { GameContext } from "../../context/gameContext";
import { AquiredItem } from "../UpgradeMenu";

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
				<>
					<div className="relative flex flex-col gap-6 pb-8 max-h-120 overflow-y-scroll overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
						{tiers.map((tier) => (
							<div key={tier} className="flex flex-col gap-2">
								<div className="text-sm font-semibold uppercase text-center tracking-wide text-muted-foreground px-1">
									Tier {tier}
								</div>
								<div className="flex flex-wrap mb-2 justify-center z-2">
									{potionsByTier[tier]
										.filter((potionId) => unlockedPotions[potionId])
										.map((potionId) => (
											<AquiredItem name={POTIONS[potionId].name} />
										))}
								</div>
								<div className="rounded-md text-center flex flex-col gap-2">
									{potionsByTier[tier]
										.filter((potionId) => !unlockedPotions[potionId])
										.map((potionId) => (
											<Button
												disabled={!canUnlockPotion(potionId)}
												onClick={() => {
													unlockPotion(potionId);
													onClose();
												}}
												key={`potionButton-${potionId}`}
												className={`flex h-fit flex-row items-center justify-between rounded-md p-2`}
											>
												<div className="flex flex-col gap-1">
													<div
														className={`items-center flex text-lg text-wrap text-left leading-6`}
													>
														{POTIONS[potionId].name}
													</div>
													<span className={``}>
														<div className="flex gap-2 text-sm ">
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
																				: emoji.repeat(
																						amount,
																					)}{" "}
																		</span>
																	);
																})}
															</span>
														</div>
													</span>
													<div
														className={`flex gap-2 text-sm items-center`}
													>
														<span className="text-muted-foreground">
															Sell price
														</span>
														<span>
															{POTIONS[potionId].sellValue} 🗝️
														</span>
													</div>
												</div>
												<div className="flex  text-lg">
													<span>{getPotionUnlockCost(potionId)} 🗝️</span>
												</div>
											</Button>
										))}
								</div>
							</div>
						))}
						<div className="fixed bottom-4 w-full bg-gradient-to-t from-background to-transparent h-8"></div>
					</div>
				</>
			}
		/>
	);
}

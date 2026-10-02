import { useContext } from "react";
import { Button } from "@/components/common/Button/Button";
import { Modal } from "@/components/common/Modal/Modal";
import { POTION_IDS, PotionId, POTIONS } from "../data/potions";
import { GameContext } from "../../context/gameContext";
import { AquiredItem } from "../UpgradeMenu";
import { displayNumber, potionRecipe } from "@/herb-garden/helpers/displayValueHelper";

export function PotionsMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
	const {
		unlockedPotions,
		getPotionUnlockCost,
		canUnlockPotionTier,
		canUnlockPotion,
		unlockPotion,
		getEffectivePotionSellValue,
		isUpgradePurchased,
	} = useContext(GameContext);

	const tagsUnlocked = isUpgradePurchased("market.trends_tags");

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

	function getTierLockMessage(tier: number) {
		if (tier === 2) {
			return "Unable to learn Tier 2 potions.";
		}

		if (tier === 3) {
			return "Unable to learn Tier 3 potions.";
		}

		return `Unable to learn Tier ${tier} potions.`;
	}

	const potionItemStyle =
		"border-background-300 border-1 bg-background-raised rounded-md p-0.5 px-1.5";

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={<div className="text-center">Learn Recipes</div>}
			size="medium"
			body={
				<>
					<div className="relative flex flex-col gap-10 pb-8 max-h-120 overflow-y-scroll overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
						{tiers.map((tier) => (
							<div key={tier} className="flex flex-col gap-2">
								<div className="text-sm font-semibold uppercase text-center tracking-wide text-muted-foreground px-1">
									Tier {tier}
								</div>
								<div className="flex flex-wrap mb-2 justify-center z-2">
									{potionsByTier[tier]
										.filter((potionId) => unlockedPotions[potionId])
										.map((potionId) => (
											<AquiredItem
												key={`unlocked-potion-${potionId}`}
												name={POTIONS[potionId].name}
											/>
										))}
								</div>
								<div className="rounded-md text-center flex flex-col gap-2">
									{!canUnlockPotionTier(tier) && (
										<div className="text-sm text-muted-foreground text-center">
											{getTierLockMessage(tier)}
										</div>
									)}
									{canUnlockPotionTier(tier) &&
										potionsByTier[tier]
											.filter((potionId) => !unlockedPotions[potionId])
											.map((potionId) => (
												<Button
													disabled={!canUnlockPotion(potionId)}
													onClick={() => {
														unlockPotion(potionId);
													}}
													key={`potionButton-${potionId}`}
													className={`flex h-fit flex-row items-center justify-between rounded-md p-2 px-3`}
												>
													<span className="flex-1 text-left flex flex-col gap-1">
														<span className="flex gap-2 items-center justify-between">
															<p className="text-wrap text-base">
																{POTIONS[potionId].name}
															</p>
															<span className="flex gap-1">
																<span className="font-mono">
																	{displayNumber(
																		getPotionUnlockCost(
																			potionId,
																		),
																	)}
																</span>
																🗝️
															</span>
														</span>
														<div className="flex flex-row flex-wrap justify-left items-center gap-2">
															<div className={potionItemStyle}>
																<span className="font-mono">
																	+
																	{displayNumber(
																		getEffectivePotionSellValue(
																			potionId,
																		),
																	)}
																	🗝️
																</span>
															</div>
															<div className={potionItemStyle}>
																<div className="flex gap-2 text-sm ">
																	<span className="font-mono">
																		{potionRecipe(potionId)}
																	</span>
																</div>
															</div>
															{tagsUnlocked ? (
																<div className={potionItemStyle}>
																	<span className="text-muted-foreground italic">
																		{POTIONS[potionId].tags
																			.map(
																				(t) =>
																					t[0].toUpperCase() +
																					t.slice(1),
																			)
																			.join(", ")}
																	</span>
																</div>
															) : null}
														</div>
													</span>
												</Button>
											))}
								</div>
							</div>
						))}
						<div className="fixed bottom-4 w-full left-0 bg-gradient-to-t from-background to-transparent h-8"></div>
					</div>
				</>
			}
		/>
	);
}

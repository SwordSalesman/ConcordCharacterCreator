import { useContext } from "react";
import { Button } from "@/components/common/Button/Button";
import { Modal } from "@/components/common/Modal/Modal";
import { CEREMONY_IDS, CeremonyId, CEREMONIES } from "../data/ceremonies";
import { CRYSTAL_MANA_EMOJI } from "../data/gameData";
import { GameContext } from "../../context/gameContext";
import { AquiredItem } from "../UpgradeMenu";
import { displayNumber } from "@/herb-garden/helpers/numberHelper";

export function CeremoniesMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
	const { unlockedCeremonies, getCeremonyUnlockCost, canUnlockCeremony, unlockCeremony } =
		useContext(GameContext);

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={<div className="text-center">Learn Ceremonies</div>}
			size="medium"
			body={
				<>
					<div className="relative flex flex-col gap-10 pb-8 max-h-120 overflow-y-scroll overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
						<div className="flex flex-col gap-2">
							<div className="flex flex-wrap mb-2 justify-center z-2">
								{CEREMONY_IDS.filter(
									(ceremonyId) => unlockedCeremonies[ceremonyId],
								).map((ceremonyId) => (
									<AquiredItem
										key={`unlocked-ceremony-${ceremonyId}`}
										name={CEREMONIES[ceremonyId].name}
									/>
								))}
							</div>
							<div className="rounded-md text-center flex flex-col gap-2">
								{CEREMONY_IDS.filter(
									(ceremonyId) => !unlockedCeremonies[ceremonyId],
								).map((ceremonyId) => (
									<Button
										disabled={!canUnlockCeremony(ceremonyId)}
										onClick={() => {
											unlockCeremony(ceremonyId);
										}}
										key={`ceremonyButton-${ceremonyId}`}
										className={`flex h-fit flex-row items-center justify-between rounded-md px-3 py-2`}
									>
										<span className="flex-1 text-left flex flex-col gap-1">
											<span className="flex gap-2 items-center justify-between">
												<p className="text-wrap text-base leading-5">
													{CEREMONIES[ceremonyId].name}
												</p>
												<span className="font-mono">
													{displayNumber(
														getCeremonyUnlockCost(ceremonyId),
													)}{" "}
													🗝️
												</span>
											</span>
											<div className="flex flex-row justify-left gap-2 text-wrap text-sm/4">
												<span
													className={`flex gap-1 items-center font-mono`}
												>
													<span>{CEREMONIES[ceremonyId].manaCost} </span>
													<span>{CRYSTAL_MANA_EMOJI}</span>
												</span>
												<span className="flex gap-2 text-muted-foreground">
													{CEREMONIES[ceremonyId].description}
												</span>
											</div>
										</span>
									</Button>
								))}
							</div>
						</div>
						<div className="fixed bottom-4 w-full left-0 bg-gradient-to-t from-background to-transparent h-8"></div>
					</div>
				</>
			}
		/>
	);
}

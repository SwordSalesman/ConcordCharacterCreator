import { Modal } from "@/components/common/Modal/Modal";
import { GameContext } from "../../context/gameContext";
import { useContext } from "react";
import { HERB_IDS, HERBS } from "../data/herbs";
import { Button } from "@/components/common/Button/Button";

export function GardensMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
	const { unlockedHerbs, getHerbUnlockCost, canUnlockHerb, unlockHerb } = useContext(GameContext);

	const cost = getHerbUnlockCost();

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={<div className="text-center">Build Gardens</div>}
			body={
				<div className="flex flex-col gap-2 items-center">
					{HERB_IDS.map((herbId) => {
						const herbEL = (
							<span className="text-muted-foreground">
								{HERBS[herbId].name} {HERBS[herbId].emoji}
							</span>
						);
						return unlockedHerbs[herbId] ? (
							<div key={herbId} className="flex justify-center items-center gap-2">
								{herbEL}
								<div className="flex-1 text-right">
									<span className="text-muted-foreground italic">
										Garden built
									</span>
								</div>
							</div>
						) : (
							<Button
								disabled={!canUnlockHerb()}
								onClick={() => {
									unlockHerb(herbId);
								}}
								size="lg"
								className="text-base flex flex-row items-center justify-between gap-6"
								key={herbId}
							>
								{/* Build Garden */}
								<div className="flex gap-1.5">
									Plant
									{herbEL}
								</div>
								<span>{cost} 🗝️</span>
							</Button>
						);
					})}
				</div>
			}
		/>
	);
}

import { Modal } from "@/components/common/Modal/Modal";
import { GameContext } from "../../context/gameContext";
import { useContext } from "react";
import { HERB_IDS, HERBS } from "../data/gameData";
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
							<div key={herbId}>
								<Button
									disabled={!canUnlockHerb()}
									onClick={() => {
										unlockHerb(herbId);
										onClose();
									}}
									size="lg"
									className="text-md"
								>
									{/* Build Garden */}
									<div className="flex gap-1">
										Plant
										{herbEL}
										<span>({cost} 🗝️)</span>
									</div>
								</Button>
							</div>
						);
					})}
				</div>
			}
		/>
	);
}

import { Modal } from "@/components/common/Modal/Modal";
import { GameContext } from "../gameContext";
import { useContext } from "react";
import { HERB_IDS, HERBS } from "../gameData";
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
				<div className="flex flex-col gap-2">
					{HERB_IDS.map((herbId) => (
						<div key={herbId} className="flex justify-center items-center gap-2 h-10">
							<span className="flex-1 text-right">
								{HERBS[herbId].emoji} {HERBS[herbId].name}
							</span>
							<div className="flex-1">
								{unlockedHerbs[herbId] ? (
									<span className="text-muted-foreground italic">
										Garden built
									</span>
								) : (
									<Button
										disabled={!canUnlockHerb()}
										onClick={() => unlockHerb(herbId)}
										size="sm"
									>
										Build Garden
										<span>({cost} 🗝️)</span>
									</Button>
								)}
							</div>
						</div>
					))}
				</div>
			}
		/>
	);
}

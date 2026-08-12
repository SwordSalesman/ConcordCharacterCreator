import { HERB_IDS, HerbId } from "../gameData";
import { useContext, useState } from "react";
import HerbPatch from "./HerbPatch";
import { DragDropProvider } from "@dnd-kit/react";
import { GameContext } from "../gameContext";

export function Gardens() {
	const { herbs, workers, farmerAssignments, gatherHerb, setFarmerHerbAssignment } =
		useContext(GameContext);

	const [draggedId, setDraggedId] = useState<string | null>(null);
	const [dragOverId, setDragOverId] = useState<string | null>(null);

	return (
		<DragDropProvider
			onDragStart={({ operation }) => {
				setDraggedId(operation.source?.id?.toString() ?? null);
			}}
			onDragEnd={({ operation }) => {
				setDraggedId(null);
				setDragOverId(null);

				if (!operation.source || !operation.target) {
					return;
				}

				const sourceHerbId = operation.source?.id
					?.toString()
					.replace("farmer:", "") as HerbId;
				const targetHerbId = operation.target?.id
					?.toString()
					.replace("herb:", "") as HerbId;

				setFarmerHerbAssignment(sourceHerbId, farmerAssignments[sourceHerbId] - 1);
				setFarmerHerbAssignment(targetHerbId, farmerAssignments[targetHerbId] + 1);
			}}
			onDragOver={({ operation }) => {
				setDragOverId(operation.target?.id?.toString() ?? null);
			}}
		>
			<div className="flex gap-1 flex-wrap">
				{HERB_IDS.map((herbId) => (
					<HerbPatch
						key={herbId}
						herbId={herbId}
						draggedId={draggedId}
						dragOverId={dragOverId}
					/>
				))}
			</div>
		</DragDropProvider>
	);
}

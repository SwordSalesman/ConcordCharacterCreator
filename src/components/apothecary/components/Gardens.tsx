import { HERB_IDS, HerbId } from "../gameData";
import { useContext, useState } from "react";
import HerbPatch from "./HerbPatch";
import { DragDropProvider, DragOverlay, PointerSensor } from "@dnd-kit/react";
import { Feedback, PointerActivationConstraints } from "@dnd-kit/dom";
import { GameContext } from "../gameContext";
import { GiFarmer } from "react-icons/gi";

export function Gardens() {
	const { farmerAssignments, setFarmerHerbAssignment } = useContext(GameContext);

	const [draggedId, setDraggedId] = useState<string | null>(null);
	const [dragOverId, setDragOverId] = useState<string | null>(null);

	return (
		<DragDropProvider
			sensors={[
				PointerSensor.configure({
					activationConstraints: (event) => {
						if (event.pointerType === "touch") {
							return [
								new PointerActivationConstraints.Delay({ value: 0, tolerance: 4 }),
							];
						}

						return [new PointerActivationConstraints.Distance({ value: 4 })];
					},
				}),
			]}
			plugins={(defaults) => [...defaults, Feedback.configure({ dropAnimation: null })]}
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
			<div className="grid grid-cols-2 gap-1 sm:grid-cols-3 select-none">
				{HERB_IDS.map((herbId) => (
					<HerbPatch key={herbId} herbId={herbId} dragOverId={dragOverId} />
				))}
				{HERB_IDS.length % 2 === 1 ? <div className="flex-1"></div> : null}
			</div>
			<DragOverlay
				dropAnimation={null}
				className="absolute left-0 top-0 pointer-events-none z-50"
			>
				{(source) => {
					const sourceId = source?.id?.toString();
					if (!sourceId?.startsWith("farmer:")) {
						return null;
					}

					return (
						<div className="animate-quick-fade-in">
							<div
								className={`p-0 w-24 h-24 sm:h-14 sm:w-14 rounded-sm animate-wiggle duration-200 flex justify-center items-center select-none pointer-events-none`}
							>
								<GiFarmer size={90} />
							</div>
						</div>
					);
				}}
			</DragOverlay>
		</DragDropProvider>
	);
}

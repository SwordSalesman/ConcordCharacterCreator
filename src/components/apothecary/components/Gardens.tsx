import { HERB_IDS, HerbId } from "../gameData";
import { useContext, useMemo, useState } from "react";
import HerbPatch from "./HerbPatch";
import { DragDropProvider, DragOverlay, PointerSensor } from "@dnd-kit/react";
import { Feedback, PointerActivationConstraints } from "@dnd-kit/dom";
import { GameContext } from "../gameContext";
import { GiFarmer } from "react-icons/gi";
import { GardensMenu } from "./GardensMenu";
import { Button } from "@/components/common/Button/Button";
import { BiPlusCircle } from "react-icons/bi";

export function Gardens() {
	const { farmerAssignments, setFarmerHerbAssignment, unlockedHerbs } = useContext(GameContext);

	const [draggedId, setDraggedId] = useState<string | null>(null);
	const [dragOverId, setDragOverId] = useState<string | null>(null);
	const [showGardensMenu, setShowGardensMenu] = useState(false);

	const allHerbCount = HERB_IDS.length;
	const unlockedHerbCount = HERB_IDS.filter((herbId) => unlockedHerbs[herbId]).length;
	const showAddHerbButton = unlockedHerbCount < allHerbCount;

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
				{HERB_IDS.map((herbId) =>
					unlockedHerbs[herbId] ? (
						<HerbPatch key={herbId} herbId={herbId} dragOverId={dragOverId} />
					) : null,
				)}
				{showAddHerbButton ? (
					<div
						className={
							`flex min-h-24 items-center justify-center ${unlockedHerbCount % 2 === 0 ? "col-span-2 sm:col-span-1" : "col-span-1"}`
							// + "my-2 h-[100px] mt-5 mx-4 border-1 border-dashed rounded-md border-border"
						}
					>
						<Button
							className="opacity-80 hover:opacity-100"
							onClick={() => setShowGardensMenu(true)}
							variant="outline"
						>
							<BiPlusCircle size={60} />
							Build Garden
						</Button>
					</div>
				) : null}
			</div>
			<GardensMenu open={showGardensMenu} onClose={() => setShowGardensMenu(false)} />
			<DragOverlay dropAnimation={null} className="pointer-events-none">
				{(source) => {
					const sourceId = source?.id?.toString();
					if (!sourceId?.startsWith("farmer:")) {
						return null;
					}

					return (
						<div className="animate-quick-fade-in z-50">
							<div
								className={`p-0 relative w-24 h-24 sm:h-14 sm:w-14 rounded-sm  duration-200 flex justify-center items-center select-none pointer-events-none`}
							>
								<div className="hidden sm:inline animate-wiggle">
									<GiFarmer size={60} />
								</div>
								<div className="inline sm:hidden absolute top-[-50px] left-[-40px] animate-wiggle animate-quick-fade-in">
									<GiFarmer size={90} />
								</div>
							</div>
						</div>
					);
				}}
			</DragOverlay>
		</DragDropProvider>
	);
}

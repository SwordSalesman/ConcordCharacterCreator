import { useContext } from "react";
import { HerbId, HERBS } from "../data/gameData";
import { GameContext } from "../../context/gameContext";
import { useApothecaryAnimation } from "../../context/animationContext";
import { displayNumber } from "../../helpers/numberHelper";
import { GiFarmer } from "react-icons/gi";
import { useDraggable, useDroppable } from "@dnd-kit/react";
import { TutorialContext } from "../../context/tutorialContext";
import { NewWrapper } from "../NewWrapper";

export default function HerbPatch({
	herbId,
	dragOverId,
}: {
	herbId: HerbId;
	dragOverId: string | null;
}) {
	const { herbs, farmerAssignments, gatherHerb } = useContext(GameContext);
	const { tutorialSettings, newComponents, setComponentStale } = useContext(TutorialContext);
	const showFarmers = tutorialSettings.showWorkers;

	const hasFarmers = farmerAssignments[herbId] > 0;

	const { registerAnchor } = useApothecaryAnimation();
	const { ref: droppableRef } = useDroppable({ id: `herb:${herbId}` });
	const { ref: draggableRef } = useDraggable({
		id: `farmer:${herbId}`,
		disabled: !hasFarmers,
	});

	const draggedOver = dragOverId === `herb:${herbId}`;

	return (
		<span
			className={`relative flex flex-1 flex-col items-center justify-center ${showFarmers ? "mt-5" : "mt-0"} mb-0 duration-100 select-none ${draggedOver ? "scale-105" : ""}`}
			ref={droppableRef}
		>
			<button
				ref={registerAnchor(`herb:${herbId}`)}
				onClick={() => gatherHerb(herbId, 1)}
				className={`flex items-center flex-col rounded-md border border-border bg-background p-2 ${showFarmers ? "pt-6" : "pt-2"} cursor-pointer hover:bg-accent dark:hover:bg-input/50 active:bg-accent dark:active:bg-input/50 min-w-34 w-full h-30 relative justify-center align-middle duration-100 hover:scale-103 active:scale-95`}
			>
				<div className="flex justify-center items-center gap-2">
					<span className="text-2xl">{HERBS[herbId].emoji}</span>
					<span className="text-sm text-muted-foreground">
						{displayNumber(herbs[herbId])}
					</span>
				</div>
				<span className="text-sm">{HERBS[herbId].name}</span>
			</button>
			<div
				ref={draggableRef}
				className={`${showFarmers ? "" : "hidden"} absolute top-[-18px] w-18 h-12 bg-background border-1 rounded-md duration-100 touch-none select-none ${hasFarmers ? "cursor-grab hover:scale-105 hover:bg-background-raised" : ""}`}
			>
				<div className=" w-full h-full flex justify-center gap-1 items-center p-1 touch-none">
					<div
						className={`p-0 bg-transparent w-6 h-6 rounded-sm flex justify-center items-center`}
					>
						<GiFarmer size={30} />
					</div>
					<NewWrapper isNew={newComponents.farmer && herbId === "GS"}>
						<div className="text-muted-foreground text-md">
							{displayNumber(farmerAssignments[herbId])}
						</div>
					</NewWrapper>
				</div>
			</div>
		</span>
	);
}

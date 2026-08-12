import { useContext, useEffect, useRef } from "react";
import { HERB_IDS, HerbId, HERBS } from "../gameData";
import { GameContext } from "../gameContext";
import { useApothecaryAnimation } from "../animationContext";
import { displayNumber } from "../helpers/numberHelper";
import { GiFarmer } from "react-icons/gi";
import { useDraggable, useDroppable } from "@dnd-kit/react";

export default function HerbPatch({
	herbId,
	draggedId,
	dragOverId,
}: {
	herbId: HerbId;
	draggedId: string | null;
	dragOverId: string | null;
}) {
	const { herbs, farmerAssignments, gatherHerb } = useContext(GameContext);

	const hasFarmers = farmerAssignments[herbId] > 0;

	const { registerAnchor } = useApothecaryAnimation();
	const { ref: droppableRef } = useDroppable({ id: `herb:${herbId}` });
	const { ref: draggableRef } = useDraggable({
		id: `farmer:${herbId}`,
		disabled: !hasFarmers,
	});

	const dragged = draggedId === `farmer:${herbId}`;
	const draggedOver = dragOverId === `herb:${herbId}`;

	return (
		<span
			className={`relative flex flex-1 flex-col items-center justify-center mt-4 mb-2 duration-100 ${draggedOver ? "scale-105" : ""}`}
			ref={droppableRef}
		>
			<button
				ref={registerAnchor(`herb:${herbId}`)}
				onClick={() => gatherHerb(herbId, 1)}
				className="flex  items-center flex-col rounded-md border border-border bg-background p-2 pt-6 cursor-pointer hover:bg-background-raised min-w-36 w-full h-30 relative justify-center align-middle duration-100 hover:scale-105 active:scale-95"
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
				className={`absolute top-[-18px] w-18 h-12 bg-background border-1 rounded-md duration-100 ${hasFarmers ? "cursor-pointer hover:scale-105 active:scale-95 hover:bg-background-raised" : ""}`}
			>
				<div className="relative w-full h-full flex justify-center gap-1 items-center p-1">
					<div
						className={`p-0 bg-transparent w-6 h-6 rounded-sm flex justify-center items-center`}
					>
						<GiFarmer size={30} />
					</div>
					<div className="text-muted-foreground text-sm">
						{displayNumber(farmerAssignments[herbId])}
					</div>
					<div
						ref={draggableRef}
						className={`absolute overflow-hidden ${dragged ? "opacity-100" : "opacity-0"}`}
					>
						<div className="p-0 bg-transparent w-12 h-12 rounded-sm animate-wiggle flex justify-center items-center">
							<GiFarmer size={50} />
						</div>
					</div>
				</div>
			</div>
		</span>
	);
}

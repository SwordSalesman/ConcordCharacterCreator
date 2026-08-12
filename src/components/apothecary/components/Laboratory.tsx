import { useContext } from "react";
import {
	useSensor,
	useSensors,
	PointerSensor,
	KeyboardSensor,
	DndContext,
	closestCenter,
	type DragEndEvent,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
	arrayMove,
} from "@dnd-kit/sortable";
import { GameContext } from "./../gameContext";
import { HERB_IDS, HERBS, POTION_IDS, POTIONS, type PotionId } from "../gameData";
import { Button } from "../../common/Button/Button";
import { useApothecaryAnimation } from "../animationContext";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { MdReorder } from "react-icons/md";

function SortablePotionCraftButton({
	potionId,
	isActivePreference,
	isCraftable,
	onCraft,
	anchorRef,
}: {
	potionId: PotionId;
	isActivePreference: boolean;
	isCraftable: boolean;
	onCraft: (potionId: PotionId) => void;
	anchorRef: ReturnType<ReturnType<typeof useApothecaryAnimation>["registerAnchor"]>;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: potionId,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		cursor: "grab",
	};

	return (
		<div ref={setNodeRef} {...attributes} style={style}>
			<Button
				ref={anchorRef}
				onClick={() => {
					isCraftable && onCraft(potionId);
				}}
				className="w-full flex justify-between duration-100 hover:scale-103 active:scale-98"
			>
				<div className="flex items-center gap-2">
					<div className="rounded-xs p-0.5 cursor-move" {...listeners}>
						<MdReorder className="size-5" />
					</div>
					<span className={isCraftable ? "" : "opacity-50"}>
						{POTIONS[potionId].name}
					</span>
				</div>
				{!isActivePreference && " ❌"}
				<p>
					{Object.entries(POTIONS[potionId].recipe).map(([herbId, amount]) => (
						<span key={herbId} className={isCraftable ? "" : "opacity-50"}>
							{HERBS[herbId as (typeof HERB_IDS)[number]].emoji.repeat(amount)}{" "}
						</span>
					))}
				</p>
			</Button>
		</div>
	);
}

export function Laboratory() {
	const { apothecaryPreferences, setApothecaryPotionOrder, craftPotion, canCraftPotion } =
		useContext(GameContext);
	const { registerAnchor } = useApothecaryAnimation();
	const craftAnchor = (potionId: PotionId) => registerAnchor(`craft:${potionId}`);

	const displayedPotionIds = [
		...apothecaryPreferences,
		...POTION_IDS.filter((potionId) => !apothecaryPreferences.includes(potionId)),
	];

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) {
			return;
		}

		const oldIndex = displayedPotionIds.indexOf(active.id as PotionId);
		const newIndex = displayedPotionIds.indexOf(over.id as PotionId);
		if (oldIndex === -1 || newIndex === -1) {
			return;
		}

		setApothecaryPotionOrder(arrayMove(displayedPotionIds, oldIndex, newIndex));
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
			modifiers={[restrictToVerticalAxis, restrictToParentElement]}
		>
			<SortableContext items={displayedPotionIds} strategy={verticalListSortingStrategy}>
				<div className="flex gap-1 flex-col flex-wrap">
					{displayedPotionIds.map((potionId) => {
						const isActivePreference = apothecaryPreferences.indexOf(potionId) !== -1;
						return (
							<SortablePotionCraftButton
								key={potionId}
								potionId={potionId}
								isActivePreference={isActivePreference}
								isCraftable={canCraftPotion(potionId)}
								onCraft={(id) => craftPotion(id, 1)}
								anchorRef={craftAnchor(potionId)}
							/>
						);
					})}
				</div>
			</SortableContext>
		</DndContext>
	);
}

import { useContext, useState } from "react";
import {
	useSensor,
	useSensors,
	MouseSensor,
	TouchSensor,
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
import { GameContext } from "../../context/gameContext";
import { HERB_IDS, HERBS, POTION_IDS, POTIONS, type PotionId } from "../data/gameData";
import { Button } from "../../../common/Button/Button";
import { useApothecaryAnimation } from "../../context/animationContext";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { MdReorder } from "react-icons/md";
import { PotionsMenu } from "./PotionsMenu";
import { TutorialContext } from "../../context/tutorialContext";
import { GiSpellBook } from "react-icons/gi";

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
	};

	return (
		<div ref={setNodeRef} {...attributes} style={style} className="flex gap-0.5 items-center">
			<div className="rounded-xs p-0.5 cursor-move" {...listeners}>
				<MdReorder className="size-5" />
			</div>
			<Button
				ref={anchorRef}
				onClick={() => {
					isCraftable && onCraft(potionId);
				}}
				className="flex-1 flex flex-wrap justify-between duration-100 hover:scale-103 active:scale-98 select-none h-fit min-h-9"
				disabled={!isCraftable}
			>
				<div className="flex items-center gap-2">{POTIONS[potionId].name}</div>
				{/* {!isActivePreference && " ❌"} */}
				<p className="ml-auto">
					{Object.entries(POTIONS[potionId].recipe).map(([herbId, amount]) => (
						<span key={herbId}>
							{HERBS[herbId as (typeof HERB_IDS)[number]].emoji.repeat(amount)}{" "}
						</span>
					))}
				</p>
			</Button>
		</div>
	);
}

export function Laboratory() {
	const {
		apothecaryPreferences,
		setApothecaryPotionOrder,
		craftPotion,
		canCraftPotion,
		unlockedPotions,
	} = useContext(GameContext);
	const { registerAnchor } = useApothecaryAnimation();
	const craftAnchor = (potionId: PotionId) => registerAnchor(`craft:${potionId}`);
	const [showPotionsMenu, setShowPotionsMenu] = useState(false);
	const { tutorialSettings } = useContext(TutorialContext);

	const displayedPotionIds = [
		...apothecaryPreferences.filter((potionId) => unlockedPotions[potionId]),
		...POTION_IDS.filter((potionId) => unlockedPotions[potionId]).filter(
			(potionId) => !apothecaryPreferences.includes(potionId),
		),
	];

	const totalPotionTypes = POTION_IDS.length;
	const unlockedPotionCount = POTION_IDS.filter((potionId) => unlockedPotions[potionId]).length;
	const showAddPotionButton =
		unlockedPotionCount < totalPotionTypes && tutorialSettings.showUnlocks;

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: { distance: 4 },
		}),
		useSensor(TouchSensor, {
			activationConstraint: { delay: 0, tolerance: 8 },
		}),
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
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				modifiers={[restrictToVerticalAxis, restrictToParentElement]}
			>
				<SortableContext items={displayedPotionIds} strategy={verticalListSortingStrategy}>
					<div className="flex gap-1 flex-col flex-wrap">
						{displayedPotionIds.map((potionId) => {
							const isActivePreference =
								apothecaryPreferences.indexOf(potionId) !== -1;
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
					{showAddPotionButton ? (
						<div className="flex justify-center p-1 mt-2 animate-in fade-in">
							<Button
								className="opacity-80 hover:opacity-100"
								onClick={() => setShowPotionsMenu(true)}
								variant="outline"
							>
								<GiSpellBook size={60} />
								Learn Recipe
							</Button>
						</div>
					) : null}
				</SortableContext>
			</DndContext>
			<PotionsMenu open={showPotionsMenu} onClose={() => setShowPotionsMenu(false)} />
		</>
	);
}

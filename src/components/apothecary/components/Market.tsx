import { POTION_IDS, PotionId, POTIONS } from "../gameData";
import { Button } from "../../common/Button/Button";
import { useContext } from "react";
import { GameContext } from "../gameContext";
import { useApothecaryAnimation } from "../animationContext";
import { displayNumber } from "../helpers/numberHelper";

export function Market() {
	const { canSellPotion, sellPotion, potions } = useContext(GameContext);
	const { registerAnchor } = useApothecaryAnimation();
	const sellAnchor = (potionId: PotionId) => registerAnchor(`sell:${potionId}`);

	return (
		<div className="grid grid-cols-2 gap-1 flex-wrap">
			{POTION_IDS.map((potionId) => (
				<Button
					key={potionId}
					ref={sellAnchor(potionId)}
					onClick={() => {
						canSellPotion(potionId) && sellPotion(potionId, 1);
					}}
					className="w-full flex justify-between duration-100 hover:scale-103 active:scale-98"
				>
					<div
						className={(canSellPotion(potionId) ? "" : "opacity-50") + " flex gap-1.5"}
					>
						<span>{POTIONS[potionId].name}</span>
						<span className="text-muted-foreground">
							{displayNumber(potions[potionId])}
						</span>
					</div>
					<div className={canSellPotion(potionId) ? "" : "opacity-50"}>
						{displayNumber(POTIONS[potionId].sellValue)} 🗝️
					</div>
				</Button>
			))}
		</div>
	);
}

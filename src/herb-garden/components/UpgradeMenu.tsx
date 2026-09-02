import { Button } from "@/components/common/Button/Button";
import { Modal } from "@/components/common/Modal/Modal";
import { useContext } from "react";
import { type BuildingId, UPGRADES } from "./data/upgrades";
import { GameContext } from "../context/gameContext";
import { displayNumber } from "../helpers/numberHelper";
import { MdCheckCircleOutline } from "react-icons/md";

export function AquiredItem({ name }: { name: string }) {
	return (
		<span
			className="text-muted-foreground italic text-sm flex items-center gap-1 px-2 animate-in fade-in duration-300"
			key={name}
		>
			{<MdCheckCircleOutline />} {name}
		</span>
	);
}

function getBuildingTitle(buildingId: BuildingId): string {
	switch (buildingId) {
		case "gardens":
			return "Gardens";
		case "laboratory":
			return "Laboratory";
		case "market":
			return "Market";
		case "tavern":
			return "Tavern";
		default:
			return buildingId;
	}
}

export function UpgradeMenu({
	open,
	onClose,
	buildingId,
	icon,
}: {
	open: boolean;
	onClose: () => void;
	buildingId: BuildingId;
	icon?: React.ReactNode;
}) {
	const {
		getBuildingUpgrades,
		upgradePrerequisitesMet,
		isUpgradePurchased,
		canPurchaseUpgrade,
		purchaseUpgrade,
	} = useContext(GameContext);

	const upgrades = getBuildingUpgrades(buildingId).filter((upgradeId) =>
		upgradePrerequisitesMet(upgradeId),
	);

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={
				<div className="text-center mt-1 flex gap-3 justify-center items-center">
					{icon ? <span className="">{icon}</span> : null}
					<span>Upgrade {getBuildingTitle(buildingId)}</span>
				</div>
			}
			body={
				<div className="flex flex-col gap-0">
					<div className="flex flex-wrap mb-2 justify-center z-2">
						{upgrades
							.filter((upgradeId) => isUpgradePurchased(upgradeId))
							.map((upgradeId) => (
								<AquiredItem
									name={UPGRADES[upgradeId].name}
									key={upgradeId + "-acquired"}
								/>
							))}
					</div>
					{upgrades
						.filter((upgradeId) => !isUpgradePurchased(upgradeId))
						.map((upgradeId) => (
							<div
								key={upgradeId + "-purchase"}
								className="flex items-center justify-center gap-0 animate-in fade-in z-10"
							>
								{isUpgradePurchased(upgradeId) ? (
									<span className="text-muted-foreground italic text-sm flex items-center gap-1">
										{<MdCheckCircleOutline />} {UPGRADES[upgradeId].name}
									</span>
								) : (
									<div className="my-1 w-full">
										<Button
											disabled={!canPurchaseUpgrade(upgradeId)}
											onClick={() => purchaseUpgrade(upgradeId)}
											// size="sm"
											className="p-2 text-md h-fit w-full"
										>
											{/* Purchase{" "} */}
											<span className="flex-1 text-left">
												<span className="flex gap-2 items-center justify-between">
													<p>{UPGRADES[upgradeId].name}</p>
													{displayNumber(UPGRADES[upgradeId].cost)} 🗝️
												</span>
												<p className="text-sm text-muted-foreground text-wrap">
													{UPGRADES[upgradeId].description}
												</p>
											</span>
										</Button>
									</div>
								)}
							</div>
						))}
				</div>
			}
		/>
	);
}

import { useContext, useState } from "react";
import ContentWrapper from "../layout/ContentWrapper";
import { GameContext } from "./context/gameContext";
import { TutorialContext } from "./context/tutorialContext";
import { getWorkerHireCost, HERB_IDS, WORKER_IDS, WORKERS } from "./components/data/gameData";
import { BuildingId } from "./components/data/upgrades";
import { Button } from "../common/Button/Button";
import { useApothecaryAnimation } from "./context/animationContext";
import { SectionWrapper } from "./components/SectionWrapper";
import { Laboratory } from "./components/laboratory/Laboratory";
import { Market } from "./components/market/Market";
import { FaBalanceScaleLeft, FaMortarPestle } from "react-icons/fa";
import { GiLockedChest } from "react-icons/gi";
import { PiPlantFill } from "react-icons/pi";
import { GiBeerStein } from "react-icons/gi";
import { displayNumber } from "./helpers/numberHelper";
import { Gardens } from "./components/gardens/Gardens";
import { ResourcesPanel } from "./components/ResourcesPanel";
import { Modal } from "../common/Modal/Modal";
import { MdSettings } from "react-icons/md";
import { GiStakeHammer } from "react-icons/gi";
import { UpgradeMenu } from "./components/UpgradeMenu";

export default function GameMain() {
	const {
		money,
		herbs,
		potions,
		workers,
		farmerAssignments,
		canHireWorker,
		hireWorker,
		resetGame,
	} = useContext(GameContext);
	const { active, toggleActive } = useApothecaryAnimation();
	const { tutorialSettings } = useContext(TutorialContext);
	const tutorialFadeIn = `animate-in fade-in ${tutorialSettings.showTutorial ?? "duration-1500"}`;

	const [showSettings, setShowSettings] = useState(false);
	const [showGardenUpgradeMenu, setShowGardenUpgradeMenu] = useState(false);
	const [showLabUpgradeMenu, setShowLabUpgradeMenu] = useState(false);
	const [showMarketUpgradeMenu, setShowMarketUpgradeMenu] = useState(false);
	const [showTavernUpgradeMenu, setShowTavernUpgradeMenu] = useState(false);

	const herbTotal = Object.values(herbs).reduce((sum, amount) => sum + amount, 0);
	const potionTotal = Object.values(potions).reduce((sum, amount) => sum + amount, 0);
	const assignedFarmers = HERB_IDS.reduce((sum, herbId) => sum + farmerAssignments[herbId], 0);
	const unassignedFarmers = Math.max(0, workers.farmers - assignedFarmers);

	function handleResetGame() {
		if (!window.confirm("Reset your save? This cannot be undone.")) {
			return;
		}
		resetGame();
	}

	function getUpgradeButton(buildingId: BuildingId) {
		return tutorialSettings.showUpgrades ? (
			<div className={tutorialFadeIn}>
				<Button
					onClick={() => {
						switch (buildingId) {
							case "gardens":
								setShowGardenUpgradeMenu(true);
								break;
							case "laboratory":
								setShowLabUpgradeMenu(true);
								break;
							case "market":
								setShowMarketUpgradeMenu(true);
								break;
							case "tavern":
								setShowTavernUpgradeMenu(true);
								break;
						}
					}}
					size="sm"
				>
					{/* <GiFlatHammer /> */}
					<GiStakeHammer />
					Upgrade
				</Button>
			</div>
		) : null;
	}

	return (
		<>
			<ContentWrapper layout="narrow">
				<div className="flex flex-col gap-6 p-1 pb-16">
					<div className="flex justify-between gap-2">
						<div className="text-lg font-bold text-muted-foreground font-mono">
							herb-garden
						</div>
						<Button onClick={() => setShowSettings(true)} size="sm" className="">
							<MdSettings />
						</Button>
					</div>
					<Modal
						open={showSettings}
						onClose={() => setShowSettings(false)}
						title="Settings"
						size="small"
						body={
							<div className="flex flex-col items-center gap-2">
								<div>
									<Button
										onClick={() => {
											toggleActive();
											setShowSettings(false);
										}}
									>
										Animations {active ? "ON" : "OFF"}
									</Button>
								</div>
								<div>
									<Button
										onClick={() => {
											handleResetGame();
											setShowSettings(false);
										}}
										variant="destructive"
									>
										Reset Game
									</Button>
								</div>
							</div>
						}
					/>

					<div className="mb-[-22px]">
						<SectionWrapper title="Resources" icon={<GiLockedChest />} />
					</div>
					<ResourcesPanel money={money} herbTotal={herbTotal} potionTotal={potionTotal} />

					<SectionWrapper
						title="Gardens"
						subtitle={
							tutorialSettings.showWorkers
								? `${workers.farmers} Farmer${workers.farmers !== 1 ? "s" : ""}${unassignedFarmers > 0 ? ` (${unassignedFarmers} unassigned)` : ""}. Drag farmers to reassign them.`
								: "Click to harvest herbs"
						}
						icon={<PiPlantFill />}
						action={getUpgradeButton("gardens")}
					>
						<Gardens />
					</SectionWrapper>

					<SectionWrapper
						title="Laboratory"
						subtitle={
							tutorialSettings.showWorkers
								? `${workers.apothecaries} Apothecar${workers.apothecaries !== 1 ? "ies" : "y"}. Order potions by crafting preference.`
								: "Click to brew potions."
						}
						icon={<FaMortarPestle />}
						hide={!tutorialSettings.showLab}
						action={getUpgradeButton("laboratory")}
					>
						<Laboratory />
					</SectionWrapper>

					<SectionWrapper
						title="Market"
						subtitle={
							tutorialSettings.showWorkers
								? `${workers.merchants} Merchant${workers.merchants !== 1 ? "s" : ""}. Most expensive potions are sold first.`
								: "Click to sell potions."
						}
						icon={<FaBalanceScaleLeft />}
						hide={!tutorialSettings.showMarket}
						action={getUpgradeButton("market")}
					>
						<Market />
					</SectionWrapper>

					<SectionWrapper
						title="Tavern"
						subtitle="Hire workers to help your operation."
						icon={<GiBeerStein />}
						hide={!tutorialSettings.showTavern}
						action={getUpgradeButton("tavern")}
					>
						<div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
							{WORKER_IDS.map((workerId) => (
								<Button
									key={workerId}
									onClick={() => hireWorker(workerId, 1)}
									disabled={!canHireWorker(workerId)}
									className="flex flex-1 justify-between duration-100 hover:scale-103 active:scale-98"
								>
									<div className={canHireWorker(workerId) ? "" : "opacity-50"}>
										{WORKERS[workerId].singularName}
									</div>
									<div className={canHireWorker(workerId) ? "" : "opacity-50"}>
										{displayNumber(
											getWorkerHireCost(workerId, workers[workerId]),
										)}{" "}
										🗝️
									</div>
								</Button>
							))}
						</div>
					</SectionWrapper>

					<UpgradeMenu
						open={showGardenUpgradeMenu}
						onClose={() => setShowGardenUpgradeMenu(false)}
						buildingId="gardens"
						icon={<PiPlantFill size={24} />}
					/>
					<UpgradeMenu
						open={showLabUpgradeMenu}
						onClose={() => setShowLabUpgradeMenu(false)}
						buildingId="laboratory"
						icon={<FaMortarPestle size={24} />}
					/>
					<UpgradeMenu
						open={showMarketUpgradeMenu}
						onClose={() => setShowMarketUpgradeMenu(false)}
						buildingId="market"
						icon={<FaBalanceScaleLeft size={24} />}
					/>
					<UpgradeMenu
						open={showTavernUpgradeMenu}
						onClose={() => setShowTavernUpgradeMenu(false)}
						buildingId="tavern"
						icon={<GiBeerStein size={24} />}
					/>
				</div>
			</ContentWrapper>
		</>
	);
}

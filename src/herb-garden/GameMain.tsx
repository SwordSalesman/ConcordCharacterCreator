import { useContext, useEffect, useState } from "react";
import ContentWrapper from "../components/layout/ContentWrapper";
import { GameContext } from "./context/gameContext";
import { TutorialContext } from "./context/tutorialContext";
import { HERB_IDS } from "./components/data/herbs";
import { getWorkerHireCost, WORKER_IDS, WORKERS } from "./components/data/workers";
import { BuildingId } from "./components/data/upgrades";
import { Button } from "../components/common/Button/Button";
import { useAnimation } from "./context/animationContext";
import { SectionWrapper } from "./components/SectionWrapper";
import { Laboratory } from "./components/laboratory/Laboratory";
import { Market } from "./components/market/Market";
import { FaBalanceScaleLeft, FaMortarPestle } from "react-icons/fa";
import { GiLockedChest, GiConcentrationOrb } from "react-icons/gi";
import { PiPlantFill } from "react-icons/pi";
import { GiBeerStein } from "react-icons/gi";
import { displayNumber, displayTimer } from "./helpers/displayValueHelper";
import { Gardens } from "./components/gardens/Gardens";
import { ResourcesPanel } from "./components/ResourcesPanel";
import { Modal } from "../components/common/Modal/Modal";
import { MdSettings } from "react-icons/md";
import { GiStakeHammer } from "react-icons/gi";
import { UpgradeMenu } from "./components/UpgradeMenu";
import { NewWrapper } from "./components/NewWrapper";
import Church from "./components/church/Church";
import { WinScreen } from "./components/WinScreen";
import { GiCrown } from "react-icons/gi";

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
		isUpgradePurchased,
		crystalMana,
		throneTimeMs,
		elapsedPlayTimeMs,
	} = useContext(GameContext);
	const { active, toggleActive } = useAnimation();
	const {
		tutorialSettings,
		newComponents,
		setComponentStale,
		winScreenSeen,
		markWinScreenSeen,
		resetTutorial,
	} = useContext(TutorialContext);
	const tutorialFadeIn = `animate-in fade-in ${tutorialSettings.showTutorial ?? "duration-1500"}`;
	const demandSelling = isUpgradePurchased("market.demand_selling");
	const churchUnlocked = isUpgradePurchased("tavern.church");
	const hasWonGame = throneTimeMs !== null;

	const [showSettings, setShowSettings] = useState(false);
	const [showGardenUpgradeMenu, setShowGardenUpgradeMenu] = useState(false);
	const [showLabUpgradeMenu, setShowLabUpgradeMenu] = useState(false);
	const [showMarketUpgradeMenu, setShowMarketUpgradeMenu] = useState(false);
	const [showTavernUpgradeMenu, setShowTavernUpgradeMenu] = useState(false);
	const [showWinScreen, setShowWinScreen] = useState(false);

	useEffect(() => {
		if (hasWonGame && !winScreenSeen) {
			setShowWinScreen(true);
		}
	}, [hasWonGame, winScreenSeen]);

	function handleCloseWinScreen() {
		setShowWinScreen(false);
		markWinScreenSeen();
	}

	const herbTotal = Object.values(herbs).reduce((sum, amount) => sum + amount, 0);
	const potionTotal = Object.values(potions).reduce((sum, amount) => sum + amount, 0);
	const assignedFarmers = HERB_IDS.reduce((sum, herbId) => sum + farmerAssignments[herbId], 0);
	const unassignedFarmers = Math.max(0, workers.farmers - assignedFarmers);
	const unlockedWorkerIds = WORKER_IDS.filter((id) => id !== "priests" || churchUnlocked);

	function handleResetGame() {
		if (!window.confirm("Reset your save? This cannot be undone.")) {
			return;
		}
		resetGame();
		resetTutorial();
	}

	function getUpgradeButton(buildingId: BuildingId) {
		let action = () => {};
		let isNew = false;
		switch (buildingId) {
			case "gardens":
				action = () => {
					setShowGardenUpgradeMenu(true);
					setComponentStale("upgradeGarden");
				};
				isNew = newComponents.upgradeGarden;
				break;
			case "laboratory":
				action = () => {
					setShowLabUpgradeMenu(true);
					setComponentStale("upgradeLaboratory");
				};
				isNew = newComponents.upgradeLaboratory;
				break;
			case "market":
				action = () => {
					setShowMarketUpgradeMenu(true);
					setComponentStale("upgradeMarket");
				};
				isNew = newComponents.upgradeMarket;
				break;
			case "tavern":
				action = () => {
					setShowTavernUpgradeMenu(true);
					setComponentStale("upgradeTavern");
				};
				isNew = newComponents.upgradeTavern;
				break;
		}

		return tutorialSettings.showUpgrades ? (
			<NewWrapper isNew={isNew}>
				<div className={tutorialFadeIn}>
					<Button onClick={action} size="sm">
						<GiStakeHammer />
						Upgrade
					</Button>
				</div>
			</NewWrapper>
		) : null;
	}

	const gameTime = (
		<div className="font-mono text-sm pt-0.5 text-muted-foreground">
			{displayTimer(throneTimeMs ?? elapsedPlayTimeMs)}
		</div>
	);

	return (
		<>
			<ContentWrapper layout="narrow">
				<div className="flex flex-col gap-8 p-1 pb-20">
					<div className="flex justify-between gap-2">
						<div className="text-lg font-bold text-muted-foreground font-mono">
							herb-garden
						</div>
						<div className="flex gap-2 items-center">
							{hasWonGame ? (
								<Button
									onClick={() => setShowWinScreen(true)}
									size="sm"
									className=""
								>
									<GiCrown className="size-6" />
									{gameTime}
								</Button>
							) : (
								gameTime
							)}
							<Button onClick={() => setShowSettings(true)} size="sm" className="">
								<MdSettings />
							</Button>
						</div>
					</div>
					<WinScreen
						open={showWinScreen}
						onClose={handleCloseWinScreen}
						throneTimeMs={throneTimeMs}
						resetGame={handleResetGame}
					/>

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
					<ResourcesPanel
						money={money}
						herbTotal={herbTotal}
						potionTotal={potionTotal}
						manaTotal={crystalMana}
						showCrystalMana={churchUnlocked}
					/>

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
								? `${workers.merchants} Merchant${workers.merchants !== 1 ? "s" : ""}. ${demandSelling ? "Highest demand" : "Most expensive"} potions are sold first.`
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
							{unlockedWorkerIds.map((workerId) => (
								<Button
									key={workerId}
									onClick={() => hireWorker(workerId, 1)}
									disabled={!canHireWorker(workerId)}
									className="flex flex-1 justify-between duration-100 hover:scale-103 active:scale-98"
								>
									<div className={canHireWorker(workerId) ? "" : "opacity-50"}>
										{WORKERS[workerId].singularName}
									</div>
									<NewWrapper
										isNew={
											tutorialSettings.showTutorial && workers[workerId] === 0
										}
									>
										<div
											className={
												"flex gap-1 font-mono" +
												(canHireWorker(workerId) ? "" : " opacity-50")
											}
										>
											<span>
												{displayNumber(
													getWorkerHireCost(workerId, workers[workerId]),
												)}
											</span>
											<span>🗝️</span>
										</div>
									</NewWrapper>
								</Button>
							))}
						</div>
					</SectionWrapper>

					<SectionWrapper
						title="Sanctified Square"
						subtitle={`${workers.priests} Priest${workers.priests !== 1 ? "s" : ""} making crystal mana, used to cast ceremonies.`}
						icon={<GiConcentrationOrb />}
						hide={!churchUnlocked}
					>
						<Church />
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

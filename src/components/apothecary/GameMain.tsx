import { useContext, useEffect, useRef, useState } from "react";
import ContentWrapper from "../layout/ContentWrapper";
import { GameContext } from "./gameContext";
import { getWorkerHireCost, HERB_IDS, WORKER_IDS, WORKERS } from "./gameData";
import { Button } from "../common/Button/Button";
import { useApothecaryAnimation } from "./animationContext";
import { SectionWrapper } from "./components/SectionWrapper";
import { Laboratory } from "./components/Laboratory";
import { Market } from "./components/Market";
import { FaBalanceScaleLeft, FaMortarPestle } from "react-icons/fa";
import { GiLockedChest } from "react-icons/gi";
import { PiPlantFill } from "react-icons/pi";
import { GiBeerStein } from "react-icons/gi";
import { displayNumber } from "./helpers/numberHelper";
import { Gardens } from "./components/Gardens";
import { ResourcesPanel } from "./components/ResourcesPanel";
import { Modal } from "../common/Modal/Modal";
import { MdSettings } from "react-icons/md";

const TUTORIAL_MODE = true;

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

	const [showLab, setShowLab] = useState(false);
	const [showMarket, setShowMarket] = useState(false);
	const [showTavern, setShowTavern] = useState(false);
	const [showSettings, setShowSettings] = useState(false);

	const assignedFarmers = HERB_IDS.reduce((sum, herbId) => sum + farmerAssignments[herbId], 0);
	const unassignedFarmers = Math.max(0, workers.farmers - assignedFarmers);
	const herbTotal = Object.values(herbs).reduce((sum, amount) => sum + amount, 0);
	const potionTotal = Object.values(potions).reduce((sum, amount) => sum + amount, 0);

	function handleResetGame() {
		if (!window.confirm("Reset your save? This cannot be undone.")) {
			return;
		}
		resetGame();
	}

	useEffect(() => {
		if (herbTotal > 0 && !showLab) {
			setShowLab(true);
		}
		if (potionTotal > 0 && !showMarket) {
			setShowMarket(true);
		}
		if (money > 0 && !showTavern) {
			setShowTavern(true);
		}
	}, [herbTotal, potionTotal, money]);

	return (
		<>
			<ContentWrapper layout="narrow">
				<div className="flex flex-col gap-6 p-1 pb-16">
					<div className="flex justify-end gap-2">
						<Button onClick={() => setShowSettings(true)} size="icon" className="">
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
									<Button onClick={toggleActive}>
										Animations {active ? "ON" : "OFF"}
									</Button>
								</div>
								<div>
									<Button onClick={handleResetGame} variant="destructive">
										Reset Game
									</Button>
								</div>
							</div>
						}
					/>

					<SectionWrapper
						title="Resources"
						icon={<GiLockedChest />}
						className="mb-[-16px]"
					/>
					<ResourcesPanel money={money} herbTotal={herbTotal} potionTotal={potionTotal} />

					<SectionWrapper
						title="Gardens"
						subtitle={`${workers.farmers} Farmer${workers.farmers !== 1 ? "s" : ""}${unassignedFarmers > 0 ? ` (${unassignedFarmers} unassigned)` : ""}. Drag farmers to reassign them.`}
						icon={<PiPlantFill />}
					>
						<Gardens />
					</SectionWrapper>

					<SectionWrapper
						title="Laboratory"
						subtitle={`${workers.apothecaries} Apothecar${workers.apothecaries !== 1 ? "ies" : "y"}. Order potions by crafting preference.`}
						icon={<FaMortarPestle />}
						hide={TUTORIAL_MODE && !showLab}
					>
						<Laboratory />
					</SectionWrapper>

					<SectionWrapper
						title="Market"
						subtitle={`${workers.merchants} Merchant${workers.merchants !== 1 ? "s" : ""}. Most expensive potions are sold first.`}
						icon={<FaBalanceScaleLeft />}
						hide={TUTORIAL_MODE && !showMarket}
					>
						<Market />
					</SectionWrapper>

					<SectionWrapper
						title="Tavern"
						subtitle="Hire workers to help your operation."
						icon={<GiBeerStein />}
						hide={TUTORIAL_MODE && !showTavern}
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
				</div>
			</ContentWrapper>
		</>
	);
}

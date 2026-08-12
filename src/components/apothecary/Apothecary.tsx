import { useContext } from "react";
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

export default function Apothecary() {
	const { money, herbs, potions, workers, farmerAssignments, canHireWorker, hireWorker } =
		useContext(GameContext);
	const { active, toggleActive } = useApothecaryAnimation();

	const assignedFarmers = HERB_IDS.reduce((sum, herbId) => sum + farmerAssignments[herbId], 0);
	const unassignedFarmers = Math.max(0, workers.farmers - assignedFarmers);

	function renderedResource({
		emoji,
		name,
		amount,
	}: {
		emoji: string;
		name: string;
		amount: number;
	}) {
		return (
			<div className="relative flex gap-1.5 border-1 rounded-md p-1 px-2 pb-4 flex-1 justify-center items-center mb-4">
				<div className="flex gap-1.5">
					<span>{emoji}</span>
					<span>{name}</span>
				</div>
				<div className="absolute text-muted-foreground bg-background rounded-md border-1 px-2 min-w-14 h-7 flex justify-center items-center bottom-[-14px]">
					{displayNumber(amount)}
				</div>
			</div>
		);
	}

	return (
		<ContentWrapper layout="narrow">
			<div className="flex flex-col gap-5">
				<div className="flex w-full justify-end">
					<Button onClick={toggleActive} size="sm">
						Animations {active ? "ON" : "OFF"}
					</Button>
				</div>

				<SectionWrapper title="Resources" icon={<GiLockedChest />}>
					<div className="flex gap-1 flex-wrap ">
						{renderedResource({ emoji: "🗝️", name: "Keys", amount: money })}
						{renderedResource({
							emoji: "🌿",
							name: "Herbs",
							amount: Object.values(herbs).reduce((sum, amount) => sum + amount, 0),
						})}
						{renderedResource({
							emoji: "⚗️",
							name: "Potions",
							amount: Object.values(potions).reduce((sum, amount) => sum + amount, 0),
						})}
						{renderedResource({ emoji: "🪵", name: "Thunderoak", amount: 0 })}
					</div>
				</SectionWrapper>

				<SectionWrapper
					title="Gardens"
					subtitle={`${workers.farmers} Farmer${workers.farmers !== 1 ? "s" : ""}${unassignedFarmers > 0 ? ` (${unassignedFarmers} unassigned)` : ""}`}
					icon={<PiPlantFill />}
				>
					<Gardens />
				</SectionWrapper>

				<SectionWrapper
					title="Laboratory"
					subtitle={`${workers.apothecaries} Apothecar${workers.apothecaries !== 1 ? "ies" : "y"}. Order potions by crafting preference.`}
					icon={<FaMortarPestle />}
				>
					<Laboratory />
				</SectionWrapper>

				<SectionWrapper
					title="Market"
					subtitle={`${workers.merchants} Merchant${workers.merchants !== 1 ? "s" : ""}. Most expensive potions are sold first.`}
					icon={<FaBalanceScaleLeft />}
				>
					<Market />
				</SectionWrapper>

				<SectionWrapper
					title="Tavern"
					subtitle="Hire workers to help your operation."
					icon={<GiBeerStein />}
				>
					<div className="flex flex-row gap-1 flex-wrap">
						{WORKER_IDS.map((workerId) => (
							<Button
								key={workerId}
								onClick={() => hireWorker(workerId, 1)}
								disabled={!canHireWorker(workerId)}
								className="flex flex-1 justify-between duration-100 hover:scale-103 active:scale-98"
							>
								<div className={canHireWorker(workerId) ? "" : "opacity-50"}>
									Hire {WORKERS[workerId].name}
								</div>
								<div className={canHireWorker(workerId) ? "" : "opacity-50"}>
									{displayNumber(getWorkerHireCost(workerId, workers[workerId]))}{" "}
									🗝️
								</div>
							</Button>
						))}
					</div>
				</SectionWrapper>
			</div>
		</ContentWrapper>
	);
}

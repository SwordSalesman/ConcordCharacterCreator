import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { GameContext, INITIAL_UNLOCKED_HERBS, INITIAL_UNLOCKED_POTIONS } from "./gameContext";

import { HERB_IDS, POTION_IDS } from "../components/data/gameData";

const TUTORIAL_MODE = process.env.NEXT_PUBLIC_HERB_JUMPSTART !== "true";

interface TutorialContextInterface {
	showTutorial: boolean;
	showTutorialSkip: boolean;
	showLab: boolean;
	showMarket: boolean;
	showTavern: boolean;
	showWorkers: boolean;
	showUnlocks: boolean;
	showUpgrades: boolean;
}

const defaultTutorialSettings: TutorialContextInterface = {
	showTutorial: TUTORIAL_MODE,
	showTutorialSkip: false,
	showLab: false,
	showMarket: false,
	showTavern: false,
	showWorkers: false,
	showUnlocks: false,
	showUpgrades: false,
};

const defaultTutorialSettingsOFF: TutorialContextInterface = {
	showTutorial: false,
	showTutorialSkip: false,
	showLab: true,
	showMarket: true,
	showTavern: true,
	showWorkers: true,
	showUnlocks: true,
	showUpgrades: true,
};

export const TutorialContext = createContext<{
	tutorialSettings: TutorialContextInterface;
}>({
	tutorialSettings: defaultTutorialSettings,
});

export default function TutorialContextProvider({ children }: { children: ReactNode }) {
	const { herbs, potions, money, workers, unlockedHerbs, unlockedPotions } =
		useContext(GameContext);

	const herbTotal = Object.values(herbs).reduce((sum, amount) => sum + amount, 0);
	const potionTotal = Object.values(potions).reduce((sum, amount) => sum + amount, 0);
	const workerTotal = Object.values(workers).reduce((sum, amount) => sum + amount, 0);
	const oneOfEachWorker =
		workers.farmers > 0 && workers.apothecaries > 0 && workers.merchants > 0;
	const unlockedHerbOrPotion =
		!!HERB_IDS.find((id) => unlockedHerbs[id] && !INITIAL_UNLOCKED_HERBS[id]) ||
		!!POTION_IDS.find((id) => unlockedPotions[id] && !INITIAL_UNLOCKED_POTIONS[id]);

	const [tutorialSettings, setTutorialSettings] = useState(
		TUTORIAL_MODE
			? {
					showTutorial: true,
					showTutorialSkip: false,
					showLab: herbTotal > 0,
					showMarket: potionTotal > 0,
					showTavern: money > 0,
					showWorkers: workerTotal > 0,
					showUnlocks: unlockedHerbOrPotion,
					showUpgrades: oneOfEachWorker,
				}
			: defaultTutorialSettingsOFF,
	);

	useEffect(() => {
		if (!TUTORIAL_MODE) {
			return;
		}

		if (herbTotal > 0 && !tutorialSettings.showLab) {
			setTutorialSettings((prev) => ({ ...prev, showLab: true }));
		}
		if (potionTotal > 0 && !tutorialSettings.showMarket) {
			setTutorialSettings((prev) => ({ ...prev, showMarket: true }));
		}
		if (money > 0 && !tutorialSettings.showTavern) {
			setTutorialSettings((prev) => ({ ...prev, showTavern: true }));
		}
		if (workerTotal > 0 && !tutorialSettings.showWorkers) {
			setTutorialSettings((prev) => ({ ...prev, showWorkers: true }));
		}
		if (oneOfEachWorker && !tutorialSettings.showUnlocks) {
			setTutorialSettings((prev) => ({ ...prev, showUnlocks: true }));
		}
		if (unlockedHerbOrPotion && !tutorialSettings.showUpgrades) {
			setTutorialSettings((prev) => ({ ...prev, showUpgrades: true }));
		}
	}, [
		herbTotal,
		potionTotal,
		money,
		workerTotal,
		oneOfEachWorker,
		unlockedHerbs,
		unlockedPotions,
	]);

	return (
		<TutorialContext.Provider value={{ tutorialSettings }}>{children}</TutorialContext.Provider>
	);
}

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
	GameContext,
	INITIAL_UNLOCKED_HERBS,
	INITIAL_UNLOCKED_HERBS_RECORD,
	INITIAL_UNLOCKED_POTIONS,
	INITIAL_UNLOCKED_POTIONS_RECORD,
} from "./gameContext";

import { HERB_IDS, POTION_IDS } from "../components/data/gameData";

const TUTORIAL_MODE = process.env.NEXT_PUBLIC_HERB_JUMPSTART !== "true";
const TUTORIAL_STORAGE_KEY = "apothecary:tutorial-context:v1";

interface TutorialSettingsInterface {
	showTutorial: boolean;
	showTutorialSkip: boolean;
	showLab: boolean;
	showMarket: boolean;
	showTavern: boolean;
	showWorkers: boolean;
	showUnlocks: boolean;
	showUpgrades: boolean;
}

const defaultTutorialSettings: TutorialSettingsInterface = {
	showTutorial: TUTORIAL_MODE,
	showTutorialSkip: false,
	showLab: false,
	showMarket: false,
	showTavern: false,
	showWorkers: false,
	showUnlocks: false,
	showUpgrades: false,
};

const defaultTutorialSettingsOFF: TutorialSettingsInterface = {
	showTutorial: false,
	showTutorialSkip: false,
	showLab: true,
	showMarket: true,
	showTavern: true,
	showWorkers: true,
	showUnlocks: true,
	showUpgrades: true,
};

interface NewComponentInterface {
	buildGarden: boolean;
	learnRecipe: boolean;
	upgradeGarden: boolean;
	upgradeLaboratory: boolean;
	upgradeTavern: boolean;
	upgradeMarket: boolean;
	farmer: boolean;
}

const defaultNewComponents: NewComponentInterface = {
	buildGarden: true,
	learnRecipe: true,
	upgradeGarden: true,
	upgradeLaboratory: true,
	upgradeTavern: true,
	upgradeMarket: true,
	farmer: true,
};

const defaultNewComponentsOFF: NewComponentInterface = {
	buildGarden: false,
	learnRecipe: false,
	upgradeGarden: false,
	upgradeLaboratory: false,
	upgradeTavern: false,
	upgradeMarket: false,
	farmer: false,
};

export const TutorialContext = createContext<{
	tutorialSettings: TutorialSettingsInterface;
	newComponents: NewComponentInterface;
	setComponentStale: (component: keyof NewComponentInterface) => void;
	resetTutorial: () => void;
}>({
	tutorialSettings: defaultTutorialSettings,
	newComponents: defaultNewComponents,
	setComponentStale: () => {},
	resetTutorial: () => {},
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
		!!HERB_IDS.find((id) => unlockedHerbs[id] && !INITIAL_UNLOCKED_HERBS_RECORD[id]) ||
		!!POTION_IDS.find((id) => unlockedPotions[id] && !INITIAL_UNLOCKED_POTIONS_RECORD[id]);

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
	const [newComponents, setNewComponents] = useState(
		TUTORIAL_MODE ? defaultNewComponents : defaultNewComponentsOFF,
	);
	const [isStorageHydrated, setIsStorageHydrated] = useState(false);

	function updateState({
		settings,
		components,
	}: {
		settings?: Partial<TutorialSettingsInterface>;
		components?: Partial<NewComponentInterface>;
	}) {
		if (settings) {
			setTutorialSettings((prev) => ({ ...prev, ...settings }));
		}
		if (components) {
			setNewComponents((prev) => ({ ...prev, ...components }));
		}
	}

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		try {
			const raw = window.localStorage.getItem(TUTORIAL_STORAGE_KEY);
			if (!raw) {
				setIsStorageHydrated(true);
				return;
			}

			const parsed = JSON.parse(raw) as {
				tutorialSettings?: Partial<TutorialSettingsInterface>;
				newComponents?: Partial<NewComponentInterface>;
			};

			if (parsed.tutorialSettings) {
				setTutorialSettings((prev) => ({ ...prev, ...parsed.tutorialSettings }));
			}

			if (parsed.newComponents) {
				setNewComponents((prev) => ({ ...prev, ...parsed.newComponents }));
			}
		} catch {
			// Ignore malformed storage and keep defaults.
		}

		setIsStorageHydrated(true);
	}, []);

	useEffect(() => {
		if (typeof window === "undefined" || !isStorageHydrated) {
			return;
		}

		window.localStorage.setItem(
			TUTORIAL_STORAGE_KEY,
			JSON.stringify({ tutorialSettings, newComponents }),
		);
	}, [tutorialSettings, newComponents, isStorageHydrated]);

	useEffect(() => {
		if (!TUTORIAL_MODE) {
			return;
		}

		if (herbTotal > 0 && !tutorialSettings.showLab) {
			updateState({ settings: { showLab: true } });
		}
		if (potionTotal > 0 && !tutorialSettings.showMarket) {
			updateState({ settings: { showMarket: true } });
		}
		if (money > 0 && !tutorialSettings.showTavern) {
			updateState({ settings: { showTavern: true } });
		}
		if (workerTotal > 0 && !tutorialSettings.showWorkers) {
			updateState({ settings: { showWorkers: true } });
		}
		if (oneOfEachWorker && !tutorialSettings.showUnlocks) {
			updateState({ settings: { showUnlocks: true } });
		}
		if (unlockedHerbOrPotion && !tutorialSettings.showUpgrades) {
			updateState({ settings: { showUpgrades: true } });
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

	function setComponentStale(component: keyof NewComponentInterface) {
		updateState({ components: { [component]: false } });
	}

	function resetTutorial() {
		updateState({
			settings: defaultTutorialSettings,
			components: defaultNewComponents,
		});
	}

	return (
		<TutorialContext.Provider
			value={{ tutorialSettings, newComponents, setComponentStale, resetTutorial }}
		>
			{children}
		</TutorialContext.Provider>
	);
}

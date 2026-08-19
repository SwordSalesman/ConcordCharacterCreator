import GameMain from "@/components/apothecary/GameMain";
import GameContextProvider from "@/components/apothecary/context/gameContext";
import ApothecaryAnimationProvider from "@/components/apothecary/context/animationContext";
import TutorialContextProvider from "@/components/apothecary/context/tutorialContext";

export default function HerbGardenPage() {
	return (
		<GameContextProvider>
			<ApothecaryAnimationProvider>
				<TutorialContextProvider>
					<GameMain />
				</TutorialContextProvider>
			</ApothecaryAnimationProvider>
		</GameContextProvider>
	);
}

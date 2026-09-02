import GameMain from "@/herb-garden/GameMain";
import GameContextProvider from "@/herb-garden/context/gameContext";
import ApothecaryAnimationProvider from "@/herb-garden/context/animationContext";
import TutorialContextProvider from "@/herb-garden/context/tutorialContext";

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

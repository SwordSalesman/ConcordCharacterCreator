import GameMain from "@/components/herb-garden/GameMain";
import GameContextProvider from "@/components/herb-garden/context/gameContext";
import ApothecaryAnimationProvider from "@/components/herb-garden/context/animationContext";
import TutorialContextProvider from "@/components/herb-garden/context/tutorialContext";

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

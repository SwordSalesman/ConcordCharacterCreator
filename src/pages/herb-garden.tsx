import GameMain from "@/components/apothecary/GameMain";
import GameContextProvider from "@/components/apothecary/gameContext";
import { ApothecaryAnimationProvider } from "@/components/apothecary/animationContext";

export default function HerbGardenPage() {
	return (
		<GameContextProvider>
			<ApothecaryAnimationProvider>
				<GameMain />
			</ApothecaryAnimationProvider>
		</GameContextProvider>
	);
}

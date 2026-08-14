import HerbGarden from "@/components/apothecary/HerbGarden";
import { useRouter } from "next/router";
import GameContextProvider from "@/components/apothecary/gameContext";
import { ApothecaryAnimationProvider } from "@/components/apothecary/animationContext";

export default function HerbGardenPage() {
	const router = useRouter();

	return (
		<GameContextProvider>
			<ApothecaryAnimationProvider>
				<HerbGarden />
			</ApothecaryAnimationProvider>
		</GameContextProvider>
	);
}

import Apothecary from "@/components/apothecary/Apothecary";
import useUserContext from "@/hooks/use-user-context";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { PATH_HOME } from "@/utils/constants";
import GameContextProvider from "@/components/apothecary/gameContext";
import { ApothecaryAnimationProvider } from "@/components/apothecary/animationContext";

export default function ApothecaryPage() {
	const router = useRouter();
	const { isAdmin } = useUserContext();

	useEffect(() => {
		if (!isAdmin) router.replace(PATH_HOME);
	}, [isAdmin, router]);

	return (
		<GameContextProvider>
			<ApothecaryAnimationProvider>
				<Apothecary />
			</ApothecaryAnimationProvider>
		</GameContextProvider>
	);
}

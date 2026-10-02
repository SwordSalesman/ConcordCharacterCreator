import { Button } from "@/components/common/Button/Button";
import { Modal } from "@/components/common/Modal/Modal";
import { useAnimation } from "../context/animationContext";
import { useState } from "react";
import { Leaderboard } from "./Leaderboard";
import { useLeaderboard } from "../hooks/use-leaderboard";
import useUserContext from "@/hooks/use-user-context";
import { copyText } from "@/utils/odd-jobs";

export function SettingsMenu({
	open,
	onClose,
	handleReset,
}: {
	open: boolean;
	onClose: () => void;
	handleReset: () => void;
}) {
	const [activeScreen, setActiveScreen] = useState<"settings" | "about" | "leaderboard">(
		"settings",
	);
	const { active, toggleActive } = useAnimation();
	const { top10, loading } = useLeaderboard(activeScreen === "leaderboard");
	const { user } = useUserContext();

	const backButton = (
		<Button
			onClick={() => {
				setActiveScreen("settings");
			}}
			className="w-full gap-2"
		>
			<span>Back</span>
		</Button>
	);

	function handleClose() {
		setActiveScreen("settings");
		onClose();
	}

	const herbGardenSpan = <span className="font-mono text-muted-foreground">herb-garden</span>;

	return (
		<Modal
			open={open}
			onClose={handleClose}
			size={activeScreen === "leaderboard" ? "medium" : "small"}
			body={
				<div className="flex flex-col items-center gap-3">
					{activeScreen === "about" ? (
						<>
							<p>About {herbGardenSpan}</p>
							<p className="text-sm text-center py-1">
								{herbGardenSpan} is a mini game about managing a humble apothecary
								operation in the Concord.
								<br />
								<br />
								It's purely a project made for fun, and has no impact on your
								character submission. Expect updates over time, and don't get too
								attached to your saved game!
								<br />
								<br />
								<i>
									The Concord Web Team makes no claim to the accuracy of the
									economy simulated in {herbGardenSpan}.
								</i>
							</p>
							{backButton}
						</>
					) : activeScreen === "leaderboard" ? (
						<>
							<p className="text-center text-lg font-bold">Herb Garden Leaderboard</p>
							<Leaderboard
								entries={top10}
								highlightUid={user?.uid}
								loading={loading}
							/>
							{backButton}
						</>
					) : (
						<>
							<Button
								onClick={() => {
									toggleActive();
								}}
								className="w-full gap-2"
							>
								<span>✨</span>
								<span>Animations {active ? "ON" : "OFF"}</span>
							</Button>
							<Button
								onClick={() => {
									setActiveScreen("leaderboard");
								}}
								className="w-full gap-2"
								variant="ghost"
							>
								<span>🏆</span>
								<span>View Leaderboard</span>
							</Button>
							<Button
								onClick={() => {
									setActiveScreen("about");
								}}
								className="w-full gap-2"
								variant="ghost"
							>
								<span>🌱</span>
								<span>About</span>
							</Button>
							<Button
								onClick={() => {
									handleReset();
									handleClose();
								}}
								className="w-full"
								variant="destructive"
							>
								Reset Game
							</Button>
						</>
					)}
				</div>
			}
		/>
	);
}

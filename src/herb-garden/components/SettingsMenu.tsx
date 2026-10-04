import { Button } from "@/components/common/Button/Button";
import { Modal } from "@/components/common/Modal/Modal";
import { useAnimation } from "../context/animationContext";
import { useState } from "react";
import { Leaderboard } from "./Leaderboard";
import { useLeaderboard } from "../hooks/use-leaderboard";
import useUserContext from "@/hooks/use-user-context";
import { changelog } from "./data/changelog";

export function SettingsMenu({
	open,
	onClose,
	handleReset,
}: {
	open: boolean;
	onClose: () => void;
	handleReset: () => void;
}) {
	const [activeScreen, setActiveScreen] = useState<
		"settings" | "about" | "leaderboard" | "changelog"
	>("settings");
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
			size={["leaderboard", "changelog"].includes(activeScreen) ? "medium" : "small"}
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
							<p className="text-center text-lg font-bold">
								<span className="font-mono text-muted-foreground">herb-garden</span>{" "}
								<span className="font-mono">leaderboard</span>
							</p>
							<Leaderboard
								entries={top10}
								highlightUid={user?.uid}
								loading={loading}
							/>
							{backButton}
						</>
					) : activeScreen === "changelog" ? (
						<>
							<p className="text-center text-lg font-bold">
								<span className="font-mono">Change Log</span>
							</p>
							<div>
								{changelog
									.sort((a, b) => b.version.localeCompare(a.version))
									.map((entry) => (
										<div key={entry.version} className="mb-4">
											<p className="font-mono font-bold">
												V{entry.version}{" "}
												<span className="font-mono text-muted-foreground">
													({entry.date})
												</span>
											</p>
											<ul className="list-disc list-inside">
												{entry.changes.map((change, index) => (
													<li key={index} className="leading-5 mb-1">
														{change}
													</li>
												))}
											</ul>
										</div>
									))}
							</div>
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
								<span>Leaderboard</span>
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
									setActiveScreen("changelog");
								}}
								className="w-full gap-2"
								variant="ghost"
							>
								<span>📝</span>
								<span>Changelog</span>
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

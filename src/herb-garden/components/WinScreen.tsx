import { Modal } from "@/components/common/Modal/Modal";
import LoginModal from "@/components/common/Modal/LoginModal";
import { Button } from "@/components/common/Button/Button";
import { Leaderboard } from "@/herb-garden/components/Leaderboard";
import { displayTimer } from "@/herb-garden/helpers/displayValueHelper";
import { useLeaderboard } from "@/herb-garden/hooks/use-leaderboard";
import useUserContext from "@/hooks/use-user-context";
import { claimThrone } from "@/hooks/use-firebase";
import { useEffect, useState } from "react";
import { GiCrown } from "react-icons/gi";

export function WinScreen({
	open,
	onClose,
	throneTimeMs,
	resetGame,
}: {
	open: boolean;
	onClose: () => void;
	throneTimeMs: number | null;
	resetGame: () => void;
}) {
	const { user } = useUserContext();
	const { top10, setTop10, loading } = useLeaderboard(open);
	const [closable, setClosable] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [pendingSubmit, setPendingSubmit] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [rank, setRank] = useState<number | null>(null);

	function handleClose() {
		if (closable) onClose();
	}

	// Allow the modal to be closed after 2 seconds. Prevents spam clicking from closing it immediately
	useEffect(() => {
		setTimeout(() => setClosable(true), 2000);
	}, []);

	async function submitScore() {
		if (throneTimeMs === null || submitting || rank !== null) {
			return;
		}
		setSubmitting(true);
		setSubmitError(null);
		try {
			const result = await claimThrone(throneTimeMs);
			setRank(result.rank);
			setTop10(result.top10);
		} catch (error) {
			console.error("Failed to submit throne score:", error);
			setSubmitError("Couldn't submit your score. Try again?");
		} finally {
			setSubmitting(false);
		}
	}

	// Once sign-in succeeds after "Sign in to Submit Score" is clicked, continue the submission automatically.
	useEffect(() => {
		if (user && pendingSubmit) {
			setPendingSubmit(false);
			submitScore();
		}
	}, [user, pendingSubmit]);

	function handleSignInAndSubmit() {
		setPendingSubmit(true);
		setShowLoginModal(true);
	}

	return (
		<>
			<Modal
				open={open}
				onClose={handleClose}
				size="medium"
				body={
					<div className="flex flex-col items-center gap-4 text-center">
						<div>
							<div className="flex items-center gap-2 justify-center">
								<GiCrown size={34} />
								<div className="text-xl font-bold">Victory!</div>
							</div>
							<div className="text-sm text-muted-foreground">
								You have claimed the Throne of the Concord.
							</div>
						</div>
						<div>
							<div className="text-sm text-muted-foreground">Time to Throne:</div>
							<div className="font-mono text-2xl">
								{throneTimeMs !== null ? displayTimer(throneTimeMs) : "--:--"}
							</div>
						</div>

						{rank !== null && (
							<div className="flex gap-1">
								<span>Your Rank:</span>
								<span className="font-mono">#{rank}</span>
								<span>
									{rank === 1
										? "🏆"
										: rank === 2
											? "🥈"
											: rank === 3
												? "🥉"
												: null}
								</span>
							</div>
						)}

						<Leaderboard entries={top10} highlightUid={user?.uid} loading={loading} />

						{rank === null && (
							<div className="flex flex-col items-center gap-2">
								<Button
									onClick={user ? submitScore : handleSignInAndSubmit}
									disabled={submitting}
									variant="primary"
								>
									{submitting
										? "Submitting..."
										: user
											? "Submit Score to Leaderboard"
											: "Sign in to Submit Score"}
								</Button>
								{submitError && (
									<div className="text-xs text-destructive">{submitError}</div>
								)}
							</div>
						)}
					</div>
				}
				actions={[
					{
						label: "Reset Game",
						onClick: resetGame,
						disabled: !closable,
						variant: "ghost",
					},
					{
						label: "Continue Playing",
						onClick: handleClose,
						disabled: !closable,
						variant: "secondary",
					},
				]}
			/>
			<LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
		</>
	);
}

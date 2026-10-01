import { Modal } from "@/components/common/Modal/Modal";
import { displayTimer } from "@/herb-garden/helpers/displayValueHelper";
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
	const [closable, setClosable] = useState(false);

	function handleClose() {
		if (closable) onClose();
	}

	// Allow the modal to be closed after 2 seconds. Prevents spam clicking from closing it immediately
	useEffect(() => {
		setTimeout(() => setClosable(true), 2000);
	}, []);

	return (
		<Modal
			open={open}
			onClose={handleClose}
			size="medium"
			body={
				<div className="flex flex-col items-center gap-3 text-center">
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
	);
}

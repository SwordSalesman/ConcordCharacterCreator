import ContentWrapper from "@/components/layout/ContentWrapper";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "../common/Button/Button";
import {
	setDowntimeOption,
	getDowntimeOptions,
	getDowntimeSubmissions,
} from "@/hooks/use-firebase";

export function DowntimeManage() {
	const [loading, setLoading] = useState(false);
	const [game, setGame] = useState<string | undefined>("S226");
	const [downtimeOptions, setDowntimeOptions] = useState<any[]>([]);
	const [downtimeSubmissions, setDowntimeSubmissions] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			if (!game) return;
			setLoading(true);

			try {
				const options = await getDowntimeOptions({ game });
				setDowntimeOptions(options);

				const submissions = await getDowntimeSubmissions({ game });
				setDowntimeSubmissions(submissions);

				console.log(options);
				console.log(submissions);
			} catch (error) {
				toast.error("Failed to load downtime options");
			}

			setLoading(false);
		};

		if (game) {
			fetchData();
		}
	}, [game]);

	function handleAddNewDowntimeOption() {}

	function handleChangeGame() {}

	function handleDeleteDowntimeOption() {}

	function handleSaveDowntimeOption() {}

	return (
		<div className="flex font-sans flex-col sm:flex-row h-full w-full gap-2 sm:h-[90vh] min-h-[600px] ">
			<div className="sm:flex-1 h-[400px] sm:h-full border border-border rounded-md overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
				<div className="py-2 border-b flex flex-col justify-center items-center gap-3 sticky top-0 z-6 bg-background">
					<h2 className="text-lg font-bold text-center">Downtime Options</h2>
					<div className="flex flex-col text-center items-center justify-center">
						<p className="text-sm text-muted-foreground">
							Showing downtime options for...
						</p>
						<Button variant="outline" onClick={handleChangeGame}>
							{game ? (
								<>
									<span>{game}</span>
									<span className="text-muted-foreground">
										{" "}
										(Click to change)
									</span>
								</>
							) : (
								<span>Select a game</span>
							)}
						</Button>
					</div>
					<div>
						<Button
							variant="outline"
							onClick={handleAddNewDowntimeOption}
							disabled={!game || loading}
						>
							Add New Downtime Option
						</Button>
					</div>
				</div>
				<div className="overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
					<ul>
						{loading ? (
							<div className="mt-12">
								<LoadingSpinner />
							</div>
						) : downtimeOptions.length > 0 ? (
							downtimeOptions.map((d) => (
								<li key={d.id} className="p-2 px-3 border-b">
									{d.id}
								</li>
							))
						) : (
							<p className="text-center mt-12 text-sm italic">
								No downtime options configured
							</p>
						)}
					</ul>
				</div>
			</div>
			<div className="sm:flex-2 border border-border rounded-md h-[400px] sm:h-full"></div>
		</div>
	);
}

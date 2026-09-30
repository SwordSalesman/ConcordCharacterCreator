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
import {
	Manager,
	ManagerContent,
	ManagerList,
	ManagerListFilter,
	ManagerListItem,
	ManagerListItems,
} from "../manager/Manager";
import { CgAdd } from "react-icons/cg";
import { CSVLink } from "react-csv";
import { BiExport } from "react-icons/bi";

export function DowntimeManage() {
	const [loading, setLoading] = useState(false);
	const [game, setGame] = useState<string | undefined>("S226");
	const [downtimeOptions, setDowntimeOptions] = useState<any[]>([]);
	const [downtimeSubmissions, setDowntimeSubmissions] = useState<any[]>([]);
	const [selectedDowntimeOption, setSelectedDowntimeOption] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (!game) return;
			setLoading(true);

			try {
				const options = await getDowntimeOptions({ game });
				setDowntimeOptions(options);

				const submissions = await getDowntimeSubmissions({ game });
				setDowntimeSubmissions(submissions);
				// setDowntimeSubmissions([
				// 	{
				// 		hero: "nice guy",
				// 		downtimeId: "Birds or Paradise",
				// 		comment: "This is a comment",
				// 	},
				// 	{
				// 		hero: "mean guy",
				// 		downtimeId: "Storming the Place",
				// 	},
				// 	{
				// 		hero: "regular guy",
				// 		downtimeId: "Birds or Paradise",
				// 	},
				// ]);

				console.log("options", options);
				console.log("submissions", submissions);
			} catch (error) {
				toast.error("Failed to load downtime options");
			}

			setLoading(false);
		};

		if (game) {
			fetchData();
		}
	}, []);

	function handleAddNewDowntimeOption() {}

	function handleChangeGame() {}

	function handleDeleteDowntimeOption() {}

	function handleSaveDowntimeOption() {}

	return (
		<Manager>
			<ManagerList
				actions={
					<CSVLink
						data={downtimeSubmissions
							.sort((a, b) => (a.downtimeId > b.downtimeId ? 1 : -1))
							.map((dt) => {
								return {
									hero: dt.hero,
									downtime: dt.downtimeId,
									comment: dt.comment,
								};
							})}
						filename={`downtime-submissions-export-${new Date().toISOString()}.csv`}
						headers={[
							{ label: "Hero", key: "hero" },
							{ label: "Downtime", key: "downtime" },
							{ label: "Comment", key: "comment" },
						]}
					>
						<Button variant="outline" size="sm">
							<div className="flex items-center gap-2 mx-1">
								<p>Export Submissions</p>
								<BiExport />
							</div>
						</Button>
					</CSVLink>
				}
			>
				<ManagerListFilter>
					<h2 className="text-lg font-bold text-center">Downtime Options</h2>
					<div className="flex flex-col text-center items-center justify-center">
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
				</ManagerListFilter>
				<ManagerListItems>
					<ul>
						{loading ? (
							<div className="mt-12">
								<LoadingSpinner />
							</div>
						) : (
							<>
								{downtimeOptions.length > 0 ? (
									downtimeOptions.map((d) => (
										<ManagerListItem
											key={d.id}
											onClick={() => setSelectedDowntimeOption(d.id)}
										>
											{d.id}
										</ManagerListItem>
									))
								) : (
									<p className="text-center mt-12 text-sm italic">
										No downtime options configured
									</p>
								)}
								<div className="flex justify-center mt-4 mb-6">
									<Button
										variant="outline"
										onClick={handleAddNewDowntimeOption}
										disabled={!game || loading}
									>
										<CgAdd className="size-6" />
										Add New Downtime Option
									</Button>
								</div>
							</>
						)}
					</ul>
				</ManagerListItems>
			</ManagerList>
			<ManagerContent className="sm:flex-2 border border-border rounded-md h-[400px] sm:h-full p-1">
				<div>
					{selectedDowntimeOption ? (
						<p>Selected Downtime Option ID: {selectedDowntimeOption}</p>
					) : (
						<p>nothing yet</p>
					)}
				</div>
			</ManagerContent>
		</Manager>
	);
}

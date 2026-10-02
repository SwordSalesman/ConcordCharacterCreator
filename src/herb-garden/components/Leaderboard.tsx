import { cn } from "@/lib/utils";
import { displayTimer } from "@/herb-garden/helpers/displayValueHelper";
import type { ThroneLeaderboardEntry } from "@/hooks/use-firebase";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function Leaderboard({
	loading,
	entries,
	highlightUid,
}: {
	loading: boolean;
	entries: ThroneLeaderboardEntry[];
	highlightUid?: string;
}) {
	if (loading) {
		return <LoadingSpinner />;
	}

	if (entries.length === 0) {
		return <div className="text-sm text-muted-foreground">No scores yet. Be the first!</div>;
	}

	return (
		<div className="flex flex-col gap-0 w-fit font-mono text-sm text-center rounded-md overflow-hidden border-background-raised border-2">
			<div className={"grid grid-cols-5 gap-4 px-3 py-0.5 text-muted-foreground"}>
				<span>Rank</span>
				<span className="col-span-3 text-center">Player</span>
				<span>Time</span>
			</div>
			{entries.map((entry, index) => (
				<div
					key={entry.uid}
					className={cn(
						"grid grid-cols-5 gap-4 px-3 py-0.5",
						index % 2 === 0 ? "bg-background-raised" : "",
						entry.uid === highlightUid ? "text-special font-bold" : "",
					)}
				>
					<span>#{index + 1}</span>
					<span className="col-span-3 text-center">{entry.displayName}</span>
					<span>{displayTimer(entry.timeMs)}</span>
				</div>
			))}
		</div>
	);
}

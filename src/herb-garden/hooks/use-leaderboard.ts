import { useEffect, useState } from "react";
import { getThroneLeaderboard, type ThroneLeaderboardEntry } from "@/hooks/use-firebase";

// Fetches the cached top-10 doc lazily, once, the first time `active` becomes true (e.g. a modal opening).
export function useLeaderboard(active: boolean) {
	const [top10, setTop10] = useState<ThroneLeaderboardEntry[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasLoaded, setHasLoaded] = useState(false);

	async function refresh() {
		setLoading(true);
		setError(null);
		try {
			setTop10(await getThroneLeaderboard());
			setHasLoaded(true);
		} catch (err) {
			console.error("Failed to load the leaderboard:", err);
			setError("Couldn't load the leaderboard.");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (active && !hasLoaded) {
			refresh();
		}
	}, [active, hasLoaded]);

	return { top10, setTop10, loading, error, refresh };
}

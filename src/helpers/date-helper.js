import gameData from "../data/tables/games.json";

export function getCurrentDate() {
	const date = new Date().toISOString(); // YYYY-MM-DDTHH:mm:SS.xxxx
	return date;
}

export function prettifyDate(date, options = {}) {
	const { hideTime, shortDate } = options;

	if (!date) return "";

	const dateOptions = {
		dateStyle: shortDate ? "short" : "medium",
	};

	if (date.length <= 10) {
		// Old date, in the format YYYY-MM-DD
		return new Date(date).toLocaleString("en-AU", dateOptions);
	}

	// New date, in the ISO string format
	if (!hideTime) {
		dateOptions.timeStyle = "short";
	}
	return new Date(date).toLocaleString("en-AU", dateOptions);
}

export function getPrevAndNextGame() {
	const today = getCurrentDate();
	let games = null;
	gameData.forEach((game, index) => {
		if (game.date > today && !games) {
			games = {
				prev: gameData.at(index - 1),
				next: game,
			};
		}
	});
	return games;
}

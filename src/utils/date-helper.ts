import { games as gamesData } from "@/data/tables/games";

export function getCurrentDate(): string {
	const date = new Date().toISOString(); // YYYY-MM-DDTHH:mm:SS.xxxx
	return date;
}

interface PrettifyDateOptions {
	hideTime?: boolean;
	shortDate?: boolean;
}

export function prettifyDate(date: string | undefined, options: PrettifyDateOptions = {}): string {
	const { hideTime, shortDate } = options;

	if (!date) return "";

	const dateOptions: Intl.DateTimeFormatOptions = {
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

interface Game {
	name: string;
	date: string;
}

export function getPrevAndNextGame() {
	const today = getCurrentDate();
	let games: { prev: Game | undefined; next: Game } | null = null;
	gamesData.forEach((game, index) => {
		if (game.date > today && !games) {
			games = {
				prev: gamesData.at(index - 1),
				next: game,
			};
		}
	});
	return games;
}

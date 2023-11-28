import gameData from "../data/tables/games.json";

export function getCurrentDate() {
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    return date;
}

export function prettifyDate(date) {
    if (!date) return "";
    const y = date.slice(0, 4);
    const m = date.slice(5, 7);
    const d = date.slice(8, 10);
    return `${d}/${m}/${y}`;
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

export function getCurrentDate() {
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    return date;
}

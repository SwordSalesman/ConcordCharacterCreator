var regions = require("../data/tables/regions.json");

export function getRegionRealm(regionName) {
	const realm = regions.filter((r) => r.name === regionName)[0]?.realm;
	return realm;
}

export const summariseSimpleArray = (a) => {
	if (!a) return "";
	return a
		.map((i) => {
			if (typeof i === "string") return i;
			return i.name;
		})
		.join(", ");
};

export const getSimpleArrayFromSummary = (s) => {
	if (!s || s === "") return [];
	return s.split(", ").map((i) => {
		return { name: i };
	});
};

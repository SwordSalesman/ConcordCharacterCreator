var regions = require("../data/tables/regions.json");

export interface Region {
	name: string;
	realm: string;
	link: string;
	territories: string[];
	coastal: boolean;
}

export function getRegionRealm(regionName: string) {
	const realm = regions.filter((r: Region) => r.name === regionName)[0]?.realm;
	return realm;
}

export const summariseSimpleArray = (a: any[]) => {
	if (!a) return "";
	return a
		.map((i) => {
			if (typeof i === "string") return i;
			return i.name;
		})
		.join(", ");
};

export const getSimpleArrayFromSummary = (s: string) => {
	if (!s || s === "") return [];
	return s.split(", ").map((i) => {
		return { name: i };
	});
};

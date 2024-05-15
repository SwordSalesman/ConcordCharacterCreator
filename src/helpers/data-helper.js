var regions = require("../data/tables/regions.json");

export function getRegionRealm(regionName) {
	const realm = regions.filter((r) => r.name === regionName)[0]?.realm;
	return realm;
}

var regionData = require("../data/tables/regions.json");

export const coastalRegions = regionData.filter((r) => r.coastal).map((r) => r.name);
export const nonCoastalRegions = regionData.filter((r) => !r.coastal).map((r) => r.name);

export const regionIsCoastal = (region) => {
	return coastalRegions.includes(region);
};

export const regionIsNotCoastal = (region) => {
	return nonCoastalRegions.includes(region);
};

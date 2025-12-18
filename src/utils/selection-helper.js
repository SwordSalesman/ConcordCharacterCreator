import { regions as regionData } from "@/data/tables/regions";

export const coastalRegions = regionData.filter((r) => r.coastal).map((r) => r.name);
export const nonCoastalRegions = regionData.filter((r) => !r.coastal).map((r) => r.name);

export const regionIsCoastal = (region) => {
	return coastalRegions.includes(region);
};

export const regionIsNotCoastal = (region) => {
	return nonCoastalRegions.includes(region);
};

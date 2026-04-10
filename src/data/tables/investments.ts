export interface Investment {
	name: string;
	diversifyOptions?: { name: string }[];
	options?: { name: string }[];
}

const wildernessOptions = [
	{ name: "Hartwood" },
	{ name: "Beastbone" },
	{ name: "Black Sap" },
	{ name: "Shimmering Scales" },
];

const mineOptions = [
	{ name: "Forgesteel" },
	{ name: "Sun's Iron" },
	{ name: "Bloodglass" },
	{ name: "Essencite" },
];

export const investments: Investment[] = [
	{ name: "Military" },
	{ name: "Naval" },
	{ name: "Leyline" },
	{ name: "Congregation" },
	{ name: "Business", diversifyOptions: mineOptions },
	{ name: "Farm", diversifyOptions: wildernessOptions },
	{
		name: "Wilderness",
		options: wildernessOptions,
	},
	{
		name: "Herb Garden",
	},
	{
		name: "Mine",
		options: mineOptions,
	},
];

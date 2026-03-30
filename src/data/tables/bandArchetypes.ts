import { ArchetypeDetails, GroupState } from "@/context/groupContext";
import { Realm } from "./realms";

export interface BandArchetype {
	name: string;
	realm: Realm;
	link: string;
	prompts?: Partial<
		Record<
			keyof GroupState | keyof ArchetypeDetails,
			{
				label?: string;
				sublabel?: string;
			}
		>
	>;
}

export const realmicBandArchetypes: BandArchetype[] = [
	{
		name: "Clan",
		realm: "Andash",
		link: "Andashi_Clan",
		prompts: {
			visuals: {
				label: "What is your Clan's colour?",
				sublabel:
					"This refers to the identity of the Clan, how it shows itself to the world and how its members identify each other.",
			},
			oath: {
				sublabel:
					"The Fire, Blood, Colour and Law of a Clan often forms together into its Oath, which guides the clan and forms the centre of its binding ceremony.",
			},
		},
	},
	{
		name: "Knightly Order",
		realm: "Kingdom of Bordevar",
		link: "Bordevarian_Knightly_Order",
		prompts: {
			visuals: {
				label: "What is your Order's Heraldry and colours?",
			},
		},
	},
	{
		name: "Noble House",
		realm: "Kingdom of Bordevar",
		link: "Bordevar_Noble_House",
		prompts: {
			history: {
				sublabel:
					"At the core of a noble house is a pitch, a summary of the House that encapsulates what makes it different to other Houses.",
			},
			visuals: {
				label: "What is your Noble House's Heraldry?",
			},
		},
	},
	{
		name: "Guilder",
		realm: "Greenweald Baronies",
		link: "Greenweald_Guilder",
		prompts: {
			visuals: { label: "What are your Guilder's notable symbols or colours?" },
			oath: {
				sublabel:
					"The magical and moral words that will bind your members together. Through life and through darkness it is what will guide you. Choose well.",
			},
		},
	},
	{
		name: "Haven",
		realm: "Greenweald Baronies",
		link: "Greenweald_Haven",
		prompts: {
			visuals: { label: "What visually marks people of your Haven from other Havens?" },
		},
	},
	{
		name: "Coteria",
		realm: "Lerona Mere",
		link: "Lerona_Mere_Coteria",
		prompts: {
			visuals: {
				label: "What is the symbology or calling cards of your Coteria?",
			},
			oath: {
				sublabel:
					"The only true forming moment for a Coteria is the swearing of their oath. Traditionally sworn with a bloody hands upon the Coteria's ledger, this oath is sworn before the Spheres as a part of the Blessing of the Warhost ceremony.",
			},
		},
	},
	{
		name: "Borough",
		realm: "Iron Valley",
		link: "Iron_Valley_Borough",
		prompts: {
			history: {
				label: "What is your Borough's Legend?",
			},
		},
	},
];

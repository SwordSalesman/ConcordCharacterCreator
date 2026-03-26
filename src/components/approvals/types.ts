export interface ApprovalRecord {
	id?: string;
	date: string;
	author: string;
	status: string;
	comment: string;
}

export interface Character {
	id: string;
	heroName: string;
	player: string;
	email: string;
	date: string;
	gamesPlayed: number;
	realm?: string;
	archetype?: string;
	grace?: string;
	warband?: string;
	sect?: string;
	skills?: string;
	spells?: string;
	crafts?: string;
	potions?: string;
	ceremonies?: string;
	startingItem?: string;
	backstory?: string;
	invDetails?: string;
	icGoals?: string;
	oocGoals?: string;
	comments?: string;
	investment?: string;
	invTier?: string | number;
	invOption?: string;
	invDiversify?: string;
	invRegion?: string;
	invTerritory?: string;
	changes?: string;
	approval?: ApprovalRecord;
}

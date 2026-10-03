export const WORKER_IDS = ["farmers", "apothecaries", "merchants", "priests"] as const;
export type WorkerId = (typeof WORKER_IDS)[number];

export interface WorkerDefinition {
	id: WorkerId;
	name: string;
	emoji: string;
	singularName: string;
	baseCost: number;
	costScale: number;
	actionsPerSecond: number;
}

export const WORKERS: Record<WorkerId, WorkerDefinition> = {
	farmers: {
		id: "farmers",
		name: "Farmers",
		singularName: "Farmer",
		emoji: "🪏",
		baseCost: 20,
		costScale: 1.275,
		actionsPerSecond: 0.5,
	},
	apothecaries: {
		id: "apothecaries",
		name: "Apothecaries",
		singularName: "Apothecary",
		emoji: "🧪",
		baseCost: 33,
		costScale: 1.47,
		actionsPerSecond: 0.3,
	},
	merchants: {
		id: "merchants",
		name: "Merchants",
		singularName: "Merchant",
		emoji: "⚖️",
		baseCost: 35,
		costScale: 1.48,
		actionsPerSecond: 0.3,
	},
	priests: {
		id: "priests",
		name: "Priests",
		singularName: "Priest",
		emoji: "📿",
		baseCost: 75,
		costScale: 1.85,
		actionsPerSecond: 0.075,
	},
};

export function getWorkerHireCost(workerId: WorkerId, ownedCount: number): number {
	const worker = WORKERS[workerId];
	return Math.ceil(worker.baseCost * worker.costScale ** ownedCount);
}

export function getWorkerHireTotalCost(
	workerId: WorkerId,
	ownedCount: number,
	purchaseAmount: number,
): number {
	let total = 0;
	for (let i = 0; i < purchaseAmount; i++) {
		total += getWorkerHireCost(workerId, ownedCount + i);
	}
	return total;
}

export interface ProductionCost {
	ironium: number;
	boranium: number;
	germanium: number;
	resources: number;
}

export enum PRT {
	PRTNone,
	HE,
	SS,
	WM,
	CA,
	IS,
	SD,
	PP,
	IT,
	AR,
	JOAT
}

export enum LRT {
	LRTNone = 0,
	IFE = 1,
	TT = 2,
	ARM = 4,
	ISB = 8,
	GR = 16,
	UR = 32,
	NRSE = 64,
	OBRM = 128,
	NAS = 256,
	LSP = 512,
	BET = 1024,
	RS = 2048,
	MA = 4096,
	CE = 8192
}

export interface TechLevel {
	Energy: number;
	Weapons: number;
	Propulsion: number;
	Construction: number;
	Electronics: number;
	Biotechnology: number;
}

export interface TechRequirements {
	techLevel: TechLevel;
	prtAllowed: PRT[];
	prtDenied: PRT[];
	lrtRequired: LRT[];
	lrtDenied: LRT[];
	hullsAllowed: string[];
	hullsDenied: string[];
}

export interface Engine {
	key: number;
	name: string;
	cost: ProductionCost;
	mass: number;
	tech: TechRequirements;
	idealSpeed: number;
	freeSpeed: number;
	maxSafeSpeed: number;
	fuelUsage: number[];
}

export const engines: Engine[] = [
	{
		key: 1,
		name: "Settler's Delight",
		cost: {
			ironium: 1,
			boranium: 0,
			germanium: 1,
			resources: 2
		},
		mass: 2,
		tech: {
			techLevel: {
				Energy: 0,
				Weapons: 0,
				Propulsion: 0,
				Construction: 0,
				Electronics: 0,
				Biotechnology: 0
			},
			prtAllowed: [PRT.HE],
			prtDenied: [],
			lrtRequired: [],
			lrtDenied: [],
			hullsAllowed: ['Mini Colonizer'],
			hullsDenied: []
		},
		idealSpeed: 6,
		freeSpeed: 6,
		maxSafeSpeed: 9,
		fuelUsage: [0, 0, 0, 0, 0, 0, 0, 150, 275, 480, 576]
	},
	{
		key: 2,
		name: 'Quick Jump 5',
		cost: {
			ironium: 3,
			boranium: 0,
			germanium: 1,
			resources: 3
		},
		mass: 4,
		tech: {
			techLevel: {
				Energy: 0,
				Weapons: 0,
				Propulsion: 0,
				Construction: 0,
				Electronics: 0,
				Biotechnology: 0
			},
			prtAllowed: [],
			prtDenied: [],
			lrtRequired: [],
			lrtDenied: [],
			hullsAllowed: [],
			hullsDenied: []
		},
		idealSpeed: 5,
		freeSpeed: 1,
		maxSafeSpeed: 9,
		fuelUsage: [0, 0, 25, 100, 100, 100, 180, 500, 800, 900, 1080]
	}
];

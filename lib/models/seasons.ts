export type Standing = {
	uuid: string,
	nick?: string,
	results: {
		place: number,
		when: string,
		numPlayers: number,
	}[],
	winnings: number,
	avgPlace: number,
	points: number,
	headsUp: number,
	wins: number,
	played: number,
	playedEnough: boolean,
	numTotal: number,
	knockouts: number,
};

export type SeasonStandings = {
	byWinnings: Standing[],
	byAvgPlace: Standing[],
	byPoints: Standing[],
	byHeadsUp: Standing[],
	byWinRatio: Standing[],
	byWinRatioTotal: Standing[],
	byNumPlayed: Standing[],
	byKnockouts: Standing[],
};

export type YellowPeriod = {
	from: string,
	to: string,
	uuid: string,
	nick?: string,
	days?: number,
	active: boolean,
};

export type MonthStats = {
	year: number,
	month: number,
	best: string,
	worst: string,
	bountyhunter: string,
};

export type SeasonStats = {
	yellowPeriods: YellowPeriod[],
	monthStats: MonthStats[],
};

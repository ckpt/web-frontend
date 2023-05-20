export type TitlesEntry = {
	season: number,
	champion: {
		uuid: string,
		winnings: number,
	},
	avgPlaceWinner: {
		uuid: string,
		avgPlace: number,
	},
	pointsWinner: {
		uuid: string,
		points: number,
	},
	mostYellowDays: {
		uuid: string,
		days: number,
	},
	playerOfTheYear: {
		uuid: string,
		months: number,
	},
	loserOfTheYear: {
		uuid: string,
		months: number,
	},
	bountyWinner: {
		uuid: string,
		knockouts: number,
	},
};

export type Titles = TitlesEntry[];
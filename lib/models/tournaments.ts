export type TournamentInfo = {
	scheduled: string,
	movedFrom: string,
	stake: number,
	location: string,
	catering: string,
	season: number,
};

export type TournamentNoShow = {
	player: string,
	reported: string,
	reason: string,
};

export type TournamentBountyHunters = {
	player: string,
	reported: string,
	reason: string,
};

export type Tournament = {
	uuid: string,
	info: TournamentInfo,
	noshows: TournamentNoShow[],
	result: string[],
	played: boolean,
	moved: boolean,
	bets: null,
	bountyHunters: object,
};

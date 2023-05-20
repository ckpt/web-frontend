export type PlayerProfile = {
	name: string,
	picture: string,
	birthday: string,
	email: string,
	description: string,
	allergies: string,
};

export type Player = {
	uuid: string,
	profile: PlayerProfile,
	nick: string,
	user: any,
	active: boolean,
	quotes: string[],
	gossip: object,
	complaints: object[],
	votes: object,
	debts: object[],
};

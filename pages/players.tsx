import MainLayout from "@/layouts/MainLayout";
import { usePlayers } from "@/lib/hooks/players";
import { useSeasonStandings } from "@/lib/hooks/seasons";
import { useTitles } from "@/lib/hooks/titles";
import { Standing } from "@/lib/models/seasons";
import Image from "next/image";
import React from "react";

const Standings = () => {
    const { players, isLoading: isPlayersLoading } = usePlayers();
    const { standings, isLoading: isStandingsLoading } = useSeasonStandings(undefined, true);
    const { titles, isLoading: isTitlessLoading } = useTitles(undefined, true);
    const loading = isPlayersLoading || isStandingsLoading || isTitlessLoading;

    if (loading) return <MainLayout><div className="text-zinc-200 text-center p-4">Henter data...</div></MainLayout>;

    const standingsFromID = (id: string): Standing | undefined => {
        const p = standings?.byWinnings.find(
            (player) => player.uuid === id
        );
        return p;
    };

    const numTrophyWins = (id: string): number => {
        const wins = titles?.filter(
            (t) => t.champion.uuid === id
        );

        return wins?.length || 0;
    };

    return (
        <MainLayout>
            <div className="text-zinc-200 text-center p-4 md:flex md:flex-wrap md:justify-center">
                {players?.sort((a, b) => {
                    if (a.nick > b.nick) return 1;
                    if (a.nick < b.nick) return -1;
                    return 0;
                }).map((player) => {
                    const pStandings = standingsFromID(player.uuid);
                    return (
                        <div key={"pl-" + player.nick} className="mb-4 border rounded text-left border-orange-300 md:w-96 md:mx-2">
                            {player.profile.picture &&
                                <Image className="inline mr-2 overflow-clip h-full object-cover rounded-l sepia opacity-70 bg-orange-300" src={"data:image/jpeg;base64," + player.profile.picture} alt="profile pic" width={112} height={112} />
                            }
                            {!player.profile.picture &&
                                <canvas style={{width: "112px"}} className="inline h-full object-fill mr-2 rounded-l bg-none"/>
                            }
                            <ul className="inline-block align-top text-xs md:text-sm py-1">
                                <li className="font-bold text-orange-300 text-sm md:text-base pb-1">{player.nick}</li>
                                <li><span className="text-orange-300">Navn:</span> {player.profile.name}</li>
                                <li><span className="text-orange-300">Pokaler:</span> {numTrophyWins(player.uuid)}</li>
                                <li><span className="text-orange-300">Gevinst:</span> {pStandings?.winnings}</li>
                                <li><span className="text-orange-300">Turneringer:</span> {pStandings?.played}</li>
                                <li><span className="text-orange-300">Vunnet/Andreplass:</span> {pStandings?.wins}/{(pStandings?.headsUp || 0) - (pStandings?.wins || 0)}</li>
                            </ul>
                        </div>
                    );
                })}
            </div>
        </MainLayout>
    );
};

export default Standings;
import MainLayout from "@/layouts/MainLayout";
import { useAuth } from "@/lib/contexts/auth";
import { usePlayers } from "@/lib/hooks/players";
import { useTournaments } from "@/lib/hooks/tournaments";
import { faListOl, faPersonWalkingLuggage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import Link from "next/link";
import React from "react";

const currentYear = DateTime.now().year;
const Calendar = () => {
    const { players, isLoading: isPlayersLoading } = usePlayers();
    const { tournaments, isLoading: isTournamentsLoading } = useTournaments(currentYear);
    const { isAdmin, isLoading: isAuthLoading } = useAuth();
    const loading = isPlayersLoading || isTournamentsLoading || isAuthLoading;

    if (loading) return <MainLayout><div className="text-zinc-200 text-center p-4">Henter data...</div></MainLayout>;

    const nickFromID = (id: string): string | undefined => {
        const p = players?.find(
            (player) => player.uuid === id
        );
        return p?.nick;
    };

    return (
        <MainLayout>
            <div className="text-zinc-200 text-center p-4" >
                <h1 className="mt-2 mb-4 text-lg text-green-300">Årets turneringer</h1>
                <div className="md:grid md:grid-cols-2 md:justify-center lg:mx-32 xl:mx-64 2xl:mx-96">
                    {tournaments?.sort((a, b) => {
                        if (a.info.scheduled > b.info.scheduled) return 1;
                        if (a.info.scheduled < b.info.scheduled) return -1;
                        return 0;
                    }).map((tournament, i) => {
                        const tScheduled = DateTime.fromISO(tournament.info.scheduled);
                        const tClasses = tournament.played ? "p-2 border rounded border-gray-400 text-gray-400 md:mx-2" : "relative p-2 border-2 rounded border-green-300 md:mx-2";
                        const lClasses = i % 2 != 0 ? " mb-6 md:mb-4" : " mb-2 md:mb-4"
                        return (
                            <div key={"tnr-" + tournament.info.scheduled} className={tClasses + lClasses}>
                                {!tournament.played &&
                                    <Link href="/noshow">
                                        <FontAwesomeIcon
                                            className="p-1 absolute left-2 bottom-2 rounded bg-orange-100 text-zinc-600 hover:bg-orange-300"
                                            fixedWidth={true}
                                            icon={faPersonWalkingLuggage}
                                        />
                                    </Link>
                                }
                                {!tournament.played && isAdmin &&
                                    <Link href={{ pathname: "/admin/results", hash: tournament.uuid}}>
                                        <FontAwesomeIcon
                                            className="p-1 absolute right-2 bottom-2 rounded bg-pink-100 text-zinc-600 hover:bg-pink-300"
                                            fixedWidth={true}
                                            icon={faListOl}
                                        />
                                    </Link>
                                }
                                {tScheduled.setLocale("no").toLocaleString(
                                    { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }
                                )}
                            </div>
                        );
                    })}

                </div>
            </div>
        </MainLayout>
    );
};

export default Calendar;
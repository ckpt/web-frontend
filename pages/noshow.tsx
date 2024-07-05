import MainLayout from "@/layouts/MainLayout";
import { useAuth } from "@/lib/contexts/auth";
import { usePlayers } from "@/lib/hooks/players";
import { useTournaments } from "@/lib/hooks/tournaments";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { Tournament, TournamentNoShow } from "@/lib/models/tournaments";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { poster, entityDeleter } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faRemove, faUser } from "@fortawesome/free-solid-svg-icons";
import NoShowTournamentSelector from "@/components/NoShowTournamentSelector";

const currentYear = DateTime.now().year;

const isPlayerNoShow = (tournament: Tournament, uuid: string): boolean => {
    if (!tournament.noshows) return false;
    return tournament.noshows.findIndex((ns: TournamentNoShow) => ns.player == uuid) != -1;
};

const NoShowEntryModal = ({ visible, children }: { visible: boolean, children: JSX.Element }) => {
    if (!visible) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-orange-900 bg-opacity-50 backdrop-blur-sm">
            <div className="bg-orange-800 text-zinc-200 shadow-lg shadow-zinc-800 py-2 px-4 rounded w-5/6 md:w-96 text-center overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

const NoShows = () => {
    const { players, isLoading: isPlayersLoading } = usePlayers();
    const { tournaments, isLoading: isTournamentsLoading } = useTournaments(currentYear);
    const { user, isLoading: isAuthLoading } = useAuth();
    const loading = isPlayersLoading || isTournamentsLoading || isAuthLoading;
    const tId = window && window.location.href.split('#')[1] || null;
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedTournament, setSelectedTournament] = useState<string>("");
    const [noShowReason, setNoShowReason] = useState<string>("");

    const currentPlayer = players?.find(
        (player) => player.user.username === user
    );

    const nickFromID = (id: string): string | undefined => {
        const p = players?.find(
            (player) => player.uuid === id
        );
        return p?.nick;
    };

    useEffect(() => {
        const tournament = tournaments?.find((t) => t.uuid == tId);
        if (tId && tournament && !tournament.played && !tournament.noshows?.find((ns) => ns.player == currentPlayer?.uuid) && selectedTournament == "") { setShowModal(true); setSelectedTournament(tId) }
    }, [tId, tournaments, currentPlayer?.uuid, selectedTournament]);


    const { trigger: addTrigger } = useSWRMutation(`/tournaments/${selectedTournament}/noshows`, poster);
    const { trigger: removeTrigger } = useSWRMutation(`/tournaments/:entity:/noshows/${currentPlayer?.uuid}`, entityDeleter);

    if (loading) return <MainLayout><div className="text-zinc-200 text-center p-4">Henter data...</div></MainLayout>;

    const tournament = tournaments?.find((t) => t.uuid == tId);
    if (tId && (!tournament || tournament.played)) return <MainLayout><div className="text-zinc-200 text-center p-4">Illegal tournament...</div></MainLayout>;

    const withNoShows = tournaments?.filter((t) => !t.played && t.noshows && t.noshows.length > 0);

    const deleteNoShowEntry = (tId: string) => {
        removeTrigger({entity: tId}).then(() => {
            mutate(`/seasons/${currentYear}/tournaments`);
        });
    };

    return (
        <>
            <MainLayout>
                <div className="text-zinc-200 text-center p-4" >
                    <h1 className="mt-2 mb-2 text-lg text-orange-300">Fraværsliste</h1>
                    <button onClick={(e) => {
                        e.preventDefault();
                        setShowModal(true);
                    }}>
                        <FontAwesomeIcon icon={faPlusCircle} size="xl" fixedWidth={true} className='text-orange-300 hover:text-orange-400 pr-1' />
                    </button>
                    {(!withNoShows || withNoShows.length == 0) && <h3 className="mt-8">Ingen fravær registrert!</h3>}
                    <div className="md:grid md:grid-cols-2 md:justify-center lg:mx-32 xl:mx-64 2xl:mx-96">
                        {withNoShows?.map((tnr, i) => {
                            const tScheduled = DateTime.fromISO(tnr.info.scheduled);
                            let nsList: JSX.Element[] = [];
                            tnr.noshows.map((ns, j) => {
                                nsList.push(
                                    <li className="text-sm" key={`noshow-item-${j}`}>
                                        {ns.player != currentPlayer?.uuid && <FontAwesomeIcon icon={faUser} fixedWidth={true} className='text-orange-300 pr-1' />}
                                        {ns.player == currentPlayer?.uuid && <button onClick={(e) => { e.preventDefault(); deleteNoShowEntry(tnr.uuid)}}><FontAwesomeIcon icon={faRemove} fixedWidth={true} className='text-pink-300 hover:text-pink-600 pr-1' /></button>}
                                        {nickFromID(ns.player)} ({ns.reason})
                                    </li>
                                );
                            })
                            return (
                                <div className="px-2 my-4 py-2 border-orange-300 rounded border md:mx-2" key={i}>
                                    <h3 className="">
                                        {tScheduled.setLocale("no").toLocaleString(
                                            { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }
                                        )}
                                    </h3>
                                    <p className="text-sm text-orange-300">{tnr.noshows.length} fravær</p>
                                    <ul className="text-zinc-300 mt-2 text-left">
                                        {nsList}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </MainLayout>
            <NoShowEntryModal visible={showModal}>
                <>
                    <h2 className="font-bold text-orange-300 mt-2">Registrer fravær</h2>
                    <NoShowTournamentSelector
                        tournaments={tournaments?.filter((t) => !t.played && !t.noshows?.find((ns) => ns.player == currentPlayer?.uuid)).sort((a, b) => {
                            if (a.info.scheduled < b.info.scheduled) return -1;
                            if (a.info.scheduled === b.info.scheduled) return 0;
                            return 1;
                        })}
                        selected={selectedTournament}
                        selectFunc={setSelectedTournament} />
                    <div className="mt-6">
                        <input
                            className="appearance-none bg-transparent border py-1 px-2 placeholder-zinc-400 rounded border-orange-300"
                            type="text"
                            value={noShowReason}
                            placeholder="Fraværsgrunn..."
                            onChange={(e) => { e.preventDefault(); setNoShowReason(e.target.value) }} />
                    </div>
                    <button
                        className="mt-4 mb-2 rounded py-1 px-2 bg-orange-300 hover:bg-orange-400 text-zinc-600"
                        disabled={noShowReason == "" || !currentPlayer || selectedTournament == ""}
                        onClick={(e) => {
                            e.preventDefault();
                            addTrigger({
                                player: currentPlayer!.uuid,
                                reported: DateTime.now().toISO(),
                                reason: noShowReason,
                            }).then(() => {
                                setShowModal(false);
                                mutate(`/seasons/${currentYear}/tournaments`);
                            });
                        }}
                    >
                        Bekreft
                    </button>

                </>
            </NoShowEntryModal>

        </>
    );
}

export default NoShows;
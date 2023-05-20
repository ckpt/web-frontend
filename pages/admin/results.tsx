import ResultEntryWidget from "@/components/ResultEntryWidget";
import MainLayout from "@/layouts/MainLayout";
import { useAuth } from "@/lib/contexts/auth";
import { usePlayers } from "@/lib/hooks/players";
import { useTournaments } from "@/lib/hooks/tournaments";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { Player } from "@/lib/models/player";
import { Tournament, TournamentNoShow } from "@/lib/models/tournaments";
import { faCheckCircle, faEdit, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { putter } from "@/lib/api";
import router from "next/router";

type ResultEntry = {
    player?: Player,
    bounty?: Player,
};

const currentYear = DateTime.now().year;

const isPlayerNoShow = (tournament: Tournament, uuid: string): boolean => {
    if (!tournament.noshows) return false;
    return tournament.noshows.findIndex((ns: TournamentNoShow) => ns.player == uuid) != -1;
};

const prepareResults = (results: ResultEntry[]) : {resData: string[], bhData: { [key: string]: string[] }} => {
    let resData: string[] = [];
    let bhData: { [key: string]: string[] } = {};
    results.forEach((r) => {
        resData.push(r.player!.uuid);
        if (r.bounty) {
            if (bhData[r.bounty.uuid]) {
                bhData[r.bounty!.uuid].push(r.player!.uuid);
            } else {
                bhData[r.bounty!.uuid] = [r.player!.uuid];
            }
        }
    });

    return {resData: resData, bhData: bhData};
};

const ResultEntryModal = ({ visible, children }: { visible: boolean, children: JSX.Element }) => {
    if (!visible) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-cyan-900 bg-opacity-50 backdrop-blur-sm">
            <div className="bg-cyan-800 text-zinc-200 shadow-lg shadow-zinc-800 py-2 px-4 rounded w-5/6 md:w-96 text-center">
                {children}
            </div>
        </div>
    );
};

const ResultsRegistration = () => {
    const { players, isLoading: isPlayersLoading } = usePlayers();
    const { tournaments, isLoading: isTournamentsLoading } = useTournaments(currentYear);
    const { isAdmin, isLoading: isAuthLoading } = useAuth();
    const loading = isPlayersLoading || isTournamentsLoading || isAuthLoading;
    const tId = window && window.location.href.split('#')[1] || null;
    const [results, setResults] = useState<ResultEntry[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const { trigger: bhTrigger } = useSWRMutation(`/tournaments/${tId}/bountyhunters`, putter);
    const { trigger: resultTrigger } = useSWRMutation(`/tournaments/${tId}/result`, putter);


    if (loading) return <MainLayout><div className="text-zinc-200 text-center p-4">Henter data...</div></MainLayout>;
    if (!isAdmin) return <MainLayout><div className="text-zinc-200 text-center p-4">You should not be here...</div></MainLayout>;
    if (!tId) return <MainLayout><div className="text-zinc-200 text-center p-4">No tournament given...</div></MainLayout>;

    const tournament = tournaments.find((t) => t.uuid == tId);
    if (!tournament || tournament.played) return <MainLayout><div className="text-zinc-200 text-center p-4">Illegal tournament...</div></MainLayout>;
    if (submitted) return <MainLayout><div className="text-zinc-200 text-center p-4">Registering results...</div></MainLayout>;
    const bountyNeeded = results.length > 1 && results[results.length - 1].player! && !results[results.length - 1].bounty;

    return (
        <>
            <MainLayout>
                <div className="text-zinc-200 text-center p-4" >
                    <h1 className="mt-2 mb-2 text-lg text-cyan-300">Resultatregistrering</h1>
                    <div className="mb-4 text-xs">{tournament.info.scheduled}</div>
                    {results.map((result, i) => (
                        <ResultEntryWidget key={i} place={i + 1} nick={result.player?.nick} bountyNick={result.bounty?.nick} />
                    ))}
                    <button onClick={(e) => { e.preventDefault(); setShowModal(true); }}>
                        <FontAwesomeIcon icon={faPlusCircle} fixedWidth={true} size="xl" className="text-cyan-300 mt-1 hover:text-cyan-400" />
                    </button>
                    {results.length >= 5 &&
                    <button onClick={(e) => {
                        e.preventDefault();
                        let {resData, bhData} = prepareResults(results);
                        bhTrigger(bhData).then(() => setTimeout(async () => await resultTrigger(resData), 1000));
                        setSubmitted(true);
                        mutate(`/seasons/${currentYear}/tournaments`);
                        router.back();
                        }}>
                        <FontAwesomeIcon icon={faCheckCircle} fixedWidth={true} size="xl" className="text-green-300 mt-1 ml-6 hover:text-green-400" />
                    </button>
                    }
                </div>
            </MainLayout>
            <ResultEntryModal visible={showModal}>
                <>
                    {!bountyNeeded &&
                        <>
                            <h2 className="font-bold text-cyan-300 mb-2">{results.length + 1}. plass</h2>
                            <div className="flex justify-center flex-col">
                                {players.filter((player) => (
                                    player.active &&
                                    !isPlayerNoShow(tournament, player.uuid) &&
                                    results.findIndex((r) => r.player?.uuid == player.uuid) == -1
                                )).sort((a, b) => {
                                    if (a.nick > b.nick) return 1;
                                    if (a.nick < b.nick) return -1;
                                    return 0;
                                }).map((player) => (
                                    <button
                                        key={player.uuid}
                                        className="p-1 mb-2 border rounded border-cyan-300 text-zinc-200 md:mx-2 hover:bg-cyan-300 hover:text-zinc-600"
                                        onClick={(e) => { e.preventDefault(); results.length == 0 && setShowModal(false); setResults(results.concat([{ player: player }])); }}>
                                        {player.nick}
                                    </button>
                                ))}
                            </div>
                        </>
                    }
                    {bountyNeeded &&
                        <>
                            <h2 className="font-bold text-cyan-300 mb-2">Slått ut av?</h2>
                            <div className="flex justify-center flex-col">
                                {players.filter((player) => (
                                    player.active &&
                                    !isPlayerNoShow(tournament, player.uuid) &&
                                    results.slice(0,-1).findIndex((r) => r.player?.uuid == player.uuid) != -1
                                )).sort((a, b) => {
                                    if (a.nick > b.nick) return 1;
                                    if (a.nick < b.nick) return -1;
                                    return 0;
                                }).map((player) => (
                                    <button
                                        key={player.uuid}
                                        className="p-1 mb-2 border rounded border-cyan-300 text-zinc-200 md:mx-2 hover:bg-cyan-300 hover:text-zinc-600"
                                        onClick={(e) => { e.preventDefault(); setShowModal(false); results[results.length-1].bounty = player; setResults(results); }}>
                                        {player.nick}
                                    </button>
                                ))}
                            </div>
                        </>
                    }
                </>
            </ResultEntryModal>
        </>
    );
};

export default ResultsRegistration;
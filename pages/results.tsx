import { SeasonColumns } from "@/components/columns";
import ResultsTable from "@/components/ResultsTable";
import Table from "@/components/Table";
import MainLayout from "@/layouts/MainLayout";
import { usePlayers } from "@/lib/hooks/players";
import { getCurrentForm, getLastHeadsUp, useSeasonStandings, useSeasonStats } from "@/lib/hooks/seasons";
import { useTournaments } from "@/lib/hooks/tournaments";
import { MonthStats, YellowPeriod } from "@/lib/models/seasons";
import { Tournament } from "@/lib/models/tournaments";
import { faCircleArrowLeft, faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import React, { useState } from "react";

const currentYear = DateTime.now().year;
const Results = () => {
    const [selectedSeason, setSelectedSeason] = useState<number>(currentYear);
    const [allSeasons, setAllSeasons] = useState<boolean>(false);
    const { players, isLoading: isPlayersLoading } = usePlayers();
    const { standings, isLoading: isStandingsLoading } = useSeasonStandings(selectedSeason, allSeasons);
    const { stats, isLoading: isStatsLoading } = useSeasonStats(selectedSeason, allSeasons);
    const { tournaments, isLoading: isTournamentsLoading } = useTournaments(selectedSeason);
    const loading = isPlayersLoading || isStandingsLoading || isTournamentsLoading || isStatsLoading;


    if (loading) return <MainLayout><div className="text-zinc-200 text-center p-4">Henter data...</div></MainLayout>;

    const nickFromID = (id: string): string | undefined => {
        const p = players?.find(
            (player) => player.uuid === id
        );
        return p?.nick;
    };

    const prepareStandingsTableData = (s: any[]): any[] => {
        let ret: any[] = [];
        if (!s) return ret;
        s.forEach(element => {
            let e = element;
            if (!e.nick) {
                e.nick = nickFromID(e.uuid);
            }
            ret.push(e);
        });
        return ret;
    };

    const getLongestYellow = (periods: YellowPeriod[]) => {
        periods.map((p) => {
            p.days = Math.floor(DateTime.fromISO(p.to).diff(DateTime.fromISO(p.from), 'days').as('days'));
        });
        return periods.sort((a, b) => {
            return b.days! - a.days!;
        }).slice(0, 15);
    };

    const countBy = (key: string, arr: any[]) : {uuid: string, count: number} => {
        return arr.map(function (elem) {
            return elem[key];
        }).reduce(function (acc, curr) {
            return acc[curr] = (acc[curr] || 0) + 1, acc
        }, {});
    }

    const prepareMonthStatsTableData = (s: MonthStats[], key: string, reverse: boolean = false) => {
        const counts = countBy(key, s);
        const ret = Object.entries(counts).map((c) => {
            return {nick: nickFromID(c[0]), count: c[1] as number}
        });
        if (reverse) {
            return ret.filter( (r) => r.nick ).sort((a,b) => { return a.count - b.count });
        }
        return ret.filter( (r) => r.nick ).sort((a,b) => { return b.count - a.count });
    };

    const prepareResultsTableData = (tnrs: Tournament[]) : { maxPlayers: number, data: any } => {
        let res : {"when": string, results: any}[] = [];
        let maxPlayers = 0;
        tnrs.filter((t) => t.played).sort((a,b) => {
            if (a.info.scheduled > b.info.scheduled) return 1;
            if (a.info.scheduled < b.info.scheduled) return -1;
            return 0;
        }).forEach((t) => {
            if (t.result.length > maxPlayers) {
                maxPlayers = t.result.length;
            }
            res.push({
                'when': DateTime.fromISO(t.info.scheduled).setLocale("no").toFormat("dd.LLL"),
                'results': t.result.map((p) => { return nickFromID(p) || '' })
            });
        });
        console.log("maxPlayers", maxPlayers, "res", res);
        return { maxPlayers, data: res };
    };

    return (
        <MainLayout>
            <div className="text-zinc-200 text-center p-4">
                <button
                    className="appearance-none text-sm border-2 hover:text-gray-900 hover:bg-pink-300
                rounded border-pink-300 text-pink-300 p-2 m-2"
                    onClick={(e) => { e.preventDefault(); if (!allSeasons) setSelectedSeason(selectedSeason - 1) }}
                    disabled={allSeasons}>
                    <FontAwesomeIcon icon={faCircleArrowLeft} fixedWidth={true} className='pr-1' />
                    Forrige
                </button>
                <button
                    className="appearance-none text-sm border-2 hover:text-gray-900 hover:bg-pink-300
                rounded border-pink-300 text-pink-300 p-2 m-2"
                    onClick={(e) => {
                        e.preventDefault();
                        if (allSeasons) {
                            setSelectedSeason(currentYear);
                            setAllSeasons(false);
                        } else {
                            setAllSeasons(true);
                        }
                    }}>
                    {!allSeasons ? "Alle år" : currentYear}
                </button>
                <button
                    className="appearance-none text-sm border-2 hover:text-gray-900 hover:bg-pink-300
                rounded border-pink-300 text-pink-300 p-2 m-2"
                    onClick={(e) => { e.preventDefault(); if (!allSeasons) setSelectedSeason(selectedSeason + 1) }}
                    disabled={allSeasons}>
                    Neste
                    <FontAwesomeIcon icon={faCircleArrowRight} fixedWidth={true} className='pl-1' />
                </button>
                <h1 className="mt-2 text-lg">Resultater for <span className="text-pink-300">
                    {allSeasons ? "alle år" : selectedSeason}
                </span>
                </h1>
                {!allSeasons && tournaments && <ResultsTable {...prepareResultsTableData(tournaments)} />}
                <div className="lg:flex lg:flex-wrap lg:justify-center">
                    <Table title="Gevinsttabell" color="orange"
                        columns={SeasonColumns["byWinnings"]} data={standings && prepareStandingsTableData(standings?.byWinnings)} />
                    <Table title="Plassiffer" color="zinc"
                        columns={SeasonColumns["byAvgPlace"]} data={standings && prepareStandingsTableData(standings?.byAvgPlace)} />
                    <Table title="Lavpoeng" color="zinc"
                        columns={SeasonColumns["byPoints"]} data={standings && prepareStandingsTableData(standings?.byPoints)} />
                    <Table title="Bounty Hunter" color="zinc"
                        columns={SeasonColumns["byKnockouts"]} data={standings && prepareStandingsTableData(standings?.byKnockouts)} />
                    <Table title="Seiere basert på spilte" color="zinc"
                        columns={SeasonColumns["byWinRatio"]} data={standings && prepareStandingsTableData(standings?.byWinRatio)} />
                    <Table title="Seiere basert på alle" color="zinc"
                        columns={SeasonColumns["byWinRatioTotal"]} data={standings && prepareStandingsTableData(standings?.byWinRatioTotal)} />
                    <Table title="Heads up" color="zinc"
                        columns={SeasonColumns["byHeadsUp"]} data={standings && prepareStandingsTableData(standings?.byHeadsUp)} />
                    <Table title="Fravær" color="zinc"
                        columns={SeasonColumns["byNumPlayed"]} data={standings && prepareStandingsTableData(standings?.byNumPlayed)} />
                    <Table title="Form" color="zinc"
                        columns={SeasonColumns["byForm"]} data={standings && getCurrentForm(standings)} />
                    <Table title={"Lengste periode med gult" + (allSeasons ? " (topp 15)" : "")} color="zinc"
                        columns={SeasonColumns["byLongestYellow"]} data={stats && prepareStandingsTableData(getLongestYellow(stats?.yellowPeriods))} />
                    <Table title="Månedens spiller" color="zinc"
                        columns={SeasonColumns["byMonthStats"]} data={stats && prepareMonthStatsTableData(stats?.monthStats, "best")} />
                    <Table title="Månedens krill" color="zinc"
                        columns={SeasonColumns["byMonthStats"]} data={stats && prepareMonthStatsTableData(stats?.monthStats, "worst", true)} />
                    <Table title="Månedens bounty hunter" color="zinc"
                        columns={SeasonColumns["byMonthStats"]} data={stats && prepareMonthStatsTableData(stats?.monthStats, "bountyhunter")} />
                    <Table title="Siste heads up" color="zinc"
                        columns={SeasonColumns["byLastHeadsUp"]} data={standings && getLastHeadsUp(standings)} />
                </div>
            </div>
        </MainLayout>
    );
};

export default Results;
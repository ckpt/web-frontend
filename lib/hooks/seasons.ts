import { fetcher } from "../api";
import useSWR, { preload } from "swr";
import useSWRImmutable from 'swr/immutable';
import type { SeasonStandings, SeasonStats, YellowPeriod } from "../models/seasons";
import { DateTime } from "luxon";

export const useSeasonList = () => {
    const {data, error,  isLoading} = useSWRImmutable<number[]>('/seasons', fetcher);
    return {data, error, isLoading};
};

export const useSeasonStandings = (year: number = new Date().getFullYear(), total: boolean = false) => {
    const { data: totalData, error: totalError, isLoading: totalIsLoading } = useSWR<SeasonStandings>(total ? `/seasons/standings` : null, fetcher, { revalidateOnFocus: false });
    const { data, error, isLoading } = useSWR<SeasonStandings>(!total ? `/seasons/${year}/standings` : null, fetcher, { revalidateOnFocus: false, dedupingInterval: 300000 });
    if (total) {
        return {
            standings: totalData,
            isLoading: totalIsLoading,
            isError: totalError,
        };
    }

    preload(`/seasons/${year - 1}/standings`, fetcher);
    return {
        standings: data,
        isLoading,
        isError: error,
    };
};

export const getCurrentForm = (_standings: SeasonStandings) => {
    let playerForm: { nick: string, form: number[] }[] = [];
    _standings.byWinnings.forEach((entry) => {
        var sortedResults = entry.results.sort((a, b) => {
            if (a.when < b.when) return -1;
            if (a.when == b.when) return 0;
            return 1;
        });
        playerForm.push({ nick: entry.nick!, form: sortedResults.map(a => a.place).slice(-4).reverse() });
    });
    return playerForm.sort((pa, pb) => {
        let pfa = pa.form.reduce((a, b) => { return (0.0 + a + b) }) / pa.form.length;
        let pfb = pb.form.reduce((a, b) => { return (0.0 + a + b) }) / pb.form.length; 
        if (pfa < pfb) return -1;
        if (pfa === pfb) {
            return pa.form[0] - pb.form[0];
        }
        return 1;
    });
};

export const getLastHeadsUp = (_standings: SeasonStandings) => {
    let lastHeadsUp: {nick: string, days: number, when: string}[] = [];
    _standings.byWinnings.forEach((entry) => {
        const sortedResults = entry.results.sort((a, b) => {
            if (a.when < b.when) return 1;
            if (a.when == b.when) return 0;
            return -1;
        });
        const last = sortedResults.find((res) => (res.place === 1 || res.place === 2) );
        if (last) {
            const lastDate = DateTime.fromISO(last.when);
            const days = Math.floor(-lastDate.diffNow('days').as('days'));
            lastHeadsUp.push({nick: entry.nick!, days: days, when: `${days}d (${lastDate.toISODate()})`});
        }
    });

    return lastHeadsUp.sort((a,b) => { return a.days - b.days; });
};

export const useSeasonStats = (year: number = new Date().getFullYear(), total: boolean = false) => {
    const { data: totalData, error: totalError, isLoading: totalIsLoading } = useSWR<SeasonStats>(total ? `/seasons/stats` : null, fetcher, { revalidateOnFocus: false });
    const { data, error, isLoading } = useSWR<SeasonStats>(!total ? `/seasons/${year}/stats` : null, fetcher, { revalidateOnFocus: false, dedupingInterval: 300000 });
    if (total) {
        return {
            stats: totalData,
            isLoading: totalIsLoading,
            isError: totalError
        };
    }
    preload(`/seasons/${year - 1}/stats`, fetcher);
    return {
        stats: data,
        isLoading,
        isError: error
    };
};

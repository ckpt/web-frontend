import { fetcher } from "../api";
import useSWR, { preload } from "swr";
import type { Tournament, TournamentNoShow } from "../models/tournaments";

export const useTournaments = (year: number = new Date().getFullYear(), all: boolean = false) => {
    const { data: allData, error: allError, isLoading: allLoading } = useSWR<Tournament[]>(all ? `/tournaments` : null, fetcher, {revalidateOnFocus: false, dedupingInterval: 300000});
    const { data, error, isLoading } = useSWR<{tournaments: Tournament[]}>(!all ? `/seasons/${year}/tournaments` : null, fetcher, {revalidateOnFocus: false, dedupingInterval: 300000});
    if (all) {
        return {
            tournaments: allData,
            isLoading: allLoading,
            isError: allError
        };
    }
    preload(`/seasons/${year - 1}/tournaments`, fetcher);
    return {
        tournaments: data?.tournaments,
        isLoading,
        isError: error
    };
};



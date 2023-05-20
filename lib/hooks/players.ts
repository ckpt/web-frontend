import { fetcher } from "../api";
import useSWR from "swr";
import type { Player } from "../models/player";

export const usePlayers = () => {
    const { data, error, isLoading } = useSWR<Player[]>('/players', fetcher, {revalidateOnFocus: false, dedupingInterval: 300000})

    return {
        players: data,
        isLoading,
        isError: error
    }
};

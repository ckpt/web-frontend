import { fetcher } from "../api";
import useSWR, { preload } from "swr";
import { Titles } from "../models/titles";

export const useTitles = (year: number = new Date().getFullYear(), total: boolean = false) => {
    const { data: totalData, error: totalError, isLoading: totalIsLoading } = useSWR<Titles>(total ? `/seasons/titles` : null, fetcher, { revalidateOnFocus: false });
    const { data, error, isLoading } = useSWR<Titles>(!total ? `/seasons/${year}/titles` : null, fetcher, { revalidateOnFocus: false, dedupingInterval: 300000 });
    if (total) {
        return {
            titles: totalData,
            isLoading: totalIsLoading,
            isError: totalError,
        };
    }

    preload(`/seasons/${year - 1}/titles`, fetcher);
    return {
        titles: data,
        isLoading,
        isError: error,
    };
};

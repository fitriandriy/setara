import { useState, useEffect, useCallback } from 'react';
import { GetData } from '../utils/GetData';
import { AxiosError } from 'axios';

export function useFetchData<T>(url: string, token: string | null | undefined) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState<AxiosError | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setIsError(null);
        try {
            const result = await GetData<T>(url, token);
            setData(result);
        } catch (error: unknown) {
            setIsError(error as AxiosError);
        }
        setIsLoading(false);
    }, [url, token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = () => {
        fetchData();
    };

    return { data, isLoading, isError, refetch };
}

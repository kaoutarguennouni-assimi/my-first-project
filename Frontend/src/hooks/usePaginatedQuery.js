import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

export function usePaginatedQuery(queryKey, endpoint, options = {}) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({});

    const params = new URLSearchParams({
        page,
        per_page: options.perPage ?? 12,
        ...(search && { search }),
        ...filters,
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: [...queryKey, page, search, filters],
        queryFn: async () => (await api.get(`${endpoint}?${params}`)).data,
        placeholderData: (previousData) => previousData,
        staleTime: 30_000,
    });

    return {
        items:      data?.data ?? [],
        meta:       data?.meta ?? {},
        isLoading,
        isError,
        page,
        setPage,
        search,
        setSearch,
        filters,
        setFilters,
        totalPages: data?.meta?.last_page ?? 1,
        totalItems: data?.meta?.total ?? 0,
    };
}

export function useAllQuery(queryKey, endpoint) {
    return useQuery({
        queryKey,
        queryFn: async () => (await api.get(`${endpoint}?all=true`)).data?.data ?? [],
        staleTime: 60_000,
    });
}
import { useState, useEffect, useMemo, useCallback } from "react";
import axios, { AxiosError, CanceledError } from "axios";

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

export interface PaginationInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharacterFilter {
  name?: string;
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
}

export interface ErrorResponse {
  status?: number;
  message: string;
}

const API_BASE_URL = "https://rickandmortyapi.com/api/character/";

const buildUrl = (page: number, filterData?: CharacterFilter) => {
  const params = new URLSearchParams();
  params.append("page", String(page));

  if (filterData && Object.keys(filterData).length > 0) {
    Object.entries(filterData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, String(value));
      }
    });
  }

  return `${API_BASE_URL}?${params.toString()}`;
};

/**
 * Custom hook for interacting with the Rick and Morty API
 * @param initialPage - Starting page number (default: 1)
 * @param initialFilter - Initial filter criteria
 */
export const useRickAndMorty = (initialPage = 1, initialFilter?: CharacterFilter) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [filters, setFilters] = useState<CharacterFilter>(initialFilter ?? {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorResponse>();
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    count: 0,
    pages: 0,
    next: null,
    prev: null,
  });

  const fetchCharacters = useCallback(
    async (abortSignal?: AbortSignal) => {
      try {
        setLoading(true);
        setError(undefined);

        const requestUrl = buildUrl(currentPage, filters);
        const response = await axios.get<ApiResponse>(requestUrl, {
          signal: abortSignal,
        });

        console.log(response.data);
        setCharacters(response.data.results);
        setPaginationInfo(() => ({
          ...response.data.info,
        }));
        setLoading(false);
      } catch (err) {
        if (err instanceof CanceledError) {
          console.log("Request canceled:", err.message);
          setCharacters([]);
          return;
        }

        const axiosError = err as AxiosError;
        setError({
          status: axiosError.response?.status ?? 500,
          message: axiosError.message || "An unknown error occurred",
        });
        setCharacters([]);
      }

      setLoading(false);
    },
    [filters, currentPage]
  );

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= paginationInfo.pages) {
        setCurrentPage(page);
      }
    },
    [paginationInfo.pages]
  );

  const goToNextPage = useCallback(() => {
    if (paginationInfo.next) {
      setCurrentPage((prev) => {
        console.log(prev + 1);
        return prev + 1;
      });
    }
  }, [paginationInfo.next]);

  const goToPrevPage = useCallback(() => {
    if (paginationInfo.prev) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [paginationInfo.prev]);

  const filterCharacters = useCallback((newFilter: CharacterFilter) => {
    setFilters(newFilter);
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    void fetchCharacters(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [currentPage, filters, fetchCharacters]);

  return useMemo(() => {
    return {
      characters,
      paginationInfo,
      currentPage,
      loading,
      error,
      filters,
      fetchCharacters,
      filterCharacters,
      clearFilters,
      goToNextPage,
      goToPrevPage,
      goToPage,
    };
  }, [
    characters,
    paginationInfo,
    currentPage,
    loading,
    error,
    filters,
    fetchCharacters,
    filterCharacters,
    clearFilters,
    goToNextPage,
    goToPrevPage,
    goToPage,
  ]);
};

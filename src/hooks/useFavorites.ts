import { useState, useEffect, useMemo, useCallback } from "react";
import { Character } from "./useRickAndMorty";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Character[]>(() => {
    const savedFavorites = localStorage.getItem("rickAndMortyFavorites");
    return savedFavorites ? (JSON.parse(savedFavorites) as Character[]) : [];
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalPages = useMemo(
    () => Math.ceil(favorites.length / itemsPerPage),
    [favorites.length, itemsPerPage]
  );

  const paginatedFavorites = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return favorites.slice(startIndex, endIndex);
  }, [favorites, currentPage, itemsPerPage]);

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const addFavorite = useCallback(
    (character: Character) => {
      if (!favorites.some((fav) => fav.id === character.id)) {
        setFavorites((prev) => [...prev, character]);
        setTimeout(() => {
          goToPage(totalPages + 1);
        }, 0);
      }
    },
    [favorites, goToPage, totalPages]
  );

  const removeFavorite = useCallback((characterId: number) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== characterId));
  }, []);

  const isFavorite = useCallback(
    (characterId: number) => {
      return favorites.some((fav) => fav.id === characterId);
    },
    [favorites]
  );

  useEffect(() => {
    localStorage.setItem("rickAndMortyFavorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return {
    favorites: paginatedFavorites,
    totalFavorites: favorites.length,
    currentPage,
    totalPages,
    itemsPerPage,
    addFavorite,
    setItemsPerPage,
    removeFavorite,
    isFavorite,
    goToPage,
    nextPage,
    prevPage,
  };
};

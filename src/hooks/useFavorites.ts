import { useState, useEffect } from "react";
import { Character } from "./useRickAndMorty";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Character[]>(() => {
    const savedFavorites = localStorage.getItem("rickAndMortyFavorites");
    if (savedFavorites) {
      return JSON.parse(savedFavorites) as Character[];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("rickAndMortyFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (character: Character) => {
    if (!favorites.some((fav) => fav.id === character.id)) {
      setFavorites((prev) => [...prev, character]);
    }
  };

  const removeFavorite = (characterId: number) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== characterId));
  };

  const isFavorite = (characterId: number) => {
    return favorites.some((fav) => fav.id === characterId);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
};

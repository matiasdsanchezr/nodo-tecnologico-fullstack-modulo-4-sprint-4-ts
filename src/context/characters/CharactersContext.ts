import { createContext, use } from "react";
import { useRickAndMorty } from "../../hooks/useRickAndMorty";
import { useFavorites } from "../../hooks/useFavorites";

export type RickAndMortyData = ReturnType<typeof useRickAndMorty>;
export type FavoritesData = ReturnType<typeof useFavorites>;
export interface CharactersContextType extends RickAndMortyData, FavoritesData {}

export const CharactersContext = createContext<CharactersContextType | undefined>(
  undefined
);

export const useCharactersContext = () => {
  const context = use(CharactersContext);
  if (!context) {
    throw new Error("useCharactersContext must be used within a CharactersProvider");
  }
  return context;
};

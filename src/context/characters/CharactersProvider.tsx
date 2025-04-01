import { ReactNode, useMemo } from "react";
import { useRickAndMorty } from "../../hooks/useRickAndMorty";
import { useFavorites } from "../../hooks/useFavorites";
import { CharactersContext } from "./CharactersContext";

interface CharactersProviderProps {
  children: ReactNode;
}

export const CharactersProvider = ({ children }: CharactersProviderProps) => {
  const rickAndMortyData = useRickAndMorty();
  const favoritesData = useFavorites();

  const value = useMemo(
    () => ({
      ...rickAndMortyData,
      ...favoritesData,
    }),
    [favoritesData, rickAndMortyData]
  );

  return (
    // eslint-disable-next-line react-x/no-context-provider
    <CharactersContext.Provider value={value}>{children}</CharactersContext.Provider>
  );
};

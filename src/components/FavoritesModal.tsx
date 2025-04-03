import { useState } from "react";
import { useCharactersContext } from "../context/characters";
import { Character } from "../hooks/useRickAndMorty";

const FavoriteModalItem = ({ character }: { character: Character }) => {
  const { removeFavorite } = useCharactersContext();

  return (
    <div className="flex flex-col items-center bg-primary dark:bg-dark-primary rounded-lg shadow-md overflow-hidden p-4 space-x-4 sm:flex-row">
      <img
        src={character.image}
        alt={`portada de ${character.name}`}
        className="w-20 h-28 object-cover rounded-md bg-white"
      />
      <div className="flex-1 flex flex-col gap-1 items-center sm:items-start">
        <h3 className="dark:text-text-primary text-lg font-bold">{character.name}</h3>
      </div>
      <button
        type="button"
        className="bg-state-error hover:bg-red-600 active:bg-red-700 text-text-primary py-2 px-4 rounded-md font-semibold transition-colors duration-300"
        onClick={() => {
          removeFavorite(character.id);
        }}
      >
        <i className="ph ph-trash"></i> Eliminar
      </button>
    </div>
  );
};

interface FavoritesModal {
  isModalOpen: boolean;
  onCloseModal: () => void;
}

export const FavoritesModal = ({ isModalOpen, onCloseModal }: FavoritesModal) => {
  const [itemsPerPageInput, setItemsPerPageInput] = useState(5);
  const {
    favorites,
    totalFavorites,
    currentPage,
    totalPages,
    setItemsPerPage,
    nextPage,
    prevPage,
  } = useCharactersContext();

  const handleClickOutsideModal = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCloseModal();
    }
  };

  const handleClickButton = () => {
    setItemsPerPage(itemsPerPageInput);
  };

  return (
    <div
      className={`fixed inset-0 bg-shadow-medium bg-opacity-75 ${
        isModalOpen ? "flex" : "hidden"
      } justify-center items-center z-50`}
      onMouseDown={handleClickOutsideModal}
    >
      <div className="bg-secondary dark:bg-dark-secondary rounded-lg p-6 relative w-full max-w-3xl  overflow-hidden">
        {/* <!-- Button close --> */}
        <button
          type="button"
          id="closeModal"
          className="absolute top-2 right-2 dark:text-text-secondary hover:text-text-primary text-2xl"
          onClick={onCloseModal}
        >
          &times;
        </button>

        {/* <!-- Content modal --> */}
        <h2 className="dark:text-text-primary text-lg font-bold text-center py-3">
          Personajes favoritos
        </h2>

        {favorites.length < 1 ? (
          <p className="dark:text-text-secondary text-center">
            No tienes ningún personaje favorito. Añade alguno.
          </p>
        ) : (
          <div className="dark:bg-dark-secondary/900 py-6 px-4 overflow-y-auto max-h-[65vh] space-y-4">
            <div className="text-center">
              <p>Personajes guardados: {totalFavorites}</p>
              <div className="text-center">
                <label htmlFor="itemsPerPageInput">
                  Cantidad de personajes por página
                </label>
                <div className="grid sm:flex gap-3 p-3 m-auto w-min">
                  <input
                    id="itemsPerPageInput"
                    placeholder="Ingrese un numero"
                    type="number"
                    min="1"
                    onChange={(e) => {
                      setItemsPerPageInput(parseInt(e.target.value));
                    }}
                    className="input"
                  />
                  <button type="button" onClick={handleClickButton} className="button">
                    Cargar
                  </button>
                </div>
              </div>
            </div>
            {favorites.map((character) => (
              <FavoriteModalItem key={character.id} character={character} />
            ))}
            <h3 className="text-center">Pagina actual: {currentPage}</h3>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                className="button"
                onClick={prevPage}
                disabled={currentPage < 2}
              >
                Anterior
              </button>
              <button
                type="button"
                className="button"
                onClick={nextPage}
                disabled={currentPage >= totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

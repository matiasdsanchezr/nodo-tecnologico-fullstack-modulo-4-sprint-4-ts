import { useEffect } from "react";
import "./App.css";
import { CharactersProvider } from "./context/characters";

import { Home } from "./pages/Home";

function App() {
  useEffect(() => {
    document.documentElement.classList.toggle("dark");
  }, []);

  return (
    <>
      <CharactersProvider>
        <Home />
      </CharactersProvider>
    </>
  );
}

export default App;

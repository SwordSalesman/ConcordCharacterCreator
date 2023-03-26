import { createContext, useEffect, useState } from "react";

const FormContext = createContext();

function FormContextProvider({ children }) {
  // State maintained

  const [realm, setRealm] = useState(null);
  const [gamesPlayed, setGamesPlayed] = useState(0);

  // Handling functions

  const selectRealm = (selectedRealm) => {
    setRealm(selectedRealm);
  };

  // Local Storage management

  useEffect(() => {
    setRealm(JSON.parse(window.localStorage.getItem("realm")));
    setGamesPlayed(JSON.parse(window.localStorage.getItem("gamesPlayed")));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("realm", JSON.stringify(realm));
  }, [realm]);

  useEffect(() => {
    window.localStorage.setItem("gamesPlayed", gamesPlayed);
  }, [gamesPlayed]);

  // Outputs

  const formContext = {
    realm,
    selectRealm,
    gamesPlayed,
    setGamesPlayed,
  };

  return (
    <FormContext.Provider value={formContext}>{children}</FormContext.Provider>
  );
}

export { FormContextProvider };
export default FormContext;

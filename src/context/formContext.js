import { createContext, useEffect, useState } from "react";

const FormContext = createContext();

function FormContextProvider({ children }) {
  // State maintained

  const [realm, setRealm] = useState(null);

  // Handling functions

  const selectRealm = (selectedRealm) => {
    setRealm(selectedRealm);
  };

  // Local Storage management

  useEffect(() => {
    setRealm(JSON.parse(window.localStorage.getItem("realm")));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("realm", JSON.stringify(realm));
  }, [realm]);

  // Outputs

  const formContext = {
    realm,
    selectRealm,
  };

  return (
    <FormContext.Provider value={formContext}>{children}</FormContext.Provider>
  );
}

export { FormContextProvider };
export default FormContext;

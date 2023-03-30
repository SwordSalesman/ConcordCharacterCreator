import { createContext, useEffect, useState } from "react";

const FormContext = createContext();

function FormContextProvider({ children }) {
  // State maintained

  const [realm, setRealm] = useState(null);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [skills, setSkills] = useState([]);

  // Handling functions

  const selectRealm = (selectedRealm) => {
    setRealm(selectedRealm);
  };

  const selectSkill = (skill) => {
    if (!skills) {
      setSkills([skill]);
    } else if (skills?.includes(skill)) {
      return;
    } else {
      setSkills([...skills, skill]);
    }
  };

  const removeSkill = (skill) => {
    if (!skills) {
      return;
    } else {
      setSkills(
        skills.filter((s) => !(s.name === skill.name && s.cost === skill.cost))
      );
    }
  };

  // Local Storage management

  useEffect(() => {
    setRealm(JSON.parse(window.localStorage.getItem("realm")));
    setGamesPlayed(JSON.parse(window.localStorage.getItem("gamesPlayed")));
    setSkills(JSON.parse(window.localStorage.getItem("skills")));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("realm", JSON.stringify(realm));
  }, [realm]);

  useEffect(() => {
    window.localStorage.setItem("gamesPlayed", gamesPlayed);
  }, [gamesPlayed]);

  useEffect(() => {
    window.localStorage.setItem("skills", JSON.stringify(skills));
  }, [skills]);

  // Outputs

  const formContext = {
    realm,
    selectRealm,
    gamesPlayed,
    setGamesPlayed,
    skills,
    selectSkill,
    removeSkill,
  };

  return (
    <FormContext.Provider value={formContext}>{children}</FormContext.Provider>
  );
}

export { FormContextProvider };
export default FormContext;

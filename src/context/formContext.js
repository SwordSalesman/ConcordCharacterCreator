import { createContext, useEffect, useState } from "react";

const FormContext = createContext();

function FormContextProvider({ children }) {
  // State maintained

  const [realm, setRealm] = useState(null);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [skills, setSkills] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [spells, setSpells] = useState([]);
  const [crafts, setCrafts] = useState([]);
  const [potions, setPotions] = useState([]);
  const [ceremonies, setCeremonies] = useState([]);

  // Derived Variables
  const totalXp = 8 + parseInt(gamesPlayed ? gamesPlayed : 0);
  const remainingXp =
    totalXp -
    (skills ? skills.map((s) => s.cost).reduce((a, b) => a + b, 0) : 0);

  // Genertic functions

  const selectItem = (
    item,
    itemSet,
    setItems,
    equateItems = (a, b) => {
      return a.name === b.name;
    }
  ) => {
    if (!itemSet) {
      setItems([item]);
    } else if (itemSet?.filter((i) => equateItems(i, item)).length > 0) {
      return;
    } else {
      setItems([...itemSet, item]);
    }
  };

  const removeItem = (
    item,
    itemSet,
    setItems,
    equateItems = (a, b) => {
      return a.name === b.name;
    }
  ) => {
    if (!itemSet) {
      return;
    } else {
      setItems(itemSet.filter((i) => !equateItems(i, item)));
    }
  };

  const toggleItem = (
    item,
    itemSet,
    setItems,
    itemId = (i) => i.name,
    equateItems = (a, b) => {
      return a.name === b.name;
    }
  ) => {
    if (itemSet?.map((i) => itemId(i)).includes(itemId(item))) {
      removeItem(item, itemSet, setItems, equateItems);
    } else {
      selectItem(item, itemSet, setItems, equateItems);
    }
  };

  // Handling functions

  const selectRealm = (selectedRealm) => {
    setRealm(selectedRealm);
  };

  // const selectSkill = (skill) => {
  //   selectItem(skill, skills, setSkills);
  // };

  // const removeSkill = (skill) => {
  //   removeItem(skill, skills, setSkills);
  // };

  // skill should be a skillObj formatted as if from the SkillItem method call
  const validSkillChoice = (skill) => {
    let prereqMet =
      !skill.prereq || skills?.map((s) => s.name).includes(skill.prereq);
    let notExcluded =
      !skill.exclusion || !skills?.map((s) => s.name).includes(skill.exclusion);
    return prereqMet && notExcluded;
  };

  const toggleSkill = (skill) => {
    toggleItem(skill, skills, setSkills);
  };

  // const selectInvestment = (investment) => {
  //   selectItem(investment, investments, setInvestments);
  // };

  // const removeInvestment = (investment) => {
  //   removeItem(investment, investments, setInvestments);
  // };

  const toggleInvestment = (investment) => {
    toggleItem(investment, investments, setInvestments);
  };

  // const selectSpell = (spell) => {
  //   selectItem(spell, spells, setSpells);
  // };

  // const removeSpell = (spell) => {
  //   removeItem(spell, spells, setSpells);
  // };

  const toggleSpell = (spell) => {
    toggleItem(spell, spells, setSpells);
  };

  // const selectCraft = (craft) => {
  //   selectItem(craft, crafts, setCrafts);
  // };

  // const removeCraft = (craft) => {
  //   removeItem(craft, crafts, setCrafts);
  // };

  const toggleCraft = (craft) => {
    toggleItem(craft, crafts, setCrafts);
  };

  // const selectPotion = (potion) => {
  //   selectItem(potion, potions, setPotions);
  // };

  // const removePotion = (potion) => {
  //   removeItem(potion, potions, setPotions);
  // };

  const togglePotion = (potion) => {
    toggleItem(potion, potions, setPotions);
  };

  // const selectCeremony = (ceremony) => {
  //   selectItem(ceremony, ceremonies, setCeremonies);
  // };

  // const removeCeremony = (ceremony) => {
  //   removeItem(ceremony, ceremonies, setCeremonies);
  // };

  const toggleCeremony = (ceremony) => {
    toggleItem(ceremony, ceremonies, setCeremonies);
  };

  // Local Storage management

  useEffect(() => {
    setRealm(JSON.parse(window.localStorage.getItem("realm")));
    setGamesPlayed(JSON.parse(window.localStorage.getItem("gamesPlayed")));
    setSkills(JSON.parse(window.localStorage.getItem("skills")));
    setInvestments(JSON.parse(window.localStorage.getItem("investments")));
    setSpells(JSON.parse(window.localStorage.getItem("spells")));
    setCrafts(JSON.parse(window.localStorage.getItem("crafts")));
    setPotions(JSON.parse(window.localStorage.getItem("potions")));
    setCeremonies(JSON.parse(window.localStorage.getItem("ceremonies")));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("realm", JSON.stringify(realm));
  }, [realm]);

  useEffect(() => {
    window.localStorage.setItem("gamesPlayed", gamesPlayed);
  }, [gamesPlayed]);

  useEffect(() => {
    window.localStorage.setItem("skills", JSON.stringify(skills));

    skills.forEach((s) => {
      if (!validSkillChoice(s) || remainingXp < 0) {
        toggleSkill(s);
      }
    });

    if (!skills.map((s) => s.name).includes("Magus")) {
      setSpells([]);
    }
    if (!skills.map((s) => s.name).includes("Apothecary")) {
      setPotions([]);
    }
    if (!skills.map((s) => s.name).includes("Artisan")) {
      setCrafts([]);
    }
    if (!skills.filter((s) => s.name.startsWith("Divine Lore")).length) {
      setCeremonies([]);
    }
  }, [skills, remainingXp]);

  useEffect(() => {
    window.localStorage.setItem("investments", JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    window.localStorage.setItem("spells", JSON.stringify(spells));
  }, [spells]);

  useEffect(() => {
    window.localStorage.setItem("crafts", JSON.stringify(crafts));
  }, [crafts]);

  useEffect(() => {
    window.localStorage.setItem("potions", JSON.stringify(potions));
  }, [potions]);

  useEffect(() => {
    window.localStorage.setItem("ceremonies", JSON.stringify(ceremonies));
  }, [ceremonies]);

  // Outputs

  const formContext = {
    realm,
    selectRealm,
    gamesPlayed,
    setGamesPlayed,
    skills,
    // selectSkill,
    // removeSkill,
    remainingXp,
    toggleSkill,
    validSkillChoice,
    investments,
    // selectInvestment,
    // removeInvestment,
    toggleInvestment,
    spells,
    // selectSpell,
    // removeSpell,
    toggleSpell,
    crafts,
    // selectCraft,
    // removeCraft,
    toggleCraft,
    potions,
    // selectPotion,
    // removePotion,
    togglePotion,
    ceremonies,
    // selectCeremony,
    // removeCeremony,
    toggleCeremony,
  };

  return (
    <FormContext.Provider value={formContext}>{children}</FormContext.Provider>
  );
}

export { FormContextProvider };
export default FormContext;

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
    const [heroName, setHeroName] = useState(null);
    const [archetypes, setArchetypes] = useState([]);
    const [graces, setGraces] = useState([]);
    const [warband, setWarband] = useState(null);
    const [sect, setSect] = useState(null);
    const [icGoals, setIcGoals] = useState(null);
    const [oocGoals, setOocGoals] = useState(null);
    const [backstory, setBackstory] = useState(null);
    const [investmentDetails, setInvestmentDetails] = useState(null);

    // Derived Variables
    const totalXp = 8 + parseInt(gamesPlayed ? gamesPlayed : 0);
    const remainingXp =
        totalXp -
        (skills ? skills.map((s) => s.cost).reduce((a, b) => a + b, 0) : 0);

    // Get entire state
    const getForm = () => {
        return {
            realm: realm,
            gamesPlayed: gamesPlayed,
            skills: skills,
            investments: investments,
            spells: spells,
            crafts: crafts,
            potions: potions,
            ceremonies: ceremonies,
            heroName: heroName,
            archetypes: archetypes,
            graces: graces,
            warband: warband,
            sect: sect,
            icGoals: icGoals,
            oocGoals: oocGoals,
            backstory: backstory,
            investmentDetails: investmentDetails,
        };
    };

    const unsaved = false;

    const setForm = (data) => {
        setRealm(data.realm);
        setGamesPlayed(data.gamesPlayed);
        setSkills(data.skills);
        setInvestments(data.investments);
        setSpells(data.spells);
        setCrafts(data.crafts);
        setPotions(data.potions);
        setCeremonies(data.ceremonies);
        setHeroName(data.heroName);
        setArchetypes(data.archetypes);
        setGraces(data.graces);
        setWarband(data.warband);
        setSect(data.sect);
        setIcGoals(data.icGoals);
        setOocGoals(data.oocGoals);
        setBackstory(data.backstory);
        setInvestmentDetails(data.investmentDetails);
    };

    const resetForm = () => {
        setRealm(null);
        setGamesPlayed(0);
        setSkills([]);
        setInvestments([]);
        setSpells([]);
        setCrafts([]);
        setPotions([]);
        setCeremonies([]);
        setHeroName(null);
        setArchetypes([]);
        setGraces([]);
        setWarband(null);
        setSect(null);
        setIcGoals(null);
        setOocGoals(null);
        setBackstory(null);
        setInvestmentDetails(null);
    };

    // Generic functions

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
        setArchetypes([]);
    };

    // skill should be a skillObj formatted as if from the SkillItem method call
    const validSkillChoice = (skill) => {
        let prereqMet =
            !skill.prereq || skills?.map((s) => s.name).includes(skill.prereq);
        let notExcluded =
            !skill.exclusion ||
            !skills?.map((s) => s.name).includes(skill.exclusion);
        return prereqMet && notExcluded;
    };

    const toggleSkill = (skill) => {
        toggleItem(skill, skills, setSkills);
    };

    const toggleInvestment = (investment) => {
        toggleItem(investment, investments, setInvestments);
    };

    const toggleSpell = (spell) => {
        toggleItem(spell, spells, setSpells);
    };

    const toggleCraft = (craft) => {
        toggleItem(craft, crafts, setCrafts);
    };

    const togglePotion = (potion) => {
        toggleItem(potion, potions, setPotions);
    };

    const toggleCeremony = (ceremony) => {
        toggleItem(ceremony, ceremonies, setCeremonies);
    };

    const toggleArchetype = (archetype) => {
        toggleItem(archetype, archetypes, setArchetypes);
    };

    const toggleGrace = (grace) => {
        toggleItem(grace, graces, setGraces);
    };

    // Local Storage management

    // useEffect(() => {
    //     setRealm(JSON.parse(window.localStorage.getItem("realm")));
    //     setGamesPlayed(
    //         JSON.parse(window.localStorage.getItem("gamesPlayed")) || 0
    //     );
    //     setSkills(JSON.parse(window.localStorage.getItem("skills")));
    //     setInvestments(JSON.parse(window.localStorage.getItem("investments")));
    //     setSpells(JSON.parse(window.localStorage.getItem("spells")));
    //     setCrafts(JSON.parse(window.localStorage.getItem("crafts")));
    //     setPotions(JSON.parse(window.localStorage.getItem("potions")));
    //     setCeremonies(JSON.parse(window.localStorage.getItem("ceremonies")));
    //     setHeroName(JSON.parse(window.localStorage.getItem("heroName")));
    //     setArchetypes(JSON.parse(window.localStorage.getItem("archetypes")));
    //     setGraces(JSON.parse(window.localStorage.getItem("graces")));
    //     setWarband(JSON.parse(window.localStorage.getItem("warband")));
    //     setSect(JSON.parse(window.localStorage.getItem("sect")));
    //     setIcGoals(JSON.parse(window.localStorage.getItem("icGoals")));
    //     setOocGoals(JSON.parse(window.localStorage.getItem("oocGoals")));
    //     setBackstory(JSON.parse(window.localStorage.getItem("backstory")));
    //     setInvestmentDetails(
    //         JSON.parse(window.localStorage.getItem("investmentDetails"))
    //     );
    // }, []);

    // useEffect(() => {
    //     window.localStorage.setItem("realm", JSON.stringify(realm));
    // }, [realm]);

    // useEffect(() => {
    //     window.localStorage.setItem("gamesPlayed", gamesPlayed);
    // }, [gamesPlayed]);

    useEffect(() => {
        // window.localStorage.setItem("skills", JSON.stringify(skills));

        skills?.forEach((s) => {
            if (!validSkillChoice(s) || remainingXp < 0) {
                toggleSkill(s);
            }
        });

        if (!skills?.map((s) => s.name).includes("Magus")) {
            setSpells([]);
        }
        if (!skills?.map((s) => s.name).includes("Apothecary")) {
            setPotions([]);
        }
        if (!skills?.map((s) => s.name).includes("Artisan")) {
            setCrafts([]);
        }
        if (!skills?.filter((s) => s.name.startsWith("Divine Lore")).length) {
            setCeremonies([]);
        }
    }, [skills, remainingXp]);

    // useEffect(() => {
    //     window.localStorage.setItem("investments", JSON.stringify(investments));
    // }, [investments]);

    // useEffect(() => {
    //     window.localStorage.setItem("spells", JSON.stringify(spells));
    // }, [spells]);

    // useEffect(() => {
    //     window.localStorage.setItem("crafts", JSON.stringify(crafts));
    // }, [crafts]);

    // useEffect(() => {
    //     window.localStorage.setItem("potions", JSON.stringify(potions));
    // }, [potions]);

    // useEffect(() => {
    //     window.localStorage.setItem("ceremonies", JSON.stringify(ceremonies));
    // }, [ceremonies]);

    // useEffect(() => {
    //     window.localStorage.setItem("heroName", JSON.stringify(heroName));
    // }, [heroName]);

    // useEffect(() => {
    //     window.localStorage.setItem("archetypes", JSON.stringify(archetypes));
    // }, [archetypes]);

    // useEffect(() => {
    //     window.localStorage.setItem("graces", JSON.stringify(graces));
    // }, [graces]);

    // useEffect(() => {
    //     window.localStorage.setItem("warband", JSON.stringify(warband));
    // }, [warband]);

    // useEffect(() => {
    //     window.localStorage.setItem("sect", JSON.stringify(sect));
    // }, [sect]);

    // useEffect(() => {
    //     window.localStorage.setItem("icGoals", JSON.stringify(icGoals));
    // }, [icGoals]);

    // useEffect(() => {
    //     window.localStorage.setItem("oocGoals", JSON.stringify(oocGoals));
    // }, [oocGoals]);

    // useEffect(() => {
    //     window.localStorage.setItem("backstory", JSON.stringify(backstory));
    // }, [backstory]);

    // useEffect(() => {
    //     window.localStorage.setItem(
    //         "investmentDetails",
    //         JSON.stringify(investmentDetails)
    //     );
    // }, [investmentDetails]);

    // Outputs

    const formContext = {
        unsaved,
        realm,
        selectRealm,
        gamesPlayed,
        setGamesPlayed,
        skills,
        remainingXp,
        toggleSkill,
        validSkillChoice,
        investments,
        toggleInvestment,
        spells,
        toggleSpell,
        crafts,
        toggleCraft,
        potions,
        togglePotion,
        ceremonies,
        toggleCeremony,
        heroName,
        setHeroName,
        archetypes,
        toggleArchetype,
        graces,
        toggleGrace,
        warband,
        setWarband,
        sect,
        setSect,
        icGoals,
        setIcGoals,
        oocGoals,
        setOocGoals,
        backstory,
        setBackstory,
        investmentDetails,
        setInvestmentDetails,
        getForm,
        setForm,
        resetForm,
    };

    return (
        <FormContext.Provider value={formContext}>
            {children}
        </FormContext.Provider>
    );
}

export { FormContextProvider };
export default FormContext;

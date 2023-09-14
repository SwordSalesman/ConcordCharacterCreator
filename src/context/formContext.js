import { createContext, useEffect, useState } from "react";
import {
    getFullSkillsFromSummary,
    getSummarisedSkillNames,
} from "../hooks/use-skill-helper";

const FormContext = createContext();

function FormContextProvider({ children }) {
    // State maintained
    const [realm, setRealm] = useState(null);
    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [skills, setSkills] = useState([]);
    const [investment, setInvestment] = useState(null);
    const [invTier, setInvTier] = useState(1);
    const [invOption, setInvOption] = useState(null);
    const [invRegion, setInvRegion] = useState(null);
    const [spells, setSpells] = useState([]);
    const [crafts, setCrafts] = useState([]);
    const [potions, setPotions] = useState([]);
    const [ceremonies, setCeremonies] = useState([]);
    const [heroName, setHeroName] = useState(null);
    const [archetype, setArchetype] = useState(null);
    const [grace, setGrace] = useState(null);
    const [warband, setWarband] = useState(null);
    const [sect, setSect] = useState(null);
    const [icGoals, setIcGoals] = useState(null);
    const [oocGoals, setOocGoals] = useState(null);
    const [backstory, setBackstory] = useState(null);
    const [invDetails, setInvDetails] = useState(null);

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
            investment: investment,
            invTier: invTier,
            invOption: invOption,
            invRegion: invRegion,
            spells: spells,
            crafts: crafts,
            potions: potions,
            ceremonies: ceremonies,
            heroName: heroName,
            archetype: archetype,
            grace: grace,
            warband: warband,
            sect: sect,
            icGoals: icGoals,
            oocGoals: oocGoals,
            backstory: backstory,
            invDetails: invDetails,
        };
    };

    // Get entire state
    const getSimpleForm = () => {
        return {
            realm: realm,
            gamesPlayed: gamesPlayed,
            skills: getSummarisedSkillNames(skills),
            investment: summariseSimpleArray(investment),
            invTier: invTier,
            invOption: invOption,
            invRegion: invRegion,
            spells: summariseSimpleArray(spells),
            crafts: summariseSimpleArray(crafts),
            potions: summariseSimpleArray(potions),
            ceremonies: summariseSimpleArray(ceremonies),
            heroName: heroName,
            archetype: summariseSimpleArray(archetype),
            grace: summariseSimpleArray(grace),
            warband: warband,
            sect: sect,
            icGoals: icGoals,
            oocGoals: oocGoals,
            backstory: backstory,
            invDetails: invDetails,
        };
    };

    const unsaved = false;

    const setForm = (data) => {
        setRealm(data.realm);
        setGamesPlayed(data.gamesPlayed);
        setSkills(data.skills);
        setInvestment(data.investment);
        setInvOption(data.invOption);
        setInvRegion(data.invRegion);
        setInvTier(data.investment);
        setSpells(data.spells);
        setCrafts(data.crafts);
        setPotions(data.potions);
        setCeremonies(data.ceremonies);
        setHeroName(data.heroName);
        setArchetype(data.archetype);
        setGrace(data.grace);
        setWarband(data.warband);
        setSect(data.sect);
        setIcGoals(data.icGoals);
        setOocGoals(data.oocGoals);
        setBackstory(data.backstory);
        setInvDetails(data.invDetails);
    };

    const setFormFromSimplifiedData = (data) => {
        setRealm(data.realm);
        setGamesPlayed(data.gamesPlayed);
        setSkills(getFullSkillsFromSummary(data.skills));
        setInvestment(getSimpleArrayFromSummary(data.investment));
        setInvOption(data.invOption);
        setInvRegion(data.invRegion);
        setInvTier(data.investment);
        setSpells(getSimpleArrayFromSummary(data.spells));
        setCrafts(getSimpleArrayFromSummary(data.crafts));
        setPotions(getSimpleArrayFromSummary(data.potions));
        setCeremonies(getSimpleArrayFromSummary(data.ceremonies));
        setHeroName(data.heroName);
        setArchetype(getSimpleArrayFromSummary(data.archetype));
        setGrace(getSimpleArrayFromSummary(data.grace));
        setWarband(data.warband);
        setSect(data.sect);
        setIcGoals(data.icGoals);
        setOocGoals(data.oocGoals);
        setBackstory(data.backstory);
        setInvDetails(data.invDetails);
    };

    const resetForm = () => {
        setRealm(null);
        setGamesPlayed(0);
        setSkills([]);
        setInvestment(null);
        setInvOption(null);
        setInvRegion(null);
        setInvTier(1);
        setSpells([]);
        setCrafts([]);
        setPotions([]);
        setCeremonies([]);
        setHeroName(null);
        setArchetype(null);
        setGrace(null);
        setWarband(null);
        setSect(null);
        setIcGoals(null);
        setOocGoals(null);
        setBackstory(null);
        setInvDetails(null);
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

    const summariseSimpleArray = (a) => {
        if (!a) return null;
        return a.map((i) => i.name).join(", ");
    };

    const getSimpleArrayFromSummary = (s) => {
        if (!s) return null;
        return s.split(", ").map((i) => {
            return { name: i };
        });
    };

    // Handling functions

    const selectRealm = (selectedRealm) => {
        setRealm(selectedRealm);
        setArchetype(null);
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

    // skill should be a skillObj formatted as if from the SkillItem method call
    const invalidSkillChoice = (skill) => {
        // check for missing prerequisites
        if (
            skill.prereq &&
            !skills?.map((s) => s.name).includes(skill.prereq)
        ) {
            return `Missing prerequisite '${skill.prereq}'`;
        }
        // check for exclusion
        if (
            skill.exclusion &&
            skills?.map((s) => s.name).includes(skill.exclusion)
        ) {
            return `Conflict with skill '${skill.exclusion}'`;
        }
        // check for remaining xp
        // if ( skill. )
        return false;
    };

    const toggleSkill = (skill) => {
        toggleItem(skill, skills, setSkills);
    };

    const toggleInvestment = (selectedInvestment) => {
        toggleItem(selectedInvestment, investment, setInvestment);
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

    const toggleArchetype = (selectedArchetype) => {
        toggleItem(selectedArchetype, archetype, setArchetype);
    };

    const toggleGrace = (selectedGrace) => {
        toggleItem(selectedGrace, grace, setGrace);
    };

    // Local Storage management

    // useEffect(() => {
    //     setRealm(JSON.parse(window.localStorage.getItem("realm")));
    //     setGamesPlayed(
    //         JSON.parse(window.localStorage.getItem("gamesPlayed")) || 0
    //     );
    //     setSkills(JSON.parse(window.localStorage.getItem("skills")));
    //     setInvestment(JSON.parse(window.localStorage.getItem("investment")));
    //     setSpells(JSON.parse(window.localStorage.getItem("spells")));
    //     setCrafts(JSON.parse(window.localStorage.getItem("crafts")));
    //     setPotions(JSON.parse(window.localStorage.getItem("potions")));
    //     setCeremonies(JSON.parse(window.localStorage.getItem("ceremonies")));
    //     setHeroName(JSON.parse(window.localStorage.getItem("heroName")));
    //     setArchetype(JSON.parse(window.localStorage.getItem("archetype")));
    //     setGrace(JSON.parse(window.localStorage.getItem("grace")));
    //     setWarband(JSON.parse(window.localStorage.getItem("warband")));
    //     setSect(JSON.parse(window.localStorage.getItem("sect")));
    //     setIcGoals(JSON.parse(window.localStorage.getItem("icGoals")));
    //     setOocGoals(JSON.parse(window.localStorage.getItem("oocGoals")));
    //     setBackstory(JSON.parse(window.localStorage.getItem("backstory")));
    //     setInvDetails(
    //         JSON.parse(window.localStorage.getItem("invDetails"))
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
        } else {
            if (spells.length < 1) {
                toggleSpell({ name: "Channel Waystone" });
            }
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
    //     window.localStorage.setItem("investment", JSON.stringify(investment));
    // }, [investment]);

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
    //     window.localStorage.setItem("archetype", JSON.stringify(archetype));
    // }, [archetype]);

    // useEffect(() => {
    //     window.localStorage.setItem("grace", JSON.stringify(grace));
    // }, [grace]);

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
    //         "invDetails",
    //         JSON.stringify(invDetails)
    //     );
    // }, [invDetails]);

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
        invalidSkillChoice,
        investment,
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
        archetype,
        toggleArchetype,
        grace,
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
        invDetails,
        setInvDetails,
        getForm,
        getSimpleForm,
        setForm,
        setFormFromSimplifiedData,
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

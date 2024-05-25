import { createContext, useEffect, useState } from "react";
import { getFullSkillsFromSummary, getSummarisedSkillNames } from "../hooks/use-skill-helper";
import React from "react";
import { getUserFormAndApproval } from "../hooks/use-firebase";
import useUserContext from "../hooks/use-user-context";
import { getSimpleArrayFromSummary, summariseSimpleArray } from "../helpers/data-helper";

const FormContext = createContext();

function FormContextProvider({ children }) {
	const { user } = useUserContext();
	// State maintained
	const [initialForm, setInitialForm] = useState({});
	const [changes, setChanges] = useState([]);
	const [approval, setApproval] = useState(null);
	const [date, setDate] = useState(null);
	const [realm, setRealm] = useState(null);
	const [gamesPlayed, setGamesPlayed] = useState(0);
	const [skills, setSkills] = useState([]);
	const [investment, setInvestment] = useState([]);
	const [invTier, setInvTier] = useState(1);
	const [invOption, setInvOption] = useState([]);
	const [invRegion, setInvRegion] = useState([]);
	const [invTerritory, setInvTerritory] = useState([]);
	const [spells, setSpells] = useState([]);
	const [crafts, setCrafts] = useState([]);
	const [potions, setPotions] = useState([]);
	const [ceremonies, setCeremonies] = useState([]);
	const [startingItem, setStartingItem] = useState([]);
	const [heroName, setHeroName] = useState(null);
	const [archetype, setArchetype] = useState([]);
	const [grace, setGrace] = useState([]);
	const [warband, setWarband] = useState(null);
	const [sect, setSect] = useState(null);
	const [icGoals, setIcGoals] = useState(null);
	const [oocGoals, setOocGoals] = useState(null);
	const [backstory, setBackstory] = useState(null);
	const [invDetails, setInvDetails] = useState(null);
	const [comments, setComments] = useState(null);

	// Derived Variables
	const totalXp = 8 + parseInt(gamesPlayed ? gamesPlayed : 0);
	const remainingXp =
		totalXp - (skills ? skills.map((s) => s.cost).reduce((a, b) => a + b, 0) : 0);

	// Get entire state
	const getForm = () => {
		const newChanges = updateChangedFields();
		return {
			date: date,
			realm: realm,
			gamesPlayed: gamesPlayed,
			skills: skills,
			investment: investment,
			invTier: invTier,
			invOption: invOption,
			invRegion: invRegion,
			invTerritory: invTerritory,
			spells: spells,
			crafts: crafts,
			potions: potions,
			ceremonies: ceremonies,
			startingItem: startingItem,
			heroName: heroName,
			archetype: archetype,
			grace: grace,
			warband: warband,
			sect: sect,
			icGoals: icGoals,
			oocGoals: oocGoals,
			backstory: backstory,
			invDetails: invDetails,
			comments: comments,
			changes: newChanges,
		};
	};

	const getSimpleFormInternal = () => {
		return {
			date: date,
			realm: realm,
			gamesPlayed: gamesPlayed,
			skills: getSummarisedSkillNames(skills),
			investment: summariseSimpleArray(investment),
			invTier: invTier,
			invOption: summariseSimpleArray(invOption),
			invRegion: summariseSimpleArray(invRegion),
			invTerritory: summariseSimpleArray(invTerritory),
			spells: summariseSimpleArray(spells),
			crafts: summariseSimpleArray(crafts),
			potions: summariseSimpleArray(potions),
			ceremonies: summariseSimpleArray(ceremonies),
			startingItem: summariseSimpleArray(startingItem),
			heroName: heroName,
			archetype: summariseSimpleArray(archetype),
			grace: summariseSimpleArray(grace),
			warband: warband,
			sect: sect,
			icGoals: icGoals,
			oocGoals: oocGoals,
			backstory: backstory,
			invDetails: invDetails,
			comments: comments,
			changes: summariseSimpleArray(changes),
		};
	};

	const getSimpleForm = () => {
		const newChanges = summariseSimpleArray(updateChangedFields());
		const simpleForm = getSimpleFormInternal();
		return { ...simpleForm, changes: newChanges };
	};

	const unsaved = false;

	const setFormFromFullData = (data) => {
		setDate(data.date);
		setRealm(data.realm);
		setGamesPlayed(data.gamesPlayed);
		setSkills(data.skills);
		setInvestment(data.investment);
		setInvTier(data.invTier);
		setInvOption(data.invOption);
		setInvRegion(data.invRegion);
		setInvTerritory(data.invTerritory);
		setSpells(data.spells);
		setCrafts(data.crafts);
		setPotions(data.potions);
		setCeremonies(data.ceremonies);
		setStartingItem(data.startingItem);
		setHeroName(data.heroName);
		setArchetype(data.archetype);
		setGrace(data.grace);
		setWarband(data.warband);
		setSect(data.sect);
		setIcGoals(data.icGoals);
		setOocGoals(data.oocGoals);
		setBackstory(data.backstory);
		setInvDetails(data.invDetails);
		setComments(data.comments);
		setChanges(data.changes);
	};

	const setFormFromSimplifiedData = (data, initialLoad) => {
		if (!data) return;

		if (initialLoad) {
			setInitialForm({
				date: data.date,
				realm: data.realm,
				gamesPlayed: data.gamesPlayed,
				skills: data.skills,
				investment: data.investment,
				invOption: data.invOption,
				invRegion: data.invRegion,
				invTerritory: data.invTerritory,
				invTier: data.invTier,
				spells: data.spells,
				crafts: data.crafts,
				potions: data.potions,
				ceremonies: data.ceremonies,
				startingItem: data.startingItem,
				heroName: data.heroName,
				archetype: data.archetype,
				grace: data.grace,
				warband: data.warband,
				sect: data.sect,
				icGoals: data.icGoals,
				oocGoals: data.oocGoals,
				backstory: data.backstory,
				invDetails: data.invDetails,
				comments: data.comments,
				changes: data.changes,
			});
		}

		setDate(data.date);
		setRealm(data.realm);
		setGamesPlayed(data.gamesPlayed);
		setSkills(getFullSkillsFromSummary(data.skills));
		setInvestment(getSimpleArrayFromSummary(data.investment));
		setInvOption(getSimpleArrayFromSummary(data.invOption));
		setInvRegion(getSimpleArrayFromSummary(data.invRegion));
		setInvTerritory(getSimpleArrayFromSummary(data.invTerritory));
		setInvTier(data.invTier);
		setSpells(getSimpleArrayFromSummary(data.spells));
		setCrafts(getSimpleArrayFromSummary(data.crafts));
		setPotions(getSimpleArrayFromSummary(data.potions));
		setCeremonies(getSimpleArrayFromSummary(data.ceremonies));
		setStartingItem(getSimpleArrayFromSummary(data.startingItem));
		setHeroName(data.heroName);
		setArchetype(getSimpleArrayFromSummary(data.archetype));
		setGrace(getSimpleArrayFromSummary(data.grace));
		setWarband(data.warband);
		setSect(data.sect);
		setIcGoals(data.icGoals);
		setOocGoals(data.oocGoals);
		setBackstory(data.backstory);
		setInvDetails(data.invDetails);
		setComments(data.comments);
		setChanges(getSimpleArrayFromSummary(data.changes));
	};

	const resetForm = () => {
		setApproval(null);
		setChanges([]);
		setRealm(null);
		setGamesPlayed(0);
		setSkills([]);
		setInvestment([]);
		setInvOption([]);
		setInvRegion([]);
		setInvTerritory([]);
		setInvTier(1);
		setSpells([]);
		setCrafts([]);
		setPotions([]);
		setCeremonies([]);
		setStartingItem([]);
		setHeroName(null);
		setArchetype([]);
		setGrace([]);
		setWarband(null);
		setSect(null);
		setIcGoals(null);
		setOocGoals(null);
		setBackstory(null);
		setInvDetails(null);
		setComments(null);
	};

	// Load Data
	useEffect(() => {
		async function downloadForm() {
			const newForm = await getUserFormAndApproval();
			if (newForm) {
				setFormFromSimplifiedData(newForm, true);
				setApproval(newForm.approval);
			}
		}

		if (user) {
			downloadForm();
		} else {
			resetForm();
			setApproval(null);
			setDate(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

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
		setArchetype([]);
	};

	// Checks if the bare minimum required fields have content in them
	// Realm, Name, Investment, Backstory
	const validateForm = () => {
		const validRealm = realm !== null;
		const validName = heroName !== null && heroName.trim() !== "";
		const validInvestment =
			investment.length === 1 && invRegion.length === 1 && invTerritory.length === 1;
		const valid = validRealm && validName && validInvestment;
		return { valid, validRealm, validName, validInvestment };
	};

	// skill should be a skillObj formatted as if from the SkillItem method call
	const validSkillChoice = (skill, options = {}) => {
		const { ignoreCost } = options;

		if (!ignoreCost) {
			const notEnoughXP = skill.cost > remainingXp;
			if (notEnoughXP) {
				return { valid: false, reason: "Not enough XP" };
			}
		}

		let prereqNotMet = skill.prereq && !skills?.map((s) => s.name).includes(skill.prereq);
		if (prereqNotMet) {
			return { valid: false, reason: `Prerequisite missing: '${skill.prereq}'` };
		}

		let excluded = skill.exclusion && skills?.map((s) => s.name).includes(skill.exclusion);
		if (excluded) {
			return { valid: false, reason: `Conflicts with '${skill.exclusion}'` };
		}

		return { valid: true, reason: undefined };
	};

	const updateChangedFields = () => {
		const simpleForm = getSimpleFormInternal();

		const currChanges = [];
		if (simpleForm.date !== initialForm.date) currChanges.push("date");
		if (simpleForm.realm !== initialForm.realm) currChanges.push("realm");
		if (simpleForm.gamesPlayed !== initialForm.gamesPlayed) currChanges.push("gamesPlayed");
		if (simpleForm.skills !== initialForm.skills) currChanges.push("skills");
		if (simpleForm.investment !== initialForm.investment) currChanges.push("investment");
		if (simpleForm.invOption !== initialForm.invOption) currChanges.push("invOption");
		if (simpleForm.invRegion !== initialForm.invRegion) currChanges.push("invRegion");
		if (simpleForm.invTerritory !== initialForm.invTerritory) currChanges.push("invTerritory");
		if (simpleForm.invTier !== initialForm.invTier) currChanges.push("invTier");
		if (simpleForm.spells !== initialForm.spells) currChanges.push("spells");
		if (simpleForm.crafts !== initialForm.crafts) currChanges.push("crafts");
		if (simpleForm.potions !== initialForm.potions) currChanges.push("potions");
		if (simpleForm.ceremonies !== initialForm.ceremonies) currChanges.push("ceremonies");
		if (simpleForm.startingItem !== initialForm.startingItem) currChanges.push("startingItem");
		if (simpleForm.heroName !== initialForm.heroName) currChanges.push("heroName");
		if (simpleForm.archetype !== initialForm.archetype) currChanges.push("archetype");
		if (simpleForm.grace !== initialForm.grace) currChanges.push("grace");
		if (simpleForm.warband !== initialForm.warband) currChanges.push("warband");
		if (simpleForm.sect !== initialForm.sect) currChanges.push("sect");
		if (simpleForm.icGoals !== initialForm.icGoals) currChanges.push("icGoals");
		if (simpleForm.oocGoals !== initialForm.oocGoals) currChanges.push("oocGoals");
		if (simpleForm.backstory !== initialForm.backstory) currChanges.push("backstory");
		if (simpleForm.invDetails !== initialForm.invDetails) currChanges.push("invDetails");
		if (simpleForm.comments !== initialForm.comments) currChanges.push("comments");

		const netChanges = changes ?? [];
		currChanges.forEach((c) => {
			if (netChanges.filter((nc) => nc.name === c)) netChanges.push({ name: c });
		});

		setChanges(netChanges);
		return netChanges;
	};

	const toggleSkill = (skill) => {
		toggleItem(skill, skills, setSkills);
	};

	const toggleInvestment = (selectedInvestment) => {
		toggleItem(selectedInvestment, investment, setInvestment);
		setInvOption(null);
	};

	const toggleInvRegion = (region) => {
		toggleItem(region, invRegion, setInvRegion);
	};

	const toggleInvTerritory = (territory) => {
		toggleItem(territory, invTerritory, setInvTerritory);
	};

	const toggleInvOption = (option) => {
		toggleItem(option, invOption, setInvOption);
	};

	const toggleSpell = (spell) => {
		if (
			spell.name === "Channel Waystone" &&
			spells.find((s) => s.name === "Channel Waystone")
		) {
			return;
		}
		toggleItem(spell, spells, setSpells);
	};

	const toggleCraft = (craft) => {
		if (craft.name === "Artisans Oil" && crafts.find((c) => c.name === "Artisans Oil")) {
			return;
		}
		toggleItem(craft, crafts, setCrafts);
	};

	const togglePotion = (potion) => {
		toggleItem(potion, potions, setPotions);
	};

	const toggleCeremony = (ceremony) => {
		toggleItem(ceremony, ceremonies, setCeremonies);
	};

	const toggleStartingItem = (item) => {
		toggleItem(item, startingItem, setStartingItem);
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
			const { valid } = validSkillChoice(s, { ignoreCost: true });
			if (!valid || remainingXp < 0) {
				toggleSkill(s);
			}
		});

		if (!skills?.map((s) => s.name).includes("Magus")) {
			setSpells([]);
		} else {
			toggleSpell({ name: "Channel Waystone" });
		}
		if (!skills?.map((s) => s.name).includes("Apothecary")) {
			setPotions([]);
		}
		if (!skills?.map((s) => s.name).includes("Artisan")) {
			setCrafts([]);
			setStartingItem([]);
		} else {
			toggleCraft({ name: "Artisans Oil" });
		}

		if (!skills?.filter((s) => s.name.startsWith("Divine Lore")).length) {
			setCeremonies([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [skills, remainingXp]);

	useEffect(() => {
		if (invRegion && !invRegion.length) setInvTerritory([]);
	}, [invRegion]);

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
		date,
		setDate,
		realm,
		selectRealm,
		gamesPlayed,
		setGamesPlayed,
		skills,
		remainingXp,
		toggleSkill,
		validSkillChoice,
		investment,
		toggleInvestment,
		invRegion,
		toggleInvRegion,
		invTerritory,
		toggleInvTerritory,
		invOption,
		toggleInvOption,
		invTier,
		setInvTier,
		spells,
		toggleSpell,
		crafts,
		toggleCraft,
		potions,
		togglePotion,
		ceremonies,
		toggleCeremony,
		startingItem,
		toggleStartingItem,
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
		comments,
		setComments,
		getForm,
		getSimpleForm,
		setFormFromFullData,
		setFormFromSimplifiedData,
		resetForm,
		approval,
		setApproval,
		validateForm,
		changes,
		updateChangedFields,
	};

	return <FormContext.Provider value={formContext}>{children}</FormContext.Provider>;
}

export { FormContextProvider };
export default FormContext;

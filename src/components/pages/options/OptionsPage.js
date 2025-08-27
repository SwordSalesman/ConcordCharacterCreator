import Accordion from "../../common/Accordion/Accordion";
import ContentPane from "../../common/ContentPane/ContentPane";
import useFormContext from "../../../hooks/use-form-context";
import Chip from "../../common/Chip/Chip";
import SectionDivider from "../../common/SectionDivider/SectionDivider";
import { SectionLine, SectionWrapper } from "../../common/SectionDivider/SectionDivider.style";
import { SkillPageWrapper } from "../skills/SkillsPage.style";
import { AccordionSection } from "../../common/Accordion/AccordionSection";
import { BackgroundInputWrapper } from "../background/BackgroundPage";
import React, { useMemo } from "react";
import { FlexCenter } from "../../../styles/Global";
import Button from "../../common/Button/Button";
import { BiMinus, BiPlus } from "react-icons/bi";
import { GameTally } from "../intro/Intro.style";
import {
	GiArmorVest,
	GiBattleAxe,
	GiBroadDagger,
	GiBroadsword,
	GiCheckedShield,
	GiChestArmor,
	GiCrenelCrown,
	GiCrossedSwords,
	GiCrystalWand,
	GiGemNecklace,
	GiHammerNails,
	GiIncense,
	GiMoon,
	GiNinjaArmor,
	GiPocketBow,
	GiPotionBall,
	GiRobe,
	GiTatteredBanner,
} from "react-icons/gi";
import { regionIsCoastal, regionIsNotCoastal } from "../../../helpers/selection-helper";
import { investmentRegionWarning } from "../../../helpers/validity-helper";

var investmentData = require("../../../data/tables/investments.json");
var regionData = require("../../../data/tables/regions.json");
var spellsData = require("../../../data/tables/spells.json");
var craftsData = require("../../../data/tables/crafts.json");
var potionsData = require("../../../data/tables/potions.json");
var ceremoniesData = require("../../../data/tables/ceremonies.json");

const chipIcons = true;

function chipIcon(type) {
	if (!chipIcons) return <></>;

	switch (type) {
		case "Weapon: One Handed":
			return <GiBroadsword />;
		case "Weapon: Great Weapon":
			return <GiBattleAxe />;
		case "Weapon: Short Weapon":
			return <GiBroadDagger />;
		case "Weapon: Polearm":
		case "Weapon: Stave":
			return <GiCrystalWand />;
		case "Weapon Pair: Short Weapon and One Handed Weapon":
		case "Weapon Pair: One Handed":
			return <GiCrossedSwords />;
		case "Weapon: Bow":
			return <GiPocketBow />;
		case "Armour: Light":
			return <GiNinjaArmor />;
		case "Armour: Medium":
			return <GiChestArmor />;
		case "Armour: Heavy":
			return <GiArmorVest />;
		case "Armour: Clothes":
			return <GiRobe />;
		case "Talisman: Tool":
			return <GiHammerNails />;
		case "Talisman: Shield":
			return <GiCheckedShield />;
		case "Talisman: Jewellery":
			return <GiGemNecklace />;
		case "Talisman: Battlemages Circlet":
			return <GiCrenelCrown />;
		case "Banner":
			return <GiTatteredBanner />;
		case "Reliquary":
			return <GiIncense />;
		case "Special":
			return <GiPotionBall />;
		default:
			return <></>;
	}
}

function getInactive(params) {
	const { item, selected, remainingPicks, realm, invRegion, investment } = params;

	if (!selected && remainingPicks <= 0) {
		return { inactive: true, inactiveReason: null };
	}
	if (item.name === "Artisans Oil" || item.name === "Channel Waystone") {
		return {
			inactive: true,
			inactiveReason: `Cannot unlearn ${item.name}`,
		};
	}
	if (item.realm && item.realm !== realm) {
		return {
			inactive: true,
			inactiveReason: `Your realm cannot select ${item.name}`,
		};
	}
	if (
		(regionIsNotCoastal(item.name) && investment?.length && investment[0].name === "Naval") ||
		(item.name === "Naval" && invRegion?.length && !regionIsCoastal(invRegion[0].name))
	) {
		return {
			inactive: true,
			inactiveReason: `Naval investments must be in coastal regions`,
		};
	}

	return { inactive: false, inactiveReason: null };
}

const genTabContent = (params) => {
	let {
		label,
		link,
		allItems,
		selectedItems,
		toggleFunction,
		remainingPicks,
		subSectionTitle,
		realm,
		invRegion,
		comment,
		filterFunction,
	} = params;

	if (!filterFunction) filterFunction = (a) => true;

	const sections =
		label === "Artisan Crafts"
			? ["Journeyman", "Expert", "Masterwork"]
			: subSectionTitle
			? allItems
					.filter((i) => filterFunction(i))
					.map((i) => i[subSectionTitle])
					.filter((value, index, array) => array.indexOf(value) === index)
					.sort((a, b) => (a > b ? 1 : -1))
			: null;

	if (sections) {
		return {
			label: label,
			link: link,
			content: (
				<BackgroundInputWrapper>
					{comment ? <i>{comment}</i> : null}
					{sections.map((s) => {
						return (
							<AccordionSection title={s} key={s}>
								{allItems
									.filter((item) => filterFunction(item))
									.filter((item) => item[subSectionTitle] === s)
									.map((item) => {
										let selected = selectedItems
											?.map((i) => i.name)
											.includes(item.name);
										const { inactive, inactiveReason } = getInactive({
											item: item,
											selected: selected,
											remainingPicks: remainingPicks,
											realm: realm,
											invRegion: invRegion,
										});

										return (
											<Chip
												onClick={() =>
													toggleFunction({
														name: item.name,
													})
												}
												selected={selected}
												inactive={inactive}
												inactiveReason={inactiveReason}
												key={item.name}
											>
												{label === "Artisan Crafts" && chipIcon(item.type)}
												{label === "Mastered Ceremonies" &&
													item.alignment === true && <GiMoon />}
												{item.name}
											</Chip>
										);
									})}
							</AccordionSection>
						);
					})}
				</BackgroundInputWrapper>
			),
		};
	}

	return {
		label: label,
		content: (
			<BackgroundInputWrapper>
				{comment ? <i>{comment}</i> : null}
				<AccordionSection>
					{allItems
						.filter((item) => filterFunction(item))
						.map((item) => {
							let selected = selectedItems?.map((i) => i.name).includes(item.name);
							return (
								<Chip
									onClick={() => toggleFunction({ name: item.name })}
									selected={selected}
									inactive={!selected && remainingPicks <= 0}
									key={item.name}
								>
									{item.name}
								</Chip>
							);
						})}
				</AccordionSection>
			</BackgroundInputWrapper>
		),
		link: link,
	};
};

const genSelectedContent = (items, toggleFunction, noDisable) => {
	if (!items || !items.length) {
		return null;
	}
	return items?.map((i) => {
		return (
			<Chip
				onClick={() => toggleFunction({ name: i.name })}
				shadow
				key={i.name}
				disabled={
					!noDisable && (i.name === "Channel Waystone" || i.name === "Artisans Oil")
				}
			>
				{i.name}
			</Chip>
		);
	});
};

function OptionsPage() {
	const {
		skills,
		spells,
		toggleSpell,
		investment,
		toggleInvestment,
		invTier,
		setInvTier,
		invRegion,
		toggleInvRegion,
		invTerritory,
		toggleInvTerritory,
		invOption,
		toggleInvOption,
		crafts,
		toggleCraft,
		potions,
		togglePotion,
		ceremonies,
		toggleCeremony,
		startingItem,
		toggleStartingItem,
		realm,
	} = useFormContext();

	// Variables
	const skillNames = useMemo(() => {
		return skills ? skills.map((s) => s.name) : [];
	}, [skills]);
	const showSpells = skillNames.includes("Magus");
	const showCrafts = skillNames.includes("Artisan");
	const showPotions = skillNames.includes("Apothecary");
	const showCeremonies = skillNames.filter((s) => s.startsWith("Divine Lore")).length > 0;

	const numInvestment = 1 - (investment ? investment.length : 0);
	const numInvRegion = 1 - (invRegion ? invRegion.length : 0);
	const numInvTerritory = 1 - (invTerritory ? invTerritory.length : 0);
	const numInvOption = 1 - (invOption ? invOption.length : 0);

	const maxSpells = useMemo(() => {
		return (
			skillNames.includes("Magus") * 2 +
			skillNames.filter((s) => s.startsWith("Additional Spell")).length * 1
		);
	}, [skillNames]);
	const numSpells = maxSpells - (spells ? spells.length : 0);

	const maxCeremonies = useMemo(() => {
		return (
			skillNames.filter((s) => s.startsWith("Divine Lore")).length * 2 +
			skillNames.filter((s) => s.startsWith("Extra Ceremony")).length * 2
		);
	}, [skillNames]);
	const numCeremonies = maxCeremonies - (ceremonies ? ceremonies.length : 0);

	const maxCrafts = useMemo(() => {
		return (
			skillNames.filter((s) => s.startsWith("Artisan")).length * 5 +
			skillNames.filter((s) => s.startsWith("Extra Craft")).length * 2
		);
	}, [skillNames]);
	const numCrafts = maxCrafts - (crafts ? crafts.length : 0);
	const numStartingItems = 1 - (startingItem ? startingItem.length : 0);

	const maxPotions = useMemo(() => {
		return (
			skillNames.filter((s) => s.startsWith("Apothecary")).length * 3 +
			skillNames.filter((s) => s.startsWith("Extra Recipe")).length * 2
		);
	}, [skillNames]);
	const numPotions = maxPotions - (potions ? potions.length : 0);

	// Generate the 'selected' items on the left of the screen
	var renderedInvestment = genSelectedContent(investment, toggleInvestment);
	var renderedInvOption = genSelectedContent(invOption, toggleInvOption);
	var renderedInvRegion = genSelectedContent(invRegion, toggleInvRegion);
	var renderedInvTerritory = genSelectedContent(invTerritory, toggleInvTerritory);

	var renderedSpells = useMemo(() => {
		return showSpells ? genSelectedContent(spells, toggleSpell) : null;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [spells]);
	var renderedCrafts = useMemo(() => {
		return showCrafts ? genSelectedContent(crafts, toggleCraft) : null;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [crafts]);
	var renderedStartingItem = useMemo(() => {
		return showCrafts ? genSelectedContent(startingItem, toggleStartingItem, true) : null;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [startingItem]);
	var renderedPotions = useMemo(() => {
		return showPotions ? genSelectedContent(potions, togglePotion) : null;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [potions]);
	var renderedCeremonies = useMemo(() => {
		return showCeremonies ? genSelectedContent(ceremonies, toggleCeremony) : null;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ceremonies]);

	const investmentOptions =
		investment && investment.length
			? investmentData.find((i) => i.name === investment[0].name)?.options
			: null;

	const handleMinus = () => {
		if (invTier > 1) {
			setInvTier(invTier - 1);
		}
	};

	const handlePlus = () => {
		if (invTier < 10) {
			setInvTier(invTier + 1);
		}
	};

	const investmentTabContent = (
		<BackgroundInputWrapper>
			<AccordionSection title="Investment Type" link="Investments">
				{investmentData.map((item) => {
					let selected = investment?.map((i) => i.name).includes(item.name);

					const { inactive, inactiveReason } = getInactive({
						item: item,
						selected: selected,
						remainingPicks: numInvestment,
						realm: realm,
						invRegion: invRegion,
					});

					return (
						<Chip
							onClick={() => toggleInvestment({ name: item.name })}
							selected={selected}
							inactive={inactive}
							inactiveReason={inactiveReason}
							key={item.name}
						>
							{item.name}
						</Chip>
					);
				})}
			</AccordionSection>
			<AccordionSection title="Investment Tier">
				<FlexCenter
					style={{
						margin: "5px 0",
					}}
				>
					<Button secondary onClick={handleMinus}>
						<BiMinus />
					</Button>
					<GameTally>{invTier}</GameTally>
					<Button secondary onClick={handlePlus}>
						<BiPlus />
					</Button>
				</FlexCenter>
			</AccordionSection>
			{investmentOptions && (
				<AccordionSection title="Investment Option">
					{investmentOptions.map((item) => {
						let selected = invOption?.map((i) => i.name).includes(item.name);
						return (
							<Chip
								onClick={() => toggleInvOption({ name: item.name })}
								selected={selected}
								inactive={!selected && numInvOption <= 0}
								key={item.name}
							>
								{item.name}
							</Chip>
						);
					})}
				</AccordionSection>
			)}
			<AccordionSection
				title="Investment Region"
				link="Map_of_Esterra"
				warning={investmentRegionWarning(realm, invRegion)}
			>
				{regionData.map((region) => {
					let selected = invRegion?.map((i) => i.name).includes(region.name);
					const { inactive, inactiveReason } = getInactive({
						item: { name: region.name },
						selected: selected,
						remainingPicks: numInvRegion,
						realm: realm,
						investment: investment,
					});

					return (
						<Chip
							onClick={() => toggleInvRegion({ name: region.name })}
							selected={selected}
							inactive={inactive}
							inactiveReason={inactiveReason}
							key={region.name}
						>
							{region.name}
						</Chip>
					);
				})}
			</AccordionSection>
			<AccordionSection
				title="Investment Territory"
				link={
					invRegion[0]
						? regionData.find((region) => region.name === invRegion[0].name).link
						: null
				}
			>
				{invRegion && invRegion[0]?.name ? (
					regionData
						.find((region) => region.name === invRegion[0].name)
						.territories.map((territory) => {
							let selected = invTerritory?.map((i) => i.name).includes(territory);
							return (
								<Chip
									onClick={() =>
										toggleInvTerritory({
											name: territory,
										})
									}
									selected={selected}
									inactive={!selected && numInvTerritory <= 0}
									key={territory}
								>
									{territory}
								</Chip>
							);
						})
				) : (
					<p style={{ opacity: 0.5, fontStyle: "italic" }}>Select a Region first</p>
				)}
			</AccordionSection>
		</BackgroundInputWrapper>
	);

	const knownCraftNames = crafts.map((c) => c.name);
	const startingItemOptions = craftsData.filter(
		(c) => knownCraftNames.includes(c.name) && c.rarity === "Journeyman"
	);

	const renderedTabs = [];
	renderedTabs.push({
		label: "Investment",
		content: investmentTabContent,
		// link: "Investments",
	});
	showSpells &&
		renderedTabs.push(
			genTabContent({
				label: "Spells",
				link: "List_of_Known_Magical_Spells",
				allItems: spellsData,
				selectedItems: spells,
				toggleFunction: toggleSpell,
				remainingPicks: numSpells,
				subSectionTitle: "type",
			})
		);
	showCrafts &&
		renderedTabs.push(
			genTabContent({
				label: "Artisan Crafts",
				link: "Artisan_Crafts",
				allItems: craftsData,
				selectedItems: crafts,
				toggleFunction: toggleCraft,
				remainingPicks: numCrafts,
				subSectionTitle: "rarity",
			})
		);
	showCrafts &&
		renderedTabs.push(
			genTabContent({
				label: "Starting Item",
				link: undefined,
				allItems: startingItemOptions,
				selectedItems: startingItem,
				toggleFunction: toggleStartingItem,
				remainingPicks: numStartingItems,
				subSectionTitle: undefined,
				comment: "If you're a new Artisan, select your starting Journeyman item.",
			})
		);
	showPotions &&
		renderedTabs.push(
			genTabContent({
				label: "Potion Recipes",
				link: "List_of_Apothecary_Potions",
				allItems: potionsData,
				selectedItems: potions,
				toggleFunction: togglePotion,
				remainingPicks: numPotions,
				subSectionTitle: "type",
				realm: realm,
			})
		);
	if (showCeremonies) {
		let skillTitles = skills.map((s) => s.name).toString();
		renderedTabs.push(
			genTabContent({
				label: "Mastered Ceremonies",
				link: "Ceremonies_Overview",
				allItems: ceremoniesData,
				selectedItems: ceremonies,
				toggleFunction: toggleCeremony,
				remainingPicks: numCeremonies,
				subSectionTitle: "sphere",
				realm: realm,
				filterFunction: (c) => skillTitles.includes(c.sphere),
			})
		);
	}

	return (
		<SkillPageWrapper>
			<ContentPane style={{ flex: 4 }}>
				<SectionDivider
					left="Investment"
					right={numInvestment > 0 && `(${numInvestment} remaining)`}
				/>
				<SectionWrapper>
					{renderedInvestment || renderedInvOption || renderedInvRegion ? (
						<>
							{renderedInvestment && (
								<SectionLine>Type: {renderedInvestment}</SectionLine>
							)}
							{renderedInvOption && (
								<SectionLine>Variant: {renderedInvOption}</SectionLine>
							)}
							{renderedInvRegion && (
								<SectionLine>Region: {renderedInvRegion}</SectionLine>
							)}
							{renderedInvTerritory && (
								<SectionLine>Territory: {renderedInvTerritory}</SectionLine>
							)}
						</>
					) : (
						<div
							style={{
								opacity: 0.7,
								fontStyle: "italic",
								padding: "0 20px",
							}}
						>
							{"Select your Investment, as well as any other options you may need."}
						</div>
					)}
				</SectionWrapper>
				{showSpells && (
					<>
						<SectionDivider
							left="Spells"
							right={numSpells > 0 && `(${numSpells} remaining)`}
						/>
						<SectionWrapper>{renderedSpells}</SectionWrapper>
					</>
				)}
				{showCrafts && (
					<>
						<SectionDivider
							left="Crafts"
							right={numCrafts > 0 && `(${numCrafts} remaining)`}
						/>
						<SectionWrapper>{renderedCrafts}</SectionWrapper>
						<SectionDivider
							left="Starting Item"
							right={numStartingItems > 0 && `(${numStartingItems} remaining)`}
						/>
						<SectionWrapper>{renderedStartingItem}</SectionWrapper>
					</>
				)}
				{showPotions && (
					<>
						<SectionDivider
							left="Potions"
							right={numPotions > 0 && `(${numPotions} remaining)`}
						/>
						<SectionWrapper>{renderedPotions}</SectionWrapper>
					</>
				)}
				{showCeremonies && (
					<>
						<SectionDivider
							left={"Mastered Ceremonies"}
							right={numCeremonies > 0 && `(${numCeremonies} remaining)`}
						/>
						<SectionWrapper>{renderedCeremonies}</SectionWrapper>
					</>
				)}
			</ContentPane>
			<ContentPane style={{ flex: 5 }}>
				<Accordion items={renderedTabs}></Accordion>
			</ContentPane>
		</SkillPageWrapper>
	);
}

export default OptionsPage;

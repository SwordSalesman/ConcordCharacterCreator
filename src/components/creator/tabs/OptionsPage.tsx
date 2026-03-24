import useFormContext from "../../../hooks/use-form-context";
import SectionDivider from "../../common/SectionDivider/SectionDivider";
import { SectionLine, SectionWrapper } from "../../common/SectionDivider/SectionDivider.style";
import React, { useMemo } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
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
import { regionIsCoastal, regionIsNotCoastal } from "../../../utils/selection-helper";
import { investmentRegionWarning } from "../../../utils/validity-helper";
import { AccordionSection } from "@/components/common/Accordion/AccordionSection";
import Accordion from "@/components/common/Accordion/Accordion";
import { Chip } from "@/components/common/Chip/Chip";
import { Button } from "@/components/common/Button/Button";
import { investments as investmentsData } from "@/data/tables/investments";
import { regions as regionsData } from "@/data/tables/regions";
import { crafts as craftsData } from "@/data/tables/crafts";
import { Realm } from "@/data/tables/realms";
import { ContentPane } from "@/components/common/ContentPane/ContentPane";

var spellsData = require("../../../data/tables/spells.json");
var potionsData = require("../../../data/tables/potions.json");
var ceremoniesData = require("../../../data/tables/ceremonies.json");

const chipIcons = true;

function chipIcon(type: string) {
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

function getInactive(params: any): { inactive: boolean; inactiveReason: string | undefined } {
	const { item, selected, remainingPicks, realm, invRegion, investment } = params;

	if (!selected && remainingPicks <= 0) {
		return { inactive: true, inactiveReason: undefined };
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

	return { inactive: false, inactiveReason: undefined };
}

const genTabContent = (params: {
	label: string;
	link?: string;
	allItems: any[];
	selectedItems: any[] | string | undefined;
	toggleFunction: (item: any) => void;
	remainingPicks: number;
	subSectionTitle?: string;
	realm?: Realm;
	invRegion?: string;
	comment?: string;
	filterFunction?: (item: any) => boolean;
}) => {
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
				<div className="flex w-full flex-col gap-3 py-2">
					{comment ? <i>{comment}</i> : null}
					{sections.map((s) => {
						return (
							<AccordionSection
								title={s}
								key={s}
								children={allItems
									.filter((item) => filterFunction(item))
									.filter((item) =>
										subSectionTitle ? item[subSectionTitle] === s : true,
									)
									.map((item) => {
										let selected =
											selectedItems === item.name ||
											selectedItems?.includes(item.name);
										const { inactive, inactiveReason } = getInactive({
											item: item,
											selected: selected,
											remainingPicks: remainingPicks,
											realm: realm,
											invRegion: invRegion,
										});

										return (
											<Chip
												onClick={() => toggleFunction(item.name)}
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
							></AccordionSection>
						);
					})}
				</div>
			),
		};
	}

	return {
		label: label,
		content: (
			<div className="flex w-full flex-col gap-3 py-2">
				{comment ? <i>{comment}</i> : null}
				<AccordionSection>
					{allItems
						.filter((item) => filterFunction(item))
						.map((item) => {
							let selected =
								selectedItems === item.name || selectedItems?.includes(item.name);
							return (
								<Chip
									onClick={() => toggleFunction(item.name)}
									selected={selected}
									inactive={!selected && remainingPicks <= 0}
									key={item.name}
								>
									{item.name}
								</Chip>
							);
						})}
				</AccordionSection>
			</div>
		),
		link: link,
	};
};

const genSelectedContent = (
	items: string[],
	toggleFunction: (item: string) => void,
	noDisable?: boolean,
) => {
	if (!items.length || items[0] === undefined) {
		return null;
	}
	return items?.map((i) => {
		return (
			<Chip
				onClick={() => toggleFunction(i)}
				shadow
				key={i}
				disabled={!noDisable && (i === "Channel Waystone" || i === "Artisans Oil")}
			>
				{i}
			</Chip>
		);
	});
};

export function OptionsPage() {
	const { form, toggleItem, setField, remaining } = useFormContext();
	const {
		skills,
		spells,
		investment,
		invTier,
		invRegion,
		invTerritory,
		invOption,
		crafts,
		potions,
		ceremonies,
		startingItem,
		realm,
	} = form;

	const showSpells = skills.includes("Magus");
	const showCrafts = skills.includes("Artisan");
	const showPotions = skills.includes("Apothecary");
	const showCeremonies = skills.filter((s) => s.startsWith("Divine Lore")).length > 0;

	// Generate the 'selected' items on the left of the screen
	var renderedInvestment = genSelectedContent([investment!], (i) => toggleItem("investment", i));
	var renderedInvOption = genSelectedContent([invOption!], (i) => toggleItem("invOption", i));
	var renderedInvRegion = genSelectedContent([invRegion!], (i) => toggleItem("invRegion", i));
	var renderedInvTerritory = genSelectedContent([invTerritory!], (i) =>
		toggleItem("invTerritory", i),
	);

	var renderedSpells = genSelectedContent(spells, (i) => toggleItem("spells", i));
	var renderedCrafts = genSelectedContent(crafts, (i) => toggleItem("crafts", i));
	var renderedStartingItem = genSelectedContent(
		[startingItem!],
		(i) => toggleItem("startingItem", i),
		true,
	);
	var renderedPotions = genSelectedContent(potions, (i) => toggleItem("potions", i));
	var renderedCeremonies = genSelectedContent(ceremonies, (i) => toggleItem("ceremonies", i));

	const investmentOptions = investmentsData.find((i) => i.name === investment)?.options ?? [];

	const investmentTabContent = (
		<div className="flex w-full flex-col gap-3 py-2">
			<AccordionSection title="Investment Type" link="Investments">
				{investmentsData.map((item) => {
					let selected = investment === item.name;

					const { inactive, inactiveReason } = getInactive({
						item: item,
						selected: selected,
						remainingPicks: investment ? 0 : 1,
						realm: realm,
						invRegion: invRegion,
					});

					return (
						<Chip
							onClick={() => toggleItem("investment", item.name)}
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
				<div className="flex justify-center">
					<Button
						// secondary
						onClick={() => {
							if (invTier > 1) {
								setField("invTier", invTier - 1);
							}
						}}
					>
						<BiMinus />
					</Button>
					<div>{invTier}</div>
					<Button
						// secondary
						onClick={() => {
							if (invTier < 10) {
								setField("invTier", invTier + 1);
							}
						}}
					>
						<BiPlus />
					</Button>
				</div>
			</AccordionSection>
			{investmentOptions.length > 0 && (
				<AccordionSection title="Investment Option">
					{investmentOptions.map((item) => {
						let selected = invOption === item.name;
						return (
							<Chip
								onClick={() => toggleItem("invOption", item.name)}
								selected={selected}
								inactive={!selected && !!investment}
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
				{regionsData.map((region) => {
					let selected = invRegion === region.name;
					const { inactive, inactiveReason } = getInactive({
						item: { name: region.name },
						selected: selected,
						remainingPicks: invRegion ? 0 : 1,
						realm: realm,
						investment: investment,
					});

					return (
						<Chip
							onClick={() => toggleItem("invRegion", region.name)}
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
				link={regionsData.find((region) => region.name === invRegion)?.link}
			>
				{invRegion ? (
					regionsData
						.find((region) => region.name === invRegion)
						?.territories.map((territory) => {
							let selected = invTerritory === territory;
							return (
								<Chip
									onClick={() => toggleItem("invTerritory", territory)}
									selected={selected}
									inactive={!selected && !!invTerritory}
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
		</div>
	);

	const startingItemOptions = craftsData.filter(
		(c) => crafts.includes(c.name) && c.rarity === "Journeyman",
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
				toggleFunction: (i: string) => toggleItem("spells", i),
				remainingPicks: remaining.spells,
				subSectionTitle: "type",
			}),
		);
	showCrafts &&
		renderedTabs.push(
			genTabContent({
				label: "Artisan Crafts",
				link: "Artisan_Crafts",
				allItems: craftsData,
				selectedItems: crafts,
				toggleFunction: (i: string) => toggleItem("crafts", i),
				remainingPicks: remaining.crafts,
				subSectionTitle: "rarity",
			}),
		);
	showCrafts &&
		renderedTabs.push(
			genTabContent({
				label: "Starting Item",
				link: undefined,
				allItems: startingItemOptions,
				selectedItems: startingItem,
				toggleFunction: (i: string) => toggleItem("startingItem", i),
				remainingPicks: startingItem ? 0 : 1,
				subSectionTitle: undefined,
				comment: "If you're a new Artisan, select your starting Journeyman item.",
			}),
		);
	showPotions &&
		renderedTabs.push(
			genTabContent({
				label: "Potion Recipes",
				link: "List_of_Apothecary_Potions",
				allItems: potionsData,
				selectedItems: potions,
				toggleFunction: (i: string) => toggleItem("potions", i),
				remainingPicks: remaining.potions,
				subSectionTitle: "type",
				realm: realm,
			}),
		);
	if (showCeremonies) {
		const loreSkills = skills
			.filter((s) => s.startsWith("Divine Lore "))
			.map((s) => s.split("Divine Lore ")[1].split(" (")[0]);
		renderedTabs.push(
			genTabContent({
				label: "Mastered Ceremonies",
				link: "Ceremonies_Overview",
				allItems: ceremoniesData,
				selectedItems: ceremonies,
				toggleFunction: (i: string) => toggleItem("ceremonies", i),
				remainingPicks: remaining.ceremonies,
				subSectionTitle: "sphere",
				realm: realm,
				filterFunction: (c: any) => loreSkills.includes(c.sphere),
			}),
		);
	}

	return (
		<div className="flex gap-2 flex-col sm:flex-row">
			<ContentPane style={{ flex: 4 }}>
				<SectionDivider
					left="Investment"
					right={!investment ? `(1 remaining)` : undefined}
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
							right={
								remaining.spells > 0 ? `(${remaining.spells} remaining)` : undefined
							}
						/>
						<SectionWrapper>{renderedSpells}</SectionWrapper>
					</>
				)}
				{showCrafts && (
					<>
						<SectionDivider
							left="Crafts"
							right={
								remaining.crafts > 0 ? `(${remaining.crafts} remaining)` : undefined
							}
						/>
						<SectionWrapper>{renderedCrafts}</SectionWrapper>
						<SectionDivider
							left="Starting Item"
							right={!startingItem ? `(1 remaining)` : undefined}
						/>
						<SectionWrapper>{renderedStartingItem}</SectionWrapper>
					</>
				)}
				{showPotions && (
					<>
						<SectionDivider
							left="Potions"
							right={
								remaining.potions > 0
									? `(${remaining.potions} remaining)`
									: undefined
							}
						/>
						<SectionWrapper>{renderedPotions}</SectionWrapper>
					</>
				)}
				{showCeremonies && (
					<>
						<SectionDivider
							left={"Mastered Ceremonies"}
							right={
								remaining.ceremonies > 0
									? `(${remaining.ceremonies} remaining)`
									: undefined
							}
						/>
						<SectionWrapper>{renderedCeremonies}</SectionWrapper>
					</>
				)}
			</ContentPane>
			<ContentPane style={{ flex: 5 }}>
				<Accordion items={renderedTabs}></Accordion>
			</ContentPane>
		</div>
	);
}

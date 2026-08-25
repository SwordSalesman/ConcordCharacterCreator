import useFormContext from "../../../hooks/use-form-context";
import { SectionDivider, SectionWrapper } from "../../creator/SectionDivider/SectionDivider";
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
	GiCrystalGrowth,
	GiCrystalWand,
	GiFallingLeaf,
	GiFruitTree,
	GiGalleon,
	GiGemNecklace,
	GiHammerNails,
	GiIncense,
	GiLockedChest,
	GiMoon,
	GiNinjaArmor,
	GiOakLeaf,
	GiOpenBook,
	GiPocketBow,
	GiPotionBall,
	GiRobe,
	GiShipWheel,
	GiShoonerSailboat,
	GiSwordsEmblem,
	GiTatteredBanner,
	GiWarPick,
	GiWheat,
} from "react-icons/gi";
import { regionIsCoastal, regionIsNotCoastal } from "../../../utils/selection-helper";
import { investmentRegionWarning } from "../../../utils/validity-helper";
import {
	AccordionSection,
	AccordionSectionSkeleton,
} from "@/components/common/Accordion/AccordionSection";
import Accordion from "@/components/common/Accordion/Accordion";
import { Chip } from "@/components/common/Chip/Chip";
import { Button } from "@/components/common/Button/Button";
import { investments as investmentsData } from "@/data/tables/investments";
import { regions as regionsData } from "@/data/tables/regions";
import { crafts as craftsData } from "@/data/tables/crafts";
import { Realm } from "@/data/tables/realms";
import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import { ceremonies as ceremoniesData } from "@/data/tables/ceremonies";
import { potions as potionsData } from "@/data/tables/potions";
import { spells as spellsData } from "@/data/tables/spells";
import { getNextInvestmentOption } from "@/utils/data-helper";
import { gridMirrorStyle } from "@/styles/Global";
import { canSelectPotion, isPotionMandatoryForHero } from "@/utils/validity-helper";

const chipIcons = true;

function investmentIcon(type: string) {
	switch (type) {
		case "Military":
			return <GiSwordsEmblem />;
		case "Naval":
			return <GiGalleon />;
		case "Herb Garden":
			return <GiFallingLeaf />;
		case "Leyline":
			return <GiCrystalGrowth />;
		case "Congregation":
			return <GiOpenBook />;
		case "Business":
			return <GiLockedChest />;
		case "Farm":
			return <GiWheat />;
		case "Wilderness":
			return <GiFruitTree />;
		case "Mine":
			return <GiWarPick />;
		default:
			return <></>;
	}
}

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
	const { item, selected, remainingPicks, realm, archetype, invRegion, investment } = params;

	if (!selected && remainingPicks <= 0) {
		return { inactive: true, inactiveReason: undefined };
	}
	if (item.name === "Artisans Oil" || item.name === "Channel Waystone") {
		return {
			inactive: true,
			inactiveReason: `Cannot unlearn ${item.name}`,
		};
	}
	if (item.type === "Potion" || item.type === "Tonic") {
		if (selected && isPotionMandatoryForHero(item.name, archetype)) {
			return {
				inactive: true,
				inactiveReason: `Cannot unlearn ${item.name}`,
			};
		}
		if (!canSelectPotion(item, realm, archetype)) {
			return {
				inactive: true,
				inactiveReason: `Only Crow Doktors and Lerona Merians can select ${item.name}`,
			};
		}
	}
	if (item.realm && item.realm !== realm) {
		return {
			inactive: true,
			inactiveReason: `Heroes from your realm cannot select ${item.name}`,
		};
	}
	if (
		(regionIsNotCoastal(item.name) && !!investment && investment === "Naval") ||
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
	archetype?: string;
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
		archetype,
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
								align="left"
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
											archetype: archetype,
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
				<AccordionSectionSkeleton>
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
				</AccordionSectionSkeleton>
			</div>
		),
		link: link,
	};
};

const genSelectedContent = (
	items: string[],
	toggleFunction: (item: string) => void,
	noDisable?: boolean,
	disableItemFunction?: (item: string) => boolean,
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
				disabled={
					!noDisable &&
					(i === "Channel Waystone" ||
						i === "Artisans Oil" ||
						(disableItemFunction ? disableItemFunction(i) : false))
				}
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
		invDiversify,
		crafts,
		potions,
		ceremonies,
		startingItem,
		realm,
		archetype,
	} = form;

	const showSpells = skills.includes("Magus");
	const showCrafts = skills.includes("Artisan");
	const showPotions = skills.includes("Apothecary");
	const showCeremonies = skills.filter((s) => s.startsWith("Divine Lore")).length > 0;

	// Generate the 'selected' items on the left of the screen
	var renderedInvestment = genSelectedContent([investment!], (i) => toggleItem("investment", i));
	var renderedInvOption = genSelectedContent([invOption!], (i) => toggleItem("invOption", i));
	var renderedInvDiversify = genSelectedContent(invDiversify, (i) =>
		toggleItem("invDiversify", i),
	);
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
	var renderedPotions = genSelectedContent(
		potions,
		(i) => toggleItem("potions", i),
		false,
		(i) => isPotionMandatoryForHero(i, archetype),
	);
	var renderedCeremonies = genSelectedContent(ceremonies, (i) => toggleItem("ceremonies", i));

	const investmentData = investmentsData.find((i) => i.name === investment);
	const investmentOptions = investmentData?.options ?? [];
	// Construct the base list of diversify options from the investment, these are all (1)
	const diversifyOptions =
		invTier > 1 && investmentData?.diversifyOptions
			? investmentData.diversifyOptions.map((o) => ({ name: `${o.name} (1)` }))
			: [];
	// Add the extra options, which will be the (2), (3) etc versions
	const extraDiversityOptions =
		invDiversify?.map((option) => {
			return {
				name: getNextInvestmentOption(option),
			};
		}) || [];
	const totalDiversifyOptions = diversifyOptions.length
		? diversifyOptions.concat(extraDiversityOptions)
		: [];

	const investmentTabContent = (
		<div className="flex w-full flex-col gap-3 py-2">
			<AccordionSection title="Investment Type" link="Investments" align="left">
				{investmentsData.map((item) => {
					let selected = investment === item.name;

					const { inactive, inactiveReason } = getInactive({
						item: item,
						selected: selected,
						remainingPicks: investment ? 0 : 1,
						realm: realm,
						invRegion: invRegion,
					});

					const icon = investmentIcon(item.name);

					return (
						<Chip
							onClick={() => toggleItem("investment", item.name)}
							selected={selected}
							inactive={inactive}
							inactiveReason={inactiveReason}
							key={item.name}
						>
							{icon}
							{item.name}
						</Chip>
					);
				})}
			</AccordionSection>
			<AccordionSection title="Investment Tier" align="left">
				<div className="flex justify-center items-center gap-2 ">
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
					<div className="text-xl">{invTier}</div>
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
				<AccordionSection title="Investment Option" align="left">
					{investmentOptions.map((item) => {
						let selected = invOption?.includes(item.name);
						return (
							<Chip
								onClick={() => toggleItem("invOption", item.name)}
								selected={selected}
								inactive={!selected && !!invOption}
								key={item.name}
							>
								{item.name}
							</Chip>
						);
					})}
				</AccordionSection>
			)}
			{totalDiversifyOptions.length > 0 && (
				<div className="animate-warning-fade-in">
					<AccordionSection title="Investment Diversification Option" align="left">
						{totalDiversifyOptions.map((item) => {
							let selected = invDiversify?.includes(item.name);
							return (
								<Chip
									onClick={() => toggleItem("invDiversify", item.name)}
									selected={selected}
									inactive={!selected && remaining.diversify <= 0}
									key={item.name}
								>
									{item.name}
								</Chip>
							);
						})}
					</AccordionSection>
				</div>
			)}
			<AccordionSection
				title="Investment Region"
				link="Map_of_Esterra"
				warning={invRegion ? investmentRegionWarning(realm, invRegion) : undefined}
				align="left"
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
				align="left"
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
				archetype: archetype,
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
		<div className="flex gap-2 flex-col sm:flex-row w-full">
			<ContentPane className="flex-4">
				<div className="flex flex-col flex-4 gap-3">
					<div>
						<SectionDivider>
							Investment {!investment ? ` (1 remaining)` : ""}
						</SectionDivider>
						{renderedInvestment || renderedInvOption || renderedInvRegion ? (
							// Left align the right column and right align the left column
							<div
								className={`grid grid-cols-2 gap-1 gap-x-2 items-center ${gridMirrorStyle}`}
							>
								{renderedInvestment && (
									<>
										<p>Type</p>
										<SectionWrapper>{renderedInvestment}</SectionWrapper>
									</>
								)}
								{renderedInvOption && (
									<>
										<p>Variant</p>
										<SectionWrapper>{renderedInvOption}</SectionWrapper>
									</>
								)}
								{renderedInvDiversify && (
									<>
										<p>Diversify</p>
										<SectionWrapper>{renderedInvDiversify}</SectionWrapper>
									</>
								)}
								{renderedInvRegion && (
									<>
										<p>Region</p>
										<SectionWrapper>{renderedInvRegion}</SectionWrapper>
									</>
								)}
								{renderedInvTerritory && (
									<>
										<p>Territory</p>
										<SectionWrapper>{renderedInvTerritory}</SectionWrapper>
									</>
								)}
							</div>
						) : (
							<div
								style={{
									opacity: 0.7,
									fontStyle: "italic",
									padding: "0 20px",
								}}
							>
								{
									"Select your Investment, as well as any other options you may need."
								}
							</div>
						)}
					</div>
					{showSpells && (
						<div>
							<SectionDivider>
								Spells
								{remaining.spells > 0 ? ` (${remaining.spells} remaining)` : ""}
							</SectionDivider>
							<SectionWrapper>{renderedSpells}</SectionWrapper>
						</div>
					)}
					{showCrafts && (
						<div>
							<SectionDivider>
								Crafts
								{remaining.crafts > 0 ? ` (${remaining.crafts} remaining)` : ""}
							</SectionDivider>
							<SectionWrapper>{renderedCrafts}</SectionWrapper>
							<SectionDivider>
								Starting Item
								{!startingItem ? ` (1 remaining)` : ""}
							</SectionDivider>
							<SectionWrapper>{renderedStartingItem}</SectionWrapper>
						</div>
					)}
					{showPotions && (
						<div>
							<SectionDivider>
								Potions
								{remaining.potions > 0 ? ` (${remaining.potions} remaining)` : ""}
							</SectionDivider>
							<SectionWrapper>{renderedPotions}</SectionWrapper>
						</div>
					)}
					{showCeremonies && (
						<div>
							<SectionDivider>
								Mastered Ceremonies
								{remaining.ceremonies > 0
									? ` (${remaining.ceremonies} remaining)`
									: ""}
							</SectionDivider>
							<SectionWrapper>{renderedCeremonies}</SectionWrapper>
						</div>
					)}
				</div>
			</ContentPane>
			<ContentPane className="flex-5">
				<Accordion items={renderedTabs}></Accordion>
			</ContentPane>
		</div>
	);
}

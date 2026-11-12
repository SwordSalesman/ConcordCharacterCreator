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
	GiOpenBook,
	GiPocketBow,
	GiPotionBall,
	GiRobe,
	GiSkullCrack,
	GiSwordsEmblem,
	GiTatteredBanner,
	GiWarPick,
	GiWheat,
} from "react-icons/gi";
import {
	AccordionSection,
	AccordionSectionSkeleton,
} from "@/components/common/Accordion/AccordionSection";
import Accordion from "@/components/common/Accordion/Accordion";
import { Chip } from "@/components/common/Chip/Chip";
import { Button } from "@/components/common/Button/Button";
import { CraftType } from "@/data/tables/crafts";
import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import { gridMirrorStyle } from "@/styles/Global";
import { useState } from "react";
import { Modal } from "@/components/common/Modal/Modal";
import { Remaining, RuleChoice } from "@/context/formContext";

interface OptionItem {
	name: string;
	type?: string;
	rarity?: string;
	sphere?: string;
	alignment?: boolean;
}

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

function chipIcon(type: CraftType) {
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
		case "Concordia: Banner":
			return <GiTatteredBanner />;
		case "Reliquary":
			return <GiIncense />;
		case "Concordia: Icon":
		case "Special":
			return <GiPotionBall />;
		default:
			return <></>;
	}
}

const genTabContent = (params: {
	label: string;
	link?: string;
	allItems: RuleChoice<OptionItem>[];
	toggleFunction: (item: string) => void;
	subSectionTitle?: "type" | "rarity" | "sphere";
	comment?: string;
}) => {
	const {
		label,
		link,
		allItems,
		toggleFunction,
		subSectionTitle,
		comment,
	} = params;

	const sections =
		label === "Artisan Crafts"
			? ["Journeyman", "Expert", "Masterwork"]
			: subSectionTitle
				? allItems
						.map((choice) => choice.value[subSectionTitle])
						.filter((value): value is string => value !== undefined)
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
							>
								{allItems
									.filter((choice) =>
										subSectionTitle ? choice.value[subSectionTitle] === s : true,
									)
									.map((choice) => {
										const item = choice.value;
										return (
											<Chip
												onClick={() => toggleFunction(item.name)}
												selected={choice.selected}
												inactive={
													choice.selected ? !choice.canRemove : !choice.canSelect
												}
												inactiveReason={
													choice.selected
														? choice.removeReason
														: choice.selectReason
												}
												key={item.name}
											>
												{label === "Artisan Crafts" &&
													chipIcon(item.type as CraftType)}
												{label === "Mastered Ceremonies" &&
													item.alignment === true && <GiMoon />}
												{item.name}
											</Chip>
										);
									})}
							</AccordionSection>
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
						.map((choice) => {
							const item = choice.value;
							return (
								<Chip
									onClick={() => toggleFunction(item.name)}
									selected={choice.selected}
									inactive={
										choice.selected ? !choice.canRemove : !choice.canSelect
									}
									inactiveReason={
										choice.selected
											? choice.removeReason
											: choice.selectReason
									}
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

const genSelectedContent = <T extends { name: string } | string>(
	choices: RuleChoice<T>[],
	toggleFunction: (item: string) => void,
) => {
	const selectedChoices = choices.filter((choice) => choice.selected);
	if (!selectedChoices.length) return null;
	return selectedChoices.map((choice) => {
		const item = choice.value;
		const name = typeof item === "string" ? item : item.name;
		return (
			<Chip
				onClick={() => toggleFunction(name)}
				shadow
				key={name}
				inactive={!choice.canRemove}
				inactiveReason={choice.removeReason}
			>
				{name}
			</Chip>
		);
	});
};

export function OptionsPage() {
	const {
		form,
		toggleItem,
		setField,
		remaining,
		maximum,
		choices,
		investmentTier,
		investmentStatus,
		investmentRegionWarning,
	} = useFormContext();
	const {
		invTier,
	} = form;

	const showSpells = choices.spells.length > 0;
	const showCrafts = choices.crafts.length > 0;
	const showPotions = choices.potions.length > 0;
	const showCeremonies = choices.ceremonies.length > 0;

	const [showInvTierWarning, setShowInvTierWarning] = useState(false);
	const [showInvestmentDestroyedModal, setShowInvestmentDestroyedModal] = useState(false);

	// Generate the 'selected' items on the left of the screen
	const renderedInvestment = genSelectedContent(choices.investments, (i) =>
		toggleItem("investment", i),
	);
	const renderedInvOption = genSelectedContent(choices.investmentOptions, (i) =>
		toggleItem("invOption", i),
	);
	const renderedInvDiversify = genSelectedContent(choices.diversifyOptions, (i) =>
		toggleItem("invDiversify", i),
	);
	const renderedInvRegion = genSelectedContent(choices.regions, (i) =>
		toggleItem("invRegion", i),
	);
	const renderedInvTerritory = genSelectedContent(choices.territories, (i) =>
		toggleItem("invTerritory", i),
	);

	const renderedSpells = genSelectedContent(choices.spells, (i) => toggleItem("spells", i));
	const renderedCrafts = genSelectedContent(choices.crafts, (i) => toggleItem("crafts", i));
	const renderedStartingItem = genSelectedContent(choices.startingItems, (i) =>
		toggleItem("startingItem", i),
	);
	const renderedPotions = genSelectedContent(choices.potions, (i) => toggleItem("potions", i));
	const renderedCeremonies = genSelectedContent(choices.ceremonies, (i) =>
		toggleItem("ceremonies", i),
	);

	const selectedRegion = choices.regions.find((choice) => choice.selected)?.value;

	const investmentTabContent = (
		<div className="flex w-full flex-col gap-3 py-2">
			<AccordionSection title="Investment Type" link="Investments" align="left">
				{choices.investments.map((choice) => {
					const item = choice.value;
					const icon = investmentIcon(item.name);

					return (
						<Chip
							onClick={() => toggleItem("investment", item.name)}
							selected={choice.selected}
							inactive={
								choice.selected ? !choice.canRemove : !choice.canSelect
							}
							inactiveReason={
								choice.selected ? choice.removeReason : choice.selectReason
							}
							key={item.name}
						>
							{icon}
							{item.name}
						</Chip>
					);
				})}
			</AccordionSection>
			<AccordionSection
				title="Investment Tier"
				align="left"
				warning={
					showInvTierWarning
						? "Only increase your investment tier if you have completed the necessary sign-out process at a Summit."
						: undefined
				}
			>
				{investmentTier.isFirstGame ? (
					<p className="text-sm text-left text-muted-foreground">
						To increase your investment tier, ensure you have done the correct sign-out
						process at a Summit. This option will become available after your first
						game.
					</p>
				) : (
					<div className="flex justify-center items-center gap-2 ">
						<Button
							disabled={
								!investmentTier.canDecrease &&
								!investmentTier.needsDestroyConfirmation
							}
							onClick={() => {
								if (investmentTier.needsDestroyConfirmation) {
									setShowInvestmentDestroyedModal(true);
								}
								if (investmentTier.canDecrease) {
									setField("invTier", invTier - 1);
								}
							}}
						>
							<BiMinus />
						</Button>
						<div className="text-xl">{invTier}</div>
						<Button
							disabled={!investmentTier.canIncrease}
							onClick={() => {
								if (investmentTier.canIncrease) {
									setShowInvTierWarning(true);
									setField("invTier", invTier + 1);
								}
							}}
						>
							<BiPlus />
						</Button>
					</div>
				)}
			</AccordionSection>
			{choices.investmentOptions.length > 0 && (
				<AccordionSection title="Investment Variant" align="left">
					{choices.investmentOptions.map((choice) => {
						const item = choice.value;
						return (
							<Chip
								onClick={() => toggleItem("invOption", item.name)}
								selected={choice.selected}
								inactive={choice.selected ? !choice.canRemove : !choice.canSelect}
								inactiveReason={
									choice.selected ? choice.removeReason : choice.selectReason
								}
								key={item.name}
							>
								{item.name}
							</Chip>
						);
					})}
				</AccordionSection>
			)}
			{choices.diversifyOptions.length > 0 && (
				<div className="animate-warning-fade-in">
					<AccordionSection title="Investment Diversification Option" align="left">
						{choices.diversifyOptions.map((choice) => {
							const item = choice.value;
							return (
								<Chip
									onClick={() => toggleItem("invDiversify", item.name)}
									selected={choice.selected}
									inactive={
										choice.selected ? !choice.canRemove : !choice.canSelect
									}
									inactiveReason={
										choice.selected ? choice.removeReason : choice.selectReason
									}
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
				warning={investmentRegionWarning || undefined}
				align="left"
			>
				{choices.regions.map((choice) => {
					const region = choice.value;
					return (
						<Chip
							onClick={() => toggleItem("invRegion", region.name)}
							selected={choice.selected}
							inactive={choice.selected ? !choice.canRemove : !choice.canSelect}
							inactiveReason={
								choice.selected ? choice.removeReason : choice.selectReason
							}
							key={region.name}
						>
							{region.name}
						</Chip>
					);
				})}
			</AccordionSection>
			<AccordionSection
				title="Investment Territory"
				link={selectedRegion?.link}
				align="left"
			>
				{selectedRegion ? (
					choices.territories.map((choice) => {
						const territory = choice.value;
						return (
							<Chip
								onClick={() => toggleItem("invTerritory", territory)}
								selected={choice.selected}
								inactive={choice.selected ? !choice.canRemove : !choice.canSelect}
								inactiveReason={
									choice.selected ? choice.removeReason : choice.selectReason
								}
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
			<Modal
				open={showInvestmentDestroyedModal}
				onClose={() => setShowInvestmentDestroyedModal(false)}
				title={
					<div className="flex gap-2 items-center justify-start">
						<GiSkullCrack size={24} />
						<p>Removing Investment</p>
					</div>
				}
				body={
					<p>
						By setting your investment tier to 0, your current investment details will
						be overwritten. Only do this if your investment has been{" "}
						<b className="text-destructive">destroyed</b> (not damaged) or{" "}
						<b className="text-destructive">permanently lost</b>.
					</p>
				}
				actions={[
					{ label: "Cancel", onClick: () => setShowInvestmentDestroyedModal(false) },
					{
						label: "Remove Investment",
						onClick: () => {
							setField("invTier", 0);
							setShowInvestmentDestroyedModal(false);
						},
						variant: "destructive",
					},
				]}
			/>
		</div>
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
				allItems: choices.spells,
				toggleFunction: (i: string) => toggleItem("spells", i),
				subSectionTitle: "type",
			}),
		);
	showCrafts &&
		renderedTabs.push(
			genTabContent({
				label: "Artisan Crafts",
				link: "Artisan_Crafts",
				allItems: choices.crafts,
				toggleFunction: (i: string) => toggleItem("crafts", i),
				subSectionTitle: "rarity",
			}),
		);
	showCrafts &&
		renderedTabs.push(
			genTabContent({
				label: "Starting Item",
				link: undefined,
				allItems: choices.startingItems,
				toggleFunction: (i: string) => toggleItem("startingItem", i),
				subSectionTitle: undefined,
				comment: "If you're a new Artisan, select your starting Journeyman item.",
			}),
		);
	showPotions &&
		renderedTabs.push(
			genTabContent({
				label: "Potion Recipes",
				link: "List_of_Apothecary_Potions",
				allItems: choices.potions,
				toggleFunction: (i: string) => toggleItem("potions", i),
				subSectionTitle: "type",
			}),
		);
	if (showCeremonies) {
		renderedTabs.push(
			genTabContent({
				label: "Mastered Ceremonies",
				link: "Ceremonies_Overview",
				allItems: choices.ceremonies,
				toggleFunction: (i: string) => toggleItem("ceremonies", i),
				subSectionTitle: "sphere",
			}),
		);
	}

	function remainingSelectionText({
		field,
		warning,
	}: {
		field: keyof Remaining;
		warning?: boolean;
	}) {
		const rem = remaining[field];
		const max = maximum[field];
		return (
			<span
				className={`duration-150 ${rem <= 0 ? "opacity-50" : warning ? "text-destructive" : ""}`}
			>
				{` (${max - rem}/${max})`}
			</span>
		);
	}

	return (
		<div className="flex gap-2 flex-col sm:flex-row w-full">
			<ContentPane className="flex-4">
				<div className="flex flex-col flex-4 gap-4">
					<div>
						<SectionDivider>
							Investment
							<span className="text-destructive">
								{investmentStatus.warning}
							</span>
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
							<div className="opacity-70 italic">
								{investmentStatus.emptyMessage}
							</div>
						)}
					</div>
					{showSpells && (
						<div>
							<SectionDivider>
								Spells {remainingSelectionText({ field: "spells", warning: true })}
							</SectionDivider>
							<SectionWrapper>{renderedSpells}</SectionWrapper>
						</div>
					)}
					{showCrafts && (
						<>
							<div>
								<SectionDivider>
									Crafts
									{remainingSelectionText({ field: "crafts", warning: true })}
								</SectionDivider>
								<SectionWrapper>{renderedCrafts}</SectionWrapper>
							</div>
							<div>
								<SectionDivider>
									Starting Artisan Item
									{remainingSelectionText({ field: "startingItem", warning: true })}
								</SectionDivider>
								<SectionWrapper>{renderedStartingItem}</SectionWrapper>
							</div>
						</>
					)}
					{showPotions && (
						<div>
							<SectionDivider>
								Potions
								{remainingSelectionText({ field: "potions", warning: true })}
							</SectionDivider>
							<SectionWrapper>{renderedPotions}</SectionWrapper>
						</div>
					)}
					{showCeremonies && (
						<div>
							<SectionDivider>
								Mastered Ceremonies
								{remainingSelectionText({ field: "ceremonies", warning: false })}
							</SectionDivider>
							<p className="opacity-70 italic pb-2">
								You may leave your mastered ceremonies unselected (you can master
								them during Summit).
							</p>
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

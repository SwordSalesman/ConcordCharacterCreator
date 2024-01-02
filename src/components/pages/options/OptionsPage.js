import Accordion from "../../common/Accordion/Accordion";
import ContentPane from "../../common/ContentPane/ContentPane";
import useFormContext from "../../../hooks/use-form-context";
import Chip from "../../common/Chip/Chip";
import SectionDivider from "../../common/SectionDivider/SectionDivider";
import {
    SectionLine,
    SectionWrapper,
} from "../../common/SectionDivider/SectionDivider.style";
import { SkillPageWrapper } from "../skills/SkillsPage.style";
import { AccordionSection } from "../../common/Accordion/AccordionSection";
import { BackgroundInputWrapper } from "../background/BackgroundPage";
import React from "react";
var investmentData = require("../../../data/tables/investments.json");
var regionData = require("../../../data/tables/regions.json");
var spellsData = require("../../../data/tables/spells.json");
var craftsData = require("../../../data/tables/crafts.json");
var potionsData = require("../../../data/tables/potions.json");
var ceremoniesData = require("../../../data/tables/ceremonies.json");

const genTabContent = (
    label,
    link,
    allItems,
    selectedItems,
    toggleFunction,
    remainingPicks,
    subSectionTitle,
    realm,
    filterFunction = (a) => true
) => {
    const sections = subSectionTitle
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
                    {sections.map((s) => {
                        return (
                            <AccordionSection title={s} key={s}>
                                {allItems
                                    .filter((item) => filterFunction(item))
                                    .filter(
                                        (item) => item[subSectionTitle] === s
                                    )
                                    .map((item) => {
                                        let selected = selectedItems
                                            ?.map((i) => i.name)
                                            .includes(item.name);
                                        let invalidRealm =
                                            item.realm && item.realm !== realm;
                                        return (
                                            <Chip
                                                onClick={() =>
                                                    toggleFunction({
                                                        name: item.name,
                                                    })
                                                }
                                                selected={selected}
                                                inactive={
                                                    (!selected &&
                                                        remainingPicks <= 0) ||
                                                    invalidRealm
                                                }
                                                key={item.name}
                                            >
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
        content: allItems
            .filter((item) => filterFunction(item))
            .map((item) => {
                let selected = selectedItems
                    ?.map((i) => i.name)
                    .includes(item.name);
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
            }),
        link: link,
    };
};

const genSelectedContent = (items, toggleFunction) => {
    if (!items || !items.length) {
        return null;
    }
    return items?.map((i) => (
        <Chip
            onClick={() => toggleFunction({ name: i.name })}
            shadow
            key={i.name}
        >
            {i.name}
        </Chip>
    ));
};

function OptionsPage() {
    const {
        skills,
        spells,
        toggleSpell,
        investment,
        toggleInvestment,
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
        realm,
    } = useFormContext();

    // Variables
    const skillNames = skills ? skills.map((s) => s.name) : [];
    const showSpells = skillNames.includes("Magus");
    const showCrafts = skillNames.includes("Artisan");
    const showPotions = skillNames.includes("Apothecary");
    const showCeremonies =
        skillNames.filter((s) => s.startsWith("Divine Lore")).length > 0;

    const numInvestment = 1 - (investment ? investment.length : 0);
    const numInvRegion = 1 - (invRegion ? invRegion.length : 0);
    const numInvTerritory = 1 - (invTerritory ? invTerritory.length : 0);
    const numInvOption = 1 - (invOption ? invOption.length : 0);

    const maxSpells =
        showSpells &&
        skillNames.includes("Magus") * 2 +
            skillNames.filter((s) => s.startsWith("Additional Spell")).length *
                1;
    const numSpells = maxSpells - (spells ? spells.length : 0);

    const maxCeremonies =
        showCeremonies &&
        (skillNames.filter((s) => s.startsWith("Divine Lore")).length + 1) * 2 +
            skillNames.filter((s) => s.startsWith("Extra Ceremony")).length * 2;
    const numCeremonies = maxCeremonies - (ceremonies ? ceremonies.length : 0);

    const maxCrafts =
        showCrafts &&
        skillNames.filter((s) => s.startsWith("Artisan")).length * 4 +
            skillNames.filter((s) => s.startsWith("Extra Craft")).length * 2;
    const numCrafts = maxCrafts - (crafts ? crafts.length : 0);

    const maxPotions =
        showPotions &&
        skillNames.filter((s) => s.startsWith("Apothecary")).length * 3 +
            skillNames.filter((s) => s.startsWith("Extra Recipe")).length * 2;
    const numPotions = maxPotions - (potions ? potions.length : 0);

    // Generate the 'selected' items on the left of the screen
    var renderedInvestment = genSelectedContent(investment, toggleInvestment);
    var renderedInvOption = genSelectedContent(invOption, toggleInvOption);
    var renderedInvRegion = genSelectedContent(invRegion, toggleInvRegion);
    var renderedInvTerritory = genSelectedContent(
        invTerritory,
        toggleInvTerritory
    );
    var renderedSpells = showSpells
        ? genSelectedContent(spells, toggleSpell)
        : null;
    var renderedCrafts = showCrafts
        ? genSelectedContent(crafts, toggleCraft)
        : null;
    var renderedPotions = showPotions
        ? genSelectedContent(potions, togglePotion)
        : null;
    var renderedCeremonies = showCeremonies
        ? genSelectedContent(ceremonies, toggleCeremony)
        : null;

    // Conditionally generate each of the tabs on the right of the screen
    // const renderedTabs = [
    //     genTabContent(
    //         "Investment",
    //         "Investments",
    //         investmentData,
    //         investment,
    //         toggleInvestment,
    //         numInvestment
    //     ),
    // ];
    const investmentOptions =
        investment && investment.length
            ? investmentData.find((i) => i.name === investment[0].name)?.options
            : null;

    const investmentTabContent = (
        <BackgroundInputWrapper>
            <AccordionSection title='Investment Type' link='Investments'>
                {investmentData.map((item) => {
                    let selected = investment
                        ?.map((i) => i.name)
                        .includes(item.name);
                    return (
                        <Chip
                            onClick={() =>
                                toggleInvestment({ name: item.name })
                            }
                            selected={selected}
                            inactive={!selected && numInvestment <= 0}
                            key={item.name}
                        >
                            {item.name}
                        </Chip>
                    );
                })}
            </AccordionSection>
            {investmentOptions && (
                <AccordionSection title='Investment Option'>
                    {investmentOptions.map((item) => {
                        let selected = invOption
                            ?.map((i) => i.name)
                            .includes(item.name);
                        return (
                            <Chip
                                onClick={() =>
                                    toggleInvOption({ name: item.name })
                                }
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
            <AccordionSection title='Investment Region' link='Map_of_Esterra'>
                {regionData.map((region) => {
                    let selected = invRegion
                        ?.map((i) => i.name)
                        .includes(region.name);
                    return (
                        <Chip
                            onClick={() =>
                                toggleInvRegion({ name: region.name })
                            }
                            selected={selected}
                            inactive={!selected && numInvRegion <= 0}
                            key={region.name}
                        >
                            {region.name}
                        </Chip>
                    );
                })}
            </AccordionSection>
            <AccordionSection
                title='Investment Territory'
                link={
                    invRegion[0]
                        ? regionData.find(
                              (region) => region.name === invRegion[0].name
                          ).link
                        : null
                }
            >
                {invRegion && invRegion[0]?.name ? (
                    regionData
                        .find((region) => region.name === invRegion[0].name)
                        .territories.map((territory) => {
                            let selected = invTerritory
                                ?.map((i) => i.name)
                                .includes(territory);
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
                    <p style={{ opacity: 0.5, fontStyle: "italic" }}>
                        Select a Region first
                    </p>
                )}
            </AccordionSection>
        </BackgroundInputWrapper>
    );

    const renderedTabs = [];
    renderedTabs.push({
        label: "Investment",
        content: investmentTabContent,
        // link: "Investments",
    });
    showSpells &&
        renderedTabs.push(
            genTabContent(
                "Spells",
                "List_of_Known_Magical_Spells",
                spellsData,
                spells,
                toggleSpell,
                numSpells,
                "type",
                realm
            )
        );
    showCrafts &&
        renderedTabs.push(
            genTabContent(
                "Artisan Crafts",
                "Artisan_Crafts",
                craftsData,
                crafts,
                toggleCraft,
                numCrafts,
                "rarity",
                realm
            )
        );
    showPotions &&
        renderedTabs.push(
            genTabContent(
                "Potion Recipes",
                "List_of_Apothecary_Potions",
                potionsData,
                potions,
                togglePotion,
                numPotions,
                "type",
                realm
            )
        );
    if (showCeremonies) {
        let skillTitles = skills.map((s) => s.name).toString();
        renderedTabs.push(
            genTabContent(
                "Mastered Ceremonies",
                "Ceremonies_Overview",
                ceremoniesData,
                ceremonies,
                toggleCeremony,
                numCeremonies,
                "sphere",
                realm,
                (c) => skillTitles.includes(c.sphere)
            )
        );
    }

    return (
        <SkillPageWrapper>
            <ContentPane style={{ flex: 4 }}>
                <SectionDivider
                    left='Investment'
                    right={numInvestment > 0 && `(${numInvestment} remaining)`}
                />
                <SectionWrapper>
                    {renderedInvestment ||
                    renderedInvOption ||
                    renderedInvRegion ? (
                        <>
                            {renderedInvestment && (
                                <SectionLine>
                                    Type: {renderedInvestment}
                                </SectionLine>
                            )}
                            {renderedInvOption && (
                                <SectionLine>
                                    Variant: {renderedInvOption}
                                </SectionLine>
                            )}
                            {renderedInvTerritory && (
                                <SectionLine>
                                    Territory: {renderedInvTerritory}
                                </SectionLine>
                            )}
                            {renderedInvRegion && (
                                <SectionLine>
                                    Region: {renderedInvRegion}
                                </SectionLine>
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
                            {
                                "Select your Investment, as well as any other options you may need."
                            }
                        </div>
                    )}
                </SectionWrapper>
                {showSpells && (
                    <>
                        <SectionDivider
                            left='Spells'
                            right={numSpells > 0 && `(${numSpells} remaining)`}
                        />
                        <SectionWrapper>{renderedSpells}</SectionWrapper>
                    </>
                )}
                {showCrafts && (
                    <>
                        <SectionDivider
                            left='Crafts'
                            right={numCrafts > 0 && `(${numCrafts} remaining)`}
                        />
                        <SectionWrapper>{renderedCrafts}</SectionWrapper>
                    </>
                )}
                {showPotions && (
                    <>
                        <SectionDivider
                            left='Potions'
                            right={
                                numPotions > 0 && `(${numPotions} remaining)`
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
                                numCeremonies > 0 &&
                                `(${numCeremonies} remaining)`
                            }
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

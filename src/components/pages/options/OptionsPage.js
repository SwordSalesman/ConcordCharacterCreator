import Accordion from "../../common/Accordion/Accordion";
import ContentPane from "../../common/ContentPane/ContentPane";
import useFormContext from "../../../hooks/use-form-context";
import Chip from "../../common/Chip/Chip";
import SectionDivider from "../../common/SectionDivider/SectionDivider";
import useRealmImage from "../../../hooks/use-realm-image";
import { ColumnPageWrapper } from "../../../styles/Global";
import { SectionWrapper } from "../../common/SectionDivider/SectionDivider.style";
var investmentsData = require("../../../data/tables/investments.json");
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
    filterFunction = (a) => true
) => {
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
                    >
                        {item.name}
                    </Chip>
                );
            }),
        link: link,
    };
};

const genSelectedContent = (items, toggleFunction) => {
    if (!items) {
        return null;
    }
    return items?.map((i) => (
        <Chip onClick={() => toggleFunction({ name: i.name })} shadow>
            {i.name}
        </Chip>
    ));
};

function OptionsPage() {
    const {
        realm,
        skills,
        spells,
        toggleSpell,
        investments,
        toggleInvestment,
        crafts,
        toggleCraft,
        potions,
        togglePotion,
        ceremonies,
        toggleCeremony,
    } = useFormContext();
    const realmImage = useRealmImage(realm);

    // Variables
    const skillNames = skills ? skills.map((s) => s.name) : [];
    const showSpells = skillNames.includes("Magus");
    const showCrafts = skillNames.includes("Artisan");
    const showPotions = skillNames.includes("Apothecary");
    const showCeremonies =
        skillNames.filter((s) => s.startsWith("Divine Lore")).length > 0;

    const numInvestments = 1 - (investments ? investments.length : 0);

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
    var renderedInvestments = genSelectedContent(investments, toggleInvestment);
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
    const renderedTabs = [
        genTabContent(
            "Investment",
            "Investments",
            investmentsData,
            investments,
            toggleInvestment,
            numInvestments
        ),
    ];
    showSpells &&
        renderedTabs.push(
            genTabContent(
                "Spells",
                "Spellcasting",
                spellsData,
                spells,
                toggleSpell,
                numSpells
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
                numCrafts
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
                numPotions
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
                (c) => skillTitles.includes(c.sphere)
            )
        );
    }

    return (
        <ColumnPageWrapper>
            <ContentPane background={realmImage}>
                <SectionDivider left='Investment' right={numInvestments} />
                <SectionWrapper>
                    {renderedInvestments?.length > 0 ? (
                        renderedInvestments
                    ) : (
                        <div className='opacity-60 italic px-10'>
                            {
                                "Select your Investment, as well as any other options you may need."
                            }
                        </div>
                    )}
                </SectionWrapper>
                {showSpells && (
                    <>
                        <SectionDivider left='Spells' right={numSpells} />
                        <SectionWrapper>{renderedSpells}</SectionWrapper>
                    </>
                )}
                {showCrafts && (
                    <>
                        <SectionDivider left='Crafts' right={numCrafts} />
                        <SectionWrapper>{renderedCrafts}</SectionWrapper>
                    </>
                )}
                {showPotions && (
                    <>
                        <SectionDivider left='Potions' right={numPotions} />
                        <SectionWrapper>{renderedPotions}</SectionWrapper>
                    </>
                )}
                {showCeremonies && (
                    <>
                        <SectionDivider
                            left={"Mastered Ceremonies"}
                            right={numCeremonies}
                        />
                        <SectionWrapper>{renderedCeremonies}</SectionWrapper>
                    </>
                )}
            </ContentPane>
            <ContentPane>
                <Accordion items={renderedTabs}></Accordion>
            </ContentPane>
        </ColumnPageWrapper>
    );
}

export default OptionsPage;

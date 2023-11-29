import Accordion from "../../../components/common/Accordion/Accordion";
import ContentPane from "../../../components/common/ContentPane/ContentPane";
import useFormContext from "../../../hooks/use-form-context";
import TextInput from "../../../components/common/TextInput/TextInput";
import SectionDivider from "../../../components/common/SectionDivider/SectionDivider";
import Chip from "../../../components/common/Chip/Chip";
import { styled } from "styled-components";
import { SectionWrapper } from "../../common/SectionDivider/SectionDivider.style";
import { BackgroundPageWrapper } from "./BackgroundPage.style";
import { AccordionSection } from "../../common/Accordion/AccordionSection";
import useRealmDetails from "../../../hooks/use-realm-details";

var allArchetypes = require("../../../data/tables/archetypes.json");
var allGraces = require("../../../data/tables/graces.json");

function BackgroundPage() {
    const {
        realm,
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
    } = useFormContext();
    const fullRealm = useRealmDetails(realm);

    var archetypeLink = fullRealm ? fullRealm.archetypeLink : null;
    var renderedArchetype = null;
    if (realm) {
        renderedArchetype = allArchetypes
            .filter((a) => a.realm === realm)
            .map((a) => {
                let selected = archetype
                    ?.map((selA) => selA.name)
                    .includes(a.name);
                return (
                    <Chip
                        onClick={() => toggleArchetype(a)}
                        selected={selected}
                        inactive={!selected && archetype?.length >= 1}
                        key={a.name}
                    >
                        {a.name}
                    </Chip>
                );
            });
    } else {
        renderedArchetype = (
            <p style={{ opacity: 0.5, fontStyle: "italic" }}>
                Select a realm first
            </p>
        );
    }

    var renderedGrace = null;
    renderedGrace = allGraces.map((g) => {
        let selected = grace?.map((sel) => sel.name).includes(g.name);
        return (
            <Chip
                onClick={() => toggleGrace(g)}
                selected={selected}
                inactive={!selected && grace?.length >= 1}
                key={g.name}
            >
                {g.name}
            </Chip>
        );
    });

    const tabs = [
        {
            label: "Identity",
            content: (
                <BackgroundInputWrapper>
                    <TextInput
                        value={heroName}
                        onChange={setHeroName}
                        title='Name'
                        placeholder='Enter your name'
                        // invalid={heroName.length < 1}
                        // invalidText="Don't forget your name"
                    />
                    <AccordionSection title='Archetype' link={archetypeLink}>
                        {renderedArchetype}
                    </AccordionSection>
                    <AccordionSection title='Grace' link='Graces'>
                        {renderedGrace}
                    </AccordionSection>
                </BackgroundInputWrapper>
            ),
        },
        {
            label: "Alliances",
            link: "Player_Groups",
            content: (
                <BackgroundInputWrapper>
                    <TextInput
                        value={warband}
                        onChange={setWarband}
                        title='Band'
                        placeholder='Name of your Band (if any)'
                    />
                    <TextInput
                        value={sect}
                        onChange={setSect}
                        title='Sect'
                        placeholder='Name of your Sect (if any)'
                    />
                </BackgroundInputWrapper>
            ),
        },
        {
            label: "Objectives",
            content: (
                <BackgroundInputWrapper>
                    <TextInput
                        value={icGoals}
                        onChange={setIcGoals}
                        title='In Character Goals'
                        placeholder='1000 character limit'
                        style={{ height: "4em" }}
                    />
                    <TextInput
                        value={oocGoals}
                        onChange={setOocGoals}
                        title='Out of Character Goals'
                        placeholder='1000 character limit'
                        style={{ height: "4em" }}
                    />
                </BackgroundInputWrapper>
            ),
        },
        {
            label: "Backstory",
            content: (
                <BackgroundInputWrapper>
                    <TextInput
                        value={backstory}
                        onChange={setBackstory}
                        title='Character Backstory'
                        placeholder='1000 character limit'
                        style={{ height: "4em" }}
                    />
                    <TextInput
                        value={invDetails}
                        onChange={setInvDetails}
                        title='Investment Description'
                        placeholder='1000 character limit'
                        style={{ height: "4em" }}
                    />
                </BackgroundInputWrapper>
            ),
        },
    ];

    return (
        <BackgroundPageWrapper>
            <ContentPane style={{ width: "100%" }}>
                <SectionDivider left='Tell us about yourself'></SectionDivider>
                <SectionWrapper />
                <Accordion items={tabs}></Accordion>
            </ContentPane>
        </BackgroundPageWrapper>
    );
}

export default BackgroundPage;

export const BackgroundInputWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 15px 0;
`;

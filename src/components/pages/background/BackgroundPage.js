import Accordion from "../../../components/common/Accordion/Accordion";
import ContentPane from "../../../components/common/ContentPane/ContentPane";
import useFormContext from "../../../hooks/use-form-context";
import TextInput from "../../../components/common/TextInput/TextInput";
import SectionDivider from "../../../components/common/SectionDivider/SectionDivider";
import Chip from "../../../components/common/Chip/Chip";
import useRealmImage from "../../../hooks/use-realm-image";
import { ColumnPageWrapper } from "../../../styles/Global";
import { styled } from "styled-components";
import { ColumnPage } from "../ColumnPageWrapper";
import { SectionWrapper } from "../../common/SectionDivider/SectionDivider.style";
import { BackgroundPageWrapper } from "./BackgroundPage.style";

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
    const realmImage = useRealmImage(realm);

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
                    />
                    <div className='w-full'>
                        <div className=''>Archetype</div>
                        <div className='flex w-full flex-wrap justify-center'>
                            {renderedArchetype}
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className=''>Grace</div>
                        <div className='flex w-full flex-wrap justify-center'>
                            {renderedGrace}
                        </div>
                    </div>
                </BackgroundInputWrapper>
            ),
            link: "Archetypes",
        },
        {
            label: "Alliances",
            link: "Bands",
            content: (
                <BackgroundInputWrapper>
                    <TextInput
                        value={warband}
                        onChange={setWarband}
                        title='Warband'
                        placeholder='Name of your Warband (if any)'
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
                        className='h-16'
                    />
                    <TextInput
                        value={oocGoals}
                        onChange={setOocGoals}
                        title='Out of Character Goals'
                        placeholder='1000 character limit'
                        className='h-16'
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
                        className='h-16'
                    />
                    <TextInput
                        value={invDetails}
                        onChange={setInvDetails}
                        title='Investment Description'
                        placeholder='1000 character limit'
                        className='h-16'
                    />
                </BackgroundInputWrapper>
            ),
        },
    ];

    return (
        <BackgroundPageWrapper>
            {/* <ContentPane>
                <SectionWrapper>{heroName}</SectionWrapper>
              </ContentPane> */}
            <ContentPane style={{ width: "100%" }}>
                <SectionDivider left='Tell us about yourself'></SectionDivider>
                <SectionWrapper />
                <Accordion items={tabs}></Accordion>
            </ContentPane>
        </BackgroundPageWrapper>
    );
}

export default BackgroundPage;

const BackgroundInputWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 15px 0;
`;

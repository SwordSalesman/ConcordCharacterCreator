import Accordion from "../../../components/common/Accordion/Accordion";
import ContentPane from "../../../components/common/ContentPane/ContentPane";
import useFormContext from "../../../hooks/use-form-context";
import TextInput from "../../../components/common/TextInput/TextInput";
import SectionDivider from "../../../components/common/SectionDivider/SectionDivider";
import Chip from "../../../components/common/Chip/Chip";
import useRealmImage from "../../../hooks/use-realm-image";
import { ColumnPageWrapper } from "../../../styles/Global";

var allArchetypes = require("../../../data/tables/archetypes.json");
var allGraces = require("../../../data/tables/graces.json");

function BackgroundPage() {
    const {
        realm,
        heroName,
        setHeroName,
        archetypes,
        toggleArchetype,
        graces,
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
        investmentDetails,
        setInvestmentDetails,
    } = useFormContext();
    const realmImage = useRealmImage(realm);

    var renderedArchetypes = null;
    if (realm) {
        renderedArchetypes = allArchetypes
            .filter((a) => a.realm === realm)
            .map((a) => {
                let selected = archetypes?.map((selA) => selA).includes(a.name);
                return (
                    <Chip
                        onClick={() => toggleArchetype(a.name)}
                        selected={selected}
                        inactive={!selected && archetypes?.length >= 1}
                    >
                        {a.name}
                    </Chip>
                );
            });
    }

    var renderedGraces = null;
    renderedGraces = allGraces.map((g) => {
        let selected = graces?.map((sel) => sel.name).includes(g.name);
        return (
            <Chip
                onClick={() => toggleGrace(g)}
                selected={selected}
                inactive={!selected && graces?.length >= 1}
            >
                {g.name}
            </Chip>
        );
    });

    const tabs = [
        {
            label: "Identity",
            content: (
                <>
                    <TextInput
                        value={heroName}
                        onChange={setHeroName}
                        title='Name'
                        placeholder='Enter your name'
                    ></TextInput>
                    <div className='w-full'>
                        <div className=''>Archetype</div>
                        <div className='flex w-full flex-wrap justify-center'>
                            {renderedArchetypes}
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className=''>Grace</div>
                        <div className='flex w-full flex-wrap justify-center'>
                            {renderedGraces}
                        </div>
                    </div>
                </>
            ),
            link: "almanac:realms:archetypes",
        },
        {
            label: "Alliances",
            link: "play-guide:bands",
            content: (
                <>
                    <TextInput
                        value={warband}
                        onChange={setWarband}
                        title='Warband'
                        placeholder='Name of your Warband (if any)'
                    ></TextInput>
                    <TextInput
                        value={sect}
                        onChange={setSect}
                        title='Sect'
                        placeholder='Name of your Sect (if any)'
                    ></TextInput>
                </>
            ),
        },
        {
            label: "Objectives",
            content: (
                <>
                    <TextInput
                        value={icGoals}
                        onChange={setIcGoals}
                        title='In Character Goals'
                        placeholder='1000 character limit'
                        className='h-16'
                    ></TextInput>
                    <TextInput
                        value={oocGoals}
                        onChange={setOocGoals}
                        title='Out of Character Goals'
                        placeholder='1000 character limit'
                        className='h-16'
                    ></TextInput>
                </>
            ),
        },
        {
            label: "Backstory",
            content: (
                <>
                    <TextInput
                        value={backstory}
                        onChange={setBackstory}
                        title='Character Backstory'
                        placeholder='1000 character limit'
                        className='h-16'
                    ></TextInput>
                    <TextInput
                        value={investmentDetails}
                        onChange={setInvestmentDetails}
                        title='Investment Description'
                        placeholder='1000 character limit'
                        className='h-16'
                    ></TextInput>
                </>
            ),
        },
    ];

    return (
        <ColumnPageWrapper>
            <ContentPane background={realmImage} style={{ flex: 1 }}>
                <SectionDivider left='Tell us about yourself'></SectionDivider>
            </ContentPane>
            <ContentPane style={{ flex: 2 }}>
                <Accordion items={tabs}></Accordion>
            </ContentPane>
        </ColumnPageWrapper>
    );
}

export default BackgroundPage;

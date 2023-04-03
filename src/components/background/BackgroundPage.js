import Accordion from "../common/Accordion";
import ContentPane from "../common/ContentPane";
import useFormContext from "../../hooks/use-form-context";
import TextInput from "../common/TextInput";
import SectionDivider from "../common/SectionDivider";
import SelectInput from "../common/SelectInput";

var archetypes = require("../../data/tables/archetypes.json");

function OptionsPage() {
  const {
    realm,
    heroName,
    setHeroName,
    archetype,
    setArchetype,
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

  var renderedArchetypes = null;
  if (realm) {
    renderedArchetypes = archetypes
      .filter((a) => a.realm === realm.name)
      .map((a) => {
        return {
          value: a.name,
          label: a.name,
        };
      });
    renderedArchetypes.unshift({ value: null, label: "(No archetype)" });
  }

  const tabs = [
    {
      label: "Identity",
      content: (
        <>
          <TextInput
            value={heroName}
            onChange={setHeroName}
            title="Name"
            placeholder="Enter your name"
          ></TextInput>
          {/* <TextInput
            value={archetype}
            onChange={setArchetype}
            title="Archetype"
            dropdownData={archetypes
              .filter((a) => a.realm === realm.name)
              .map((a) => a.name)}
            placeholder="Enter your archetype"
          ></TextInput> */}

          <SelectInput
            options={renderedArchetypes}
            onChange={setArchetype}
            value={archetype}
            title="Archetype"
            disabled={realm === null}
            className="mb-4"
            placeholder={
              realm ? "Select your archetype" : "Select a realm first"
            }
          ></SelectInput>
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
            title="Warband"
            placeholder="Name of your Warband (if any)"
          ></TextInput>
          <TextInput
            value={sect}
            onChange={setSect}
            title="Sect"
            placeholder="Name of your Sect (if any)"
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
            title="In Character Goals"
            placeholder="1000 character limit"
            className="h-16"
          ></TextInput>
          <TextInput
            value={oocGoals}
            onChange={setOocGoals}
            title="Out of Character Goals"
            placeholder="1000 character limit"
            className="h-16"
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
            title="Character Backstory"
            placeholder="1000 character limit"
            className="h-16"
          ></TextInput>
          <TextInput
            value={investmentDetails}
            onChange={setInvestmentDetails}
            title="Investment Description"
            placeholder="1000 character limit"
            className="h-16"
          ></TextInput>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-around">
        <ContentPane background={realm ? realm.image : null}>
          <SectionDivider left="Enter your name, everything else is optional"></SectionDivider>
        </ContentPane>
        <ContentPane>
          <Accordion items={tabs}></Accordion>
        </ContentPane>
      </div>
    </div>
  );
}

export default OptionsPage;

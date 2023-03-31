import Accordion from "../common/Accordion";
import ContentPane from "../common/ContentPane";
import useFormContext from "../../hooks/use-form-context";
import TextInput from "./TextInput";

function OptionsPage() {
  const { realm, heroName, setHeroName, archetype, setArchetype } =
    useFormContext();

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
          <TextInput
            value={archetype}
            onChange={setArchetype}
            title="Archetype"
            placeholder="Enter your archetype"
          ></TextInput>
        </>
      ),
    },
    {
      label: "Alliances",
      content: "Feilds for warband, sect",
    },
    {
      label: "Objectives",
      content: "These are the craft options",
    },
    {
      label: "Backstory",
      content: "These are the recipe options",
    },
  ];

  return (
    <div>
      <div className="flex justify-around">
        <ContentPane background={realm ? realm.image : null}>
          Summary for chosen options here.
        </ContentPane>
        <ContentPane>
          <Accordion items={tabs}></Accordion>
        </ContentPane>
      </div>
    </div>
  );
}

export default OptionsPage;

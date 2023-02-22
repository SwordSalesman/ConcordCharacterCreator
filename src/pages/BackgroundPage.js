import Accordion from "../components/Accordion";
import ContentPane from "../components/ContentPane";
import useFormContext from "../hooks/use-form-context";

const tabs = [
  {
    label: "Identity",
    content: "Fields for name, archetype",
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

function OptionsPage() {
  const { realm } = useFormContext();

  return (
    <div>
      <div className="flex">
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

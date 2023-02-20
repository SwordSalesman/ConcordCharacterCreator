import Accordion from "../components/Accordion";
import ContentPane from "../components/ContentPane";
import BackgroundImage from "../data/images/realm-logos/Bbw.jpg";

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
  return (
    <div>
      <div className="flex">
        <ContentPane background={BackgroundImage}>
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

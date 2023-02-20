import Accordion from "../components/Accordion";
import ContentPane from "../components/ContentPane";
import BackgroundImage from "../data/images/realm-logos/Bbw.jpg";

const tabs = [
  {
    label: "Investment",
    content: "These are the investment options",
  },
  {
    label: "Spells",
    content: "These are the spell options",
  },
  {
    label: "Artisan Crafts",
    content: "These are the craft options",
  },
  {
    label: "Potion Recipes",
    content: "These are the recipe options",
  },
  {
    label: "Mastered Ceremonies",
    content: "These are the cermony options",
  },
];

function OptionsPage() {
  return (
    <div>
      <div className="flex">
        <ContentPane background={BackgroundImage}>
          Choose your options here
        </ContentPane>
        <ContentPane>
          <Accordion items={tabs}></Accordion>
        </ContentPane>
      </div>
    </div>
  );
}

export default OptionsPage;

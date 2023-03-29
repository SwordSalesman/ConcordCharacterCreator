import Accordion from "../common/Accordion";
import ContentPane from "../common/ContentPane";
import useFormContext from "../../hooks/use-form-context";

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
  const { realm } = useFormContext();

  return (
    <div>
      <div className="flex">
        <ContentPane background={realm ? realm.image : null}>
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

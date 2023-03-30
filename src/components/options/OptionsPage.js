import Accordion from "../common/Accordion";
import ContentPane from "../common/ContentPane";
import useFormContext from "../../hooks/use-form-context";
import Chip from "../common/Chip";
var investments = require("../../data/tables/investments.json");
var spells = require("../../data/tables/spells.json");
var crafts = require("../../data/tables/crafts.json");
var potions = require("../../data/tables/potions.json");
var ceremonies = require("../../data/tables/ceremonies.json");

function OptionsPage() {
  const { realm } = useFormContext();

  const investmentItems = investments.map((i) => <Chip>{i}</Chip>);
  const spellItems = spells.map((i) => <Chip>{i.name}</Chip>);
  const craftItems = crafts.map((i) => <Chip>{i.name}</Chip>);
  const potionItems = potions.map((i) => <Chip>{i.name}</Chip>);
  const ceremonyItems = ceremonies.map((i) => <Chip>{i.name}</Chip>);

  const tabs = [
    {
      label: "Investment",
      content: investmentItems,
      link: "play-guide:investments",
    },
    {
      label: "Spells",
      content: spellItems,
      link: "play-guide:spellcasting",
    },
    {
      label: "Artisan Crafts",
      content: craftItems,
      link: "appendix:artisan-crafts",
    },
    {
      label: "Potion Recipes",
      content: potionItems,
      link: "appendix:potions",
    },
    {
      label: "Mastered Ceremonies",
      content: ceremonyItems,
      link: "appendix:ceremonies",
    },
  ];

  return (
    <div>
      <div className="flex justify-around">
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

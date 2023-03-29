import Accordion from "../common/Accordion";
import ContentPane from "../common/ContentPane";
import useFormContext from "../../hooks/use-form-context";
import { useEffect, useState } from "react";
import XpDisplay from "./XpDisplay";
import SkillItem from "./SkillItem";
import { GiBroadsword } from "react-icons/gi";
import { render } from "@testing-library/react";
var tabs = require("../../data/tables/skillTabs.json");
var skills = require("../../data/tables/skills.json");

function SkillsPage() {
  const { realm, gamesPlayed } = useFormContext();
  const [skillXp, setSkillXp] = useState(0);

  const totalXp = () => {
    return 8 + parseInt(gamesPlayed ? gamesPlayed : 0);
  };

  const remainingXp = () => {
    return totalXp() - skillXp;
  };

  const renderedTabs = tabs.map((tab) => {
    const renderedSkills = skills
      .filter((skill) => skill.tree === tab.label)
      .map((skill) => {
        return (
          <SkillItem
            skill={{ name: skill.name, cost: skill.costInit }}
          ></SkillItem>
        );
      });

    return { label: tab.label, content: renderedSkills };
  });

  return (
    <div>
      <div className="flex">
        <ContentPane background={realm ? realm.image : null}>
          <div className="text-left">
            <XpDisplay remaining={remainingXp()} total={totalXp()} />
            <br />
            Hey, this is where you would pick your skills. Have a look on the
            side and pick some skills which take your fancy, or don't! I'm not
            your mother.
          </div>
        </ContentPane>
        <ContentPane>
          <Accordion items={renderedTabs}></Accordion>
        </ContentPane>
      </div>
    </div>
  );
}

export default SkillsPage;

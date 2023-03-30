import Accordion from "../common/Accordion";
import ContentPane from "../common/ContentPane";
import useFormContext from "../../hooks/use-form-context";
import { useEffect, useState } from "react";
import SkillItem from "./SkillItem";
import { GiBroadsword } from "react-icons/gi";
import { render } from "@testing-library/react";
import WikiLink from "../common/WikiLink";
import SectionDivider from "../common/SectionDivider";
var tabs = require("../../data/tables/skillTabs.json");
var skillItems = require("../../data/tables/skills.json");

function SkillsPage() {
  const { realm, gamesPlayed, skills, selectSkill, removeSkill } =
    useFormContext();
  const [skillXp, setSkillXp] = useState(0);

  const totalXp = 8 + parseInt(gamesPlayed ? gamesPlayed : 0);
  const remainingXp =
    totalXp - skills.map((s) => s.cost).reduce((a, b) => a + b, 0);

  const handleSelectSkill = (skill) => {
    if (skills?.map((s) => s.name).includes(skill.name)) {
      return;
    }
    selectSkill(skill);
  };

  const handleRemoveSkill = (skill) => {
    removeSkill(skill);
  };

  const renderedTabs = tabs.map((tab) => {
    const renderedSkills = skillItems
      .filter((skill) => skill.tree === tab.label)
      .map((skill) => {
        return (
          <SkillItem
            skill={{ name: skill.name, cost: skill.costInit }}
            selectSkill={handleSelectSkill}
            selected={skills?.map((s) => s.name).includes(skill.name)}
            inactive={skill.costInit > remainingXp}
          ></SkillItem>
        );
      });

    const link = "play-guide:the-system:character-creation:" + tab.link;

    return { label: tab.label, content: renderedSkills, link: link };
  });

  const renderedSkills = skills?.map((skill) => {
    return (
      <div key={skill.name + skill.cost}>
        <SkillItem
          skill={{ name: skill.name, cost: skill.cost }}
          selectSkill={handleRemoveSkill}
          shadow={true}
        ></SkillItem>
      </div>
    );
  });

  return (
    <div>
      <div className="flex justify-around">
        <ContentPane background={realm ? realm.image : null}>
          <div className="text-left">
            <SectionDivider text="REMAINING XP" number={remainingXp} />
            <br />
          </div>
          <div className="flex flex-wrap justify-center">{renderedSkills}</div>
        </ContentPane>
        <ContentPane>
          <Accordion items={renderedTabs}></Accordion>
        </ContentPane>
      </div>
    </div>
  );
}

export default SkillsPage;

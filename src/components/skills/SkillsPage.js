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
  const {
    realm,
    gamesPlayed,
    skills,
    toggleSkill,
    validSkillChoice,
    remainingXp,
  } = useFormContext();

  // toggles the selection of the skill, then checks validity for all skills
  const handleClickSkill = (skill) => {
    toggleSkill(skill);
  };

  // tabs of the Accordian
  const renderedTabs = tabs.map((tab) => {
    const renderedSkills = skillItems
      .filter((skill) => skill.tree === tab.label)
      .map((skill) => {
        let selected = skills?.map((s) => s.name).includes(skill.name);
        let skillObj = {
          name: skill.name,
          cost: skill.costInit,
          prereq: skill.prereq,
          exclusion: skill.exclusion,
        };
        return (
          <SkillItem
            skill={skillObj}
            selectSkill={handleClickSkill}
            selected={selected}
            inactive={
              !selected &&
              (!validSkillChoice(skillObj) || skillObj.cost > remainingXp)
            }
          ></SkillItem>
        );
      });

    const link = "play-guide:the-system:character-creation:" + tab.link;

    return { label: tab.label, content: renderedSkills, link: link };
  });

  // Chips to render in the left section
  const renderedSkills = skills?.map((skill) => {
    return (
      <div key={skill.name + skill.cost}>
        <SkillItem
          skill={{
            name: skill.name,
            cost: skill.cost,
            prereq: skill.prereq,
            exclusion: skill.exclusion,
          }}
          selectSkill={handleClickSkill}
          shadow
        ></SkillItem>
      </div>
    );
  });

  return (
    <div className="flex sm:flex-row justify-around">
      <ContentPane background={realm ? realm.image : null}>
        <SectionDivider
          left="Remaining XP"
          right={remainingXp}
          className="mb-2"
        />
        {/* <SectionDivider text="SELECTED SKILLS" className="my-2" /> */}
        {renderedSkills?.length > 0 ? (
          <div className="flex flex-wrap justify-center">{renderedSkills}</div>
        ) : (
          <div className="opacity-60 italic px-10">
            Select your skills from the options on the right
          </div>
        )}
      </ContentPane>
      <ContentPane>
        <Accordion items={renderedTabs}></Accordion>
      </ContentPane>
    </div>
  );
}

export default SkillsPage;

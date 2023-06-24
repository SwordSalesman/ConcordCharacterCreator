import Accordion from "../common/Accordion";
import ContentPane from "../common/ContentPane";
import useFormContext from "../../hooks/use-form-context";
import SkillItem from "./SkillItem";
import SectionDivider from "../common/SectionDivider";
import { all } from "axios";
import useRealmDetails from "../../hooks/use-realm-details";
var tabs = require("../../data/tables/skillTabs.json");
var baseSkills = require("../../data/tables/skills.json");

function getNextSkillName(name) {
  let words = name.split(" ");
  let newNum = (Number.parseInt(words.pop()) + 1).toString();
  return words.join(" ") + " " + newNum;
}

function SkillsPage() {
  const { realm, skills, toggleSkill, validSkillChoice, remainingXp } =
    useFormContext();
  const realmFull = useRealmDetails(realm);

  // toggles the selection of the skill, then checks validity for all skills
  const handleClickSkill = (skill) => {
    toggleSkill(skill);
  };

  const extraSkills = skills
    ?.filter((s) => s.costExtra !== undefined)
    .map((s) => {
      return {
        name: getNextSkillName(s.name),
        tree: s.tree,
        cost: s.cost + s.costExtra,
        costExtra: s.costExtra,
        prereq: s.name,
        exclusion: s.exclusion,
      };
    });
  const allSkills = extraSkills ? baseSkills.concat(extraSkills) : baseSkills;

  // tabs of the Accordian
  const renderedTabs = tabs.map((tab) => {
    const renderedSkills = allSkills
      .filter((skill) => skill.tree === tab.label)
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map((skill) => {
        let selected = skills?.map((s) => s.name).includes(skill.name);
        return (
          <SkillItem
            skill={skill}
            selectSkill={handleClickSkill}
            selected={selected}
            inactive={
              !selected &&
              (!validSkillChoice(skill) || skill.cost > remainingXp)
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
          skill={skill}
          selectSkill={handleClickSkill}
          shadow
        ></SkillItem>
      </div>
    );
  });

  return (
    <div className="flex sm:flex-row justify-around">
      <ContentPane background={realmFull ? realmFull.image : null}>
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

import Accordion from "../../../components/common/Accordion/Accordion";
import ContentPane from "../../../components/common/ContentPane/ContentPane";
import useFormContext from "../../../hooks/use-form-context";
import SkillItem from "./SkillItem";
import SectionDivider from "../../../components/common/SectionDivider/SectionDivider";
import { SectionWrapper } from "../../../components/common/SectionDivider/SectionDivider.style";
import { getNextSkill } from "../../../hooks/use-skill-helper";
import { SkillPageWrapper } from "./SkillsPage.style";
var tabs = require("../../../data/tables/skillTabs.json");
var baseSkills = require("../../../data/tables/skills.json");

function SkillsPage() {
    const { skills, toggleSkill, validSkillChoice, remainingXp } =
        useFormContext();

    // toggles the selection of the skill, then checks validity for all skills
    const handleClickSkill = (skill) => {
        toggleSkill(skill);
    };

    const extraSkills = skills
        ?.filter((s) => s.costExtra !== undefined)
        .map((s) => {
            return getNextSkill(s);
        });
    const allSkills = extraSkills ? baseSkills.concat(extraSkills) : baseSkills;

    // tabs of the Accordian
    const renderedTabs = tabs.map((tab, index) => {
        const renderedSkills = allSkills
            .filter((skill) => skill.tree === tab.label)
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((skill) => {
                let selected = skills?.map((s) => s.name).includes(skill.name);
                // let inactiveReason = invalidSkillChoice(skill);
                return (
                    <SkillItem
                        skill={skill}
                        selectSkill={handleClickSkill}
                        selected={selected}
                        inactive={
                            !selected &&
                            (!validSkillChoice(skill) ||
                                skill.cost > remainingXp)
                        }
                        key={skill.name}
                    ></SkillItem>
                );
            });

        return { label: tab.label, content: renderedSkills, link: tab.link };
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
        <SkillPageWrapper>
            <ContentPane style={{ flex: 4 }}>
                <SectionDivider left='Remaining XP' right={remainingXp} />
                {/* <SectionDivider text="SELECTED SKILLS" className="my-2" /> */}
                {renderedSkills?.length > 0 ? (
                    <SectionWrapper>{renderedSkills}</SectionWrapper>
                ) : (
                    <div className='opacity-60 italic px-10'>
                        {"Select your skills from the options here"}
                    </div>
                )}
            </ContentPane>
            <ContentPane style={{ flex: 5 }}>
                <Accordion items={renderedTabs}></Accordion>
            </ContentPane>
        </SkillPageWrapper>
    );
}

export default SkillsPage;

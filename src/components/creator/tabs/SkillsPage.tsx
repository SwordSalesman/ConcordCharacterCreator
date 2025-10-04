import Accordion from "../../common/Accordion/Accordion";
import ContentPane from "../../common/ContentPane/ContentPane";
import useFormContext from "../../../hooks/use-form-context";
import SectionDivider from "../../common/SectionDivider/SectionDivider";
import { SectionWrapper } from "../../common/SectionDivider/SectionDivider.style";
import { getNextSkill } from "../../../hooks/use-skill-helper";
import { xpWarning } from "../../../utils/validity-helper";
import { Warning } from "../../common/Accordion/AccordionSection";
import { Chip } from "@/components/common/Chip/Chip";
var tabs = require("../../../data/tables/skillTabs.json");
var baseSkills = require("../../../data/tables/skills.json");

function SkillItem({ skill, selectSkill, selected, valid, reason, shadow }: any) {
	return (
		<Chip
			onClick={() => selectSkill(skill)}
			selected={selected}
			shadow={shadow}
			inactive={!selected && !valid}
			inactiveReason={reason}
			skillstyle={true}
		>
			<div>{skill.cost}</div>
			<div>{skill.name}</div>
		</Chip>
	);
}

export default function SkillsPage() {
	const { skills, toggleSkill, validSkillChoice, remainingXp } = useFormContext();

	// toggles the selection of the skill, then checks validity for all skills
	const handleClickSkill = (skill: any) => {
		toggleSkill(skill);
	};

	const extraSkills = skills
		?.filter((s: any) => s.costExtra !== undefined)
		.map((s: any) => {
			return getNextSkill(s);
		});
	const allSkills = extraSkills ? baseSkills.concat(extraSkills) : baseSkills;

	// tabs of the Accordian
	const renderedTabs = tabs.map((tab: any, index: number) => {
		const renderedSkills = allSkills
			.filter((skill: any) => skill.tree === tab.label)
			.sort((a: any, b: any) => (a.name > b.name ? 1 : -1))
			.map((skill: any) => {
				let selected = skills?.map((s: any) => s.name).includes(skill.name);
				// let inactiveReason = invalidSkillChoice(skill);
				const { valid, reason } = validSkillChoice(skill, { ignoreCost: true });

				return (
					<SkillItem
						onClick={() => handleClickSkill(skill)}
						skill={skill}
						selected={selected}
						inactive={!selected && !valid}
						inactiveReason={reason}
						skillstyle={true}
					/>
				);
			});

		return { label: tab.label, content: renderedSkills, link: tab.link };
	});

	// Chips to render in the left section
	const renderedSkills = skills?.map((skill: any) => {
		return (
			<div key={skill.name + skill.cost}>
				<SkillItem skill={skill} selectSkill={handleClickSkill} shadow />
			</div>
		);
	});

	const warning = xpWarning(remainingXp);

	return (
		<div className="flex gap-2 sm:flex-col">
			<ContentPane style={{ flex: 4 }}>
				<SectionDivider left="Remaining XP" right={remainingXp} />
				{/* <SectionDivider text="SELECTED SKILLS" className="my-2" /> */}
				{warning && <Warning>{warning}</Warning>}
				{renderedSkills?.length > 0 ? (
					<SectionWrapper>{renderedSkills}</SectionWrapper>
				) : (
					<div className="opacity-60 italic px-10">
						{"Select your skills from the options here"}
					</div>
				)}
			</ContentPane>
			<ContentPane style={{ flex: 5 }}>
				<Accordion items={renderedTabs}></Accordion>
			</ContentPane>
		</div>
	);
}

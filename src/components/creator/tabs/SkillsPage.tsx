import Accordion from "../../common/Accordion/Accordion";
import useFormContext from "../../../hooks/use-form-context";
import SectionDivider from "../SectionDivider/SectionDivider";
import { xpWarning } from "../../../utils/validity-helper";
import { Warning } from "../../common/Accordion/AccordionSection";
import { Chip, ChipSkillWrapper } from "@/components/common/Chip/Chip";
import { getNextSkill, getSkillsData } from "@/utils/data-helper";
import { skills as baseSkills, Skill } from "@/data/tables/skills";
import { useMemo } from "react";
import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import { SectionWrapper } from "../SectionDivider/SectionDivider";

function SkillItem({
	skill,
	selected,
	valid,
	reason,
	shadow,
	onClick,
}: {
	skill: Skill;
	selected?: boolean;
	valid?: boolean;
	reason?: string;
	shadow?: boolean;
	onClick?: () => void;
}) {
	return (
		<Chip
			selected={selected}
			shadow={shadow}
			inactive={!selected && !valid}
			inactiveReason={reason}
			skillstyle={true}
			onClick={onClick}
		>
			<ChipSkillWrapper>{skill.cost}</ChipSkillWrapper>
			<div>{skill.name}</div>
		</Chip>
	);
}

const tabs = [
	{
		label: "Combat",
		link: "Combat_Skills",
	},
	{
		label: "Magic",
		link: "Magic_Skills",
	},
	{
		label: "Crafting",
		link: "Crafting_Skills",
	},
	{
		label: "Religious",
		link: "Religious_Skills",
	},
	{
		label: "Surgical",
		link: "Surgical_Skills",
	},
];

export default function SkillsPage() {
	const { form, toggleItem, validSkillChoice, remaining } = useFormContext();
	const { skills } = form;

	const skillsData = useMemo(() => {
		return getSkillsData(skills);
	}, [skills]);

	const allSkills = useMemo(() => {
		const extraSkills = skillsData
			?.filter((s) => s.costExtra !== undefined)
			.map((s) => {
				return getNextSkill(s);
			});
		return extraSkills ? baseSkills.concat(extraSkills) : baseSkills;
	}, [skills]);

	// toggles the selection of the skill, then checks validity for all skills
	const handleClickSkill = (skill: Skill) => {
		toggleItem("skills", skill.name);
	};

	// tabs of the Accordian (on the right)
	const renderedTabs = tabs.map((tab, index: number) => {
		const renderedSkills = (
			<div className="flex flex-wrap gap-1 p-1">
				{allSkills
					.filter((skill) => skill.tree === tab.label)
					.sort((a, b) => (a.name > b.name ? 1 : -1))
					.map((skill) => {
						let selected = skillsData?.map((s) => s.name).includes(skill.name);
						const { valid, reason } = validSkillChoice(skill.name);

						return (
							<SkillItem
								skill={skill}
								selected={selected}
								valid={valid}
								key={skill.name}
								reason={reason}
								onClick={() => handleClickSkill(skill)}
							/>
						);
					})}
			</div>
		);

		return { label: tab.label, content: renderedSkills, link: tab.link };
	});

	// Chips to render in the left section
	const renderedSkills = (
		<div className="flex flex-wrap gap-1 p-1 justify-center">
			{skillsData?.map((skill) => {
				return (
					<div key={skill.name + skill.cost}>
						<SkillItem
							skill={skill}
							valid={true}
							onClick={() => handleClickSkill(skill)}
							shadow
						/>
					</div>
				);
			})}
		</div>
	);

	const warning = xpWarning(remaining.xp);

	return (
		<div className="flex gap-2 flex-col sm:flex-row w-full">
			<ContentPane style={{ flex: 4 }}>
				<SectionDivider left="Remaining XP" right={String(remaining.xp)} />
				{/* <SectionDivider text="SELECTED SKILLS" className="my-2" /> */}
				{warning && <Warning>{warning}</Warning>}
				{skillsData?.length > 0 ? (
					<SectionWrapper>{renderedSkills}</SectionWrapper>
				) : (
					<div className="opacity-60 italic px-10">
						{"Select your skills from the options here"}
					</div>
				)}
			</ContentPane>
			<ContentPane style={{ flex: 5 }}>
				{/* to do- investigate why the accordions keep shrinking horizontally */}
				<Accordion items={renderedTabs} />
			</ContentPane>
		</div>
	);
}

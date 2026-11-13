import Accordion from "../../common/Accordion/Accordion";
import useFormContext from "../../../hooks/use-form-context";
import { xpWarning } from "../../../utils/validity-helper";
import { Warning } from "../../common/Warning";
import { Chip, ChipSkillWrapper } from "@/components/common/Chip/Chip";
import { Skill } from "@/data/tables/skills";
import { useMemo } from "react";
import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import { SectionDivider, SectionWrapper } from "../../creator/SectionDivider/SectionDivider";

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
			inactive={!valid}
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
	const { toggleItem, remaining, maximum, choices } = useFormContext();
	const selectedSkills = useMemo(
		() => choices.skills.filter((choice) => choice.selected),
		[choices.skills],
	);

	// toggles the selection of the skill, then checks validity for all skills
	const handleClickSkill = (skill: Skill) => {
		toggleItem("skills", skill.name);
	};

	// tabs of the Accordion (on the right)
	const renderedTabs = tabs.map((tab, index: number) => {
		const renderedSkills = (
			<div className="flex flex-wrap gap-1 p-1">
				{choices.skills
					.filter((choice) => choice.value.tree === tab.label)
					.sort((a, b) => (a.value.name > b.value.name ? 1 : -1))
					.map((choice) => {
						const skill = choice.value;

						return (
							<SkillItem
								skill={skill}
								selected={choice.selected}
								valid={choice.selected ? choice.canRemove : choice.canSelect}
								key={skill.name}
								reason={
									choice.selected ? choice.removeReason : choice.selectReason
								}
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
			{selectedSkills.map((choice) => {
				const skill = choice.value;
				return (
					<div key={skill.name + skill.cost}>
						<SkillItem
							skill={skill}
							selected
							valid={choice.canRemove}
							reason={choice.removeReason}
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
			<ContentPane className="flex-4">
				<SectionDivider>
					Selected Skills
					<span
						className={`duration-150 ${remaining.xp === 0 ? "opacity-50" : remaining.xp < 0 ? "text-destructive" : ""}`}
					>
						{` (${maximum.xp - remaining.xp}/${maximum.xp} Experience)`}
					</span>
				</SectionDivider>
				{warning && <Warning>{warning}</Warning>}
				{selectedSkills.length > 0 ? (
					<SectionWrapper>{renderedSkills}</SectionWrapper>
				) : (
					<div className="opacity-60 italic px-6">
						Select your skills from the options{" "}
						<span className="hidden sm:inline">on the right</span>
						<span className="inline sm:hidden">below</span>
					</div>
				)}
			</ContentPane>
			<ContentPane className="flex-5">
				<Accordion items={renderedTabs} />
			</ContentPane>
		</div>
	);
}

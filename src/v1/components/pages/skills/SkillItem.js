import Chip from "../../common/Chip/Chip";
import { SkillCost } from "../../common/Chip/Chip.styled";

function SkillItem({ skill, selectSkill, selected, shadow, inactive, inactiveReason }) {
	const handleClick = () => {
		selectSkill(skill);
	};

	return (
		<Chip
			onClick={handleClick}
			selected={selected}
			shadow={shadow}
			inactive={inactive}
			inactiveReason={inactiveReason}
			skillstyle="true"
		>
			<SkillCost>{skill.cost}</SkillCost>
			<div>{skill.name}</div>
		</Chip>
	);
}

export default SkillItem;

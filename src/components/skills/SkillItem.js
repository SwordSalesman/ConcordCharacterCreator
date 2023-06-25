import classNames from "classnames";
import Chip from "../common/Chip/Chip";
import { SkillCost } from "../common/Chip/Chip.styled";

function SkillItem({ skill, selectSkill, selected, shadow, inactive }) {
  const handleClick = () => {
    selectSkill(skill);
  };

  return (
    <Chip
      onClick={handleClick}
      selected={selected}
      shadow={shadow}
      inactive={inactive}
    >
      <SkillCost>{skill.cost}</SkillCost>
      <div>{skill.name}</div>
    </Chip>
  );
}

export default SkillItem;

import classNames from "classnames";
import Chip from "../common/Chip";

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
      <div className="font-sans text-sm">{skill.cost}</div>
      <div className="ml-1 px-1 border-l border-gray-300">{skill.name}</div>
    </Chip>
  );
}

export default SkillItem;

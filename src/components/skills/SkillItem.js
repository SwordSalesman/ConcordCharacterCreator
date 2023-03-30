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
      {skill.cost}
      <div className="mx-[5px] my-1 border-r-2 border-gray-300"></div>
      <p>{skill.name}</p>
    </Chip>
  );
}

export default SkillItem;

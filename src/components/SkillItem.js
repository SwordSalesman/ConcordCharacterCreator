function SkillItem({ skill }) {
  const icon = (
    <div
      className="rounded-full border text-2xl 
        h-8 w-8 p-1 bg-gray-100
        z-10
        cursor-pointer"
    >
      {skill.icon}
    </div>
  );

  return (
    <div className="">
      <div
        className="px-[5px] m-1 h-6 w-fit
        border rounded-lg
        text-sm flex flex-row
        bg-gray-100 hover:bg-gray-200
        cursor-pointer
        whitespace-nowrap"
      >
        {skill.cost}
        <div className="mx-[5px] my-1 border-r"></div>
        <p>{skill.name}</p>
      </div>
    </div>
  );
}

export default SkillItem;

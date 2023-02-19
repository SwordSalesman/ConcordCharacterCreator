import classNames from "classnames";

function TabItem({ name, onTabSelect, active }) {
  const classes = classNames(
    "transition duration-200",
    "px-1 w-32 text-center m-1",
    "cursor-pointer",
    "bg-white text-black",
    {
      "border-red-600 border-b-2 text-red-600": active,
    }
  );

  const handleClick = () => {
    onTabSelect(name);
  };

  return (
    <div className={classes} onClick={handleClick}>
      {name}
    </div>
  );
}

export default TabItem;

import classNames from "classnames";

function RealmItem({ realm, onSelect, selectedRealm }) {
  const handleClick = () => {
    onSelect(realm);
  };

  const classes = classNames(
    "w-24 h-24 m-2 mx-1",
    "mix-blend-multiply",
    "hover:scale-125",
    "transition duration-200",
    {
      "opacity-50 blur-sm": selectedRealm !== null && realm !== selectedRealm,
      "blur-none scale-125 hover:scale-125": realm === selectedRealm,
    }
  );

  return (
    <div onClick={handleClick} className={classes}>
      <img className="cursor-pointer" alt={realm.name} src={realm.src}></img>
    </div>
  );
}

export default RealmItem;

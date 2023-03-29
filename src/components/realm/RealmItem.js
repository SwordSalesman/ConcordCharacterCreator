import classNames from "classnames";

function RealmItem({ realm, onSelect, selectedRealm }) {
  const handleClick = () => {
    onSelect(realm);
  };

  const classes = classNames(
    "w-24 h-24 m-2 mx-1",
    "mix-blend-multiply",
    "hover:scale-[1.15]",
    "transition duration-200",
    {
      "opacity-50 blur-[2px]":
        selectedRealm !== null && realm.name !== selectedRealm.name,
      "blur-none hover:scale-[1.15] scale-[1.15]":
        selectedRealm !== null && realm.name === selectedRealm.name,
    }
  );

  return (
    <div onClick={handleClick} className={classes}>
      <img className="cursor-pointer" alt={realm.name} src={realm.image}></img>
    </div>
  );
}

export default RealmItem;

import classNames from "classnames";
import { ThemeProvider, useTheme } from "styled-components";

function RealmItem({ realm, onSelect, selectedRealm }) {
  const handleClick = () => {
    onSelect(realm);
  };

  const classes = classNames(
    "w-24 h-24 m-2 mx-1",
    "hover:scale-[1.15]",
    "transition duration-200",
    {
      "opacity-50 blur-[2px]":
        selectedRealm && realm.name !== selectedRealm?.name,
      "blur-none hover:scale-[1.15] scale-[1.15]":
        selectedRealm && realm.name === selectedRealm?.name,
    }
  );

  return (
    <div onClick={handleClick} className={classes}>
      <img
        className="cursor-pointer"
        alt={realm.name}
        src={useTheme().name === "light" ? realm.image : realm.imageInv}
      ></img>
    </div>
  );
}

export default RealmItem;

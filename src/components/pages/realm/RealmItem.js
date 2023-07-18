import classNames from "classnames";
import { ThemeProvider, useTheme } from "styled-components";
import { StyledRealmItem } from "./StyledRealmItem";

function RealmItem({ realm, onSelect, selectedRealm }) {
    const handleClick = () => {
        onSelect(realm);
    };

    const active = selectedRealm?.name === realm.name;

    return (
        <StyledRealmItem
            onClick={handleClick}
            active={active}
            selection={selectedRealm}
        >
            <img
                className='cursor-pointer'
                alt={realm.name}
                src={useTheme().name === "light" ? realm.image : realm.imageInv}
            ></img>
        </StyledRealmItem>
    );
}

export default RealmItem;

import { useTheme } from "styled-components";
import { StyledRealmItem } from "./RealmItem.style";
import React from "react";

function RealmItem({ realm, onSelect, selectedRealm }) {
    const theme = useTheme();

    const handleClick = () => {
        onSelect(realm);
    };

    const active = selectedRealm?.name === realm.name;

    return (
        <StyledRealmItem
            onClick={handleClick}
            active={active}
            selection={selectedRealm}
            themeName={theme.name}
        >
            <img alt={realm.name} src={realm.image}></img>
        </StyledRealmItem>
    );
}

export default RealmItem;

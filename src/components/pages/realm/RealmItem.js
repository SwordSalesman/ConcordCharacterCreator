import { StyledRealmItem } from "./RealmItem.style";

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
                src={realm.image}
            ></img>
        </StyledRealmItem>
    );
}

export default RealmItem;

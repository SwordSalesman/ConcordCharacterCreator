import { StyledTabItem } from "./TabItem.style";

function TabItem({ tab, onTabSelect, active }) {
    const handleClick = () => {
        onTabSelect(tab);
    };

    return (
        <StyledTabItem onClick={handleClick} primary={active}>
            {tab.name}
        </StyledTabItem>
    );
}

export default TabItem;

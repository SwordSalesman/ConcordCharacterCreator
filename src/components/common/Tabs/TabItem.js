import { StyledTabItem } from "./TabItem.style";

function TabItem({ tab, index, onTabSelect, active }) {
    const handleClick = () => {
        onTabSelect(tab, index);
    };

    return (
        <StyledTabItem onClick={handleClick} primary={active}>
            {tab.name}
        </StyledTabItem>
    );
}

export default TabItem;

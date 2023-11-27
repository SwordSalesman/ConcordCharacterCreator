import { BiChevronDown } from "react-icons/bi";
import styled from "styled-components";
import Button from "../common/Button/Button";
import { APPROVED, DENIED, PENDING } from "../../helpers/constants";

function ListFilter({ dateOrder, toggleDateOrder, filter, selectFilter }) {
    return (
        <ListFilterWrapper>
            <DateOrderer onClick={toggleDateOrder}>
                <p>Date</p>
                <DateChevron flip={!dateOrder}>
                    <BiChevronDown size={20} />
                </DateChevron>
            </DateOrderer>
            <StatusFilter>
                <Button
                    primary={filter === PENDING}
                    secondary={true}
                    onClick={() => selectFilter(PENDING)}
                >
                    👀
                </Button>
                <Button
                    primary={filter === APPROVED}
                    secondary={true}
                    onClick={() => selectFilter(APPROVED)}
                >
                    👍
                </Button>
                <Button
                    primary={filter === DENIED}
                    secondary={true}
                    onClick={() => selectFilter(DENIED)}
                >
                    👎
                </Button>
            </StatusFilter>
        </ListFilterWrapper>
    );
}

export default ListFilter;

const ListFilterWrapper = styled.div`
    padding: 6px 10px;
    border-bottom: 1px solid ${(props) => props.theme.border};

    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 6;
    background-color: ${(props) => props.theme.backgroundRaised};
`;

const DateOrderer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;

    cursor: pointer;
`;

const DateChevron = styled.div`
    transition-duration: 0.3s;
    transform: rotate(${(props) => (props.flip ? "180deg" : "0deg")});
`;

const StatusFilter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9em;
`;

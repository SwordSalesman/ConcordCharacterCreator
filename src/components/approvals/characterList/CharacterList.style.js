import styled from "styled-components";

export const CharacterListWrapper = styled.ul`
    overflow-y: scroll;
`;

export const ListItem = styled.li`
    padding: 8px;
    border-bottom: 1px solid ${(props) => props.theme.border};
    background-color: ${(props) => props.theme.background};
    cursor: pointer;

    line-height: 1em;
    font-size: 0.9em;

    &:hover {
        /* background-color: ${(props) => props.theme.backgroundRaised}; */
        filter: brightness(
            ${(props) => (props.theme.name === "light" ? "0.95" : "1.1")}
        );
    }

    overflow: hidden;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    position: relative;
`;

export const ListItemTitle = styled.div`
    position: relative;
    word-break: break-all;
    overflow: hidden;
    height: 1em;
`;

export const TitleGradient = styled.div`
    height: 100%;
    width: 80px;
    position: absolute;
    right: 0;
    z-index: 2;
    background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0) 0%,
        ${(props) => props.theme.background} 50%
    );
`;

export const ListItemRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 0.8em;
    font-style: italic;
`;

export const ApprovalStatus = styled.div`
    position: absolute;
    font-size: 0.8em;
    top: 7px;
    right: 8px;
    z-index: 4;
`;

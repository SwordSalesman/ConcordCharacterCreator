import { BiCoinStack, BiUser } from "react-icons/bi";
import { ImQuill } from "react-icons/im";
import styled from "styled-components";

function CharacterCard({ character }) {
    return character ? (
        <CharacterCardWrapper>
            <CharTitle>{character.heroName}</CharTitle>
            <p>Played by {character.player}</p>
            <br />
            <CharSectionTitle>
                <BiUser />
                Identifiers
            </CharSectionTitle>
            <p>Realm: {character.realm}</p>
            {character.archetype ? (
                <p>Archetype: {character.archetype}</p>
            ) : null}
            {character.grace ? <p>Grace: {character.grace}</p> : null}
            <br />
            <CharSectionTitle>
                <ImQuill />
                Backstory
            </CharSectionTitle>
            <p>{character.backstory ?? <i>No backstory given</i>}</p>
            <br />
            <CharSectionTitle>
                <BiCoinStack />
                Investment
            </CharSectionTitle>
            <i>
                {character.invOption ? character.invOption + " " : null}
                {character.investment} in {character.invTerritory},{" "}
                {character.invRegion}
            </i>
            <p>{character.invDetails ?? <i>No description given</i>}</p>
        </CharacterCardWrapper>
    ) : (
        <BlankWrapper>
            Select a submission on the side to get started
        </BlankWrapper>
    );
}

export default CharacterCard;

const BlankWrapper = styled.div`
    font-style: italic;
    opacity: 0.7;
    margin: auto;
    margin-top: 100px;
`;

const CharacterCardWrapper = styled.div`
    font-size: 0.9em;
    padding: 10px;
    overflow-y: scroll;
    padding-bottom: 20px;
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const CharTitle = styled.h1`
    font-size: 1.5em;
    font-style: bold;
    font-family: Georgia, "Times New Roman", Times, serif;
`;

export const CharSectionTitle = styled.h2`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    font-size: 1.1em;
`;

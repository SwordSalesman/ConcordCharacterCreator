import { BiSolidCastle } from "react-icons/bi";
import { FaIdBadge } from "react-icons/fa";
import { RiSwordFill, RiTodoFill } from "react-icons/ri";

import { ImQuill } from "react-icons/im";
import styled from "styled-components";
import { GiScrollUnfurled, GiSpellBook } from "react-icons/gi";
import toast from "react-hot-toast";

function CharacterCard({ character }) {
    const skills = character?.skills?.split(", ");

    function copyText(text) {
        navigator.clipboard.writeText(text);
        toast.success(`Copied '${text}' to clipboard`);
    }

    return character ? (
        <CharacterCardWrapper>
            <CharTitle>{character.heroName}</CharTitle>
            <NameAndEmail>
                <p>Played by {character.player} </p>
                <EmailLink onClick={() => copyText(character.email)}>
                    <u>({character.email})</u>
                </EmailLink>
            </NameAndEmail>
            <CharSectionTitle>
                <FaIdBadge />
                Identifiers
            </CharSectionTitle>
            <li>Summits Attended: {character.gamesPlayed}</li>
            <li>Realm: {character.realm}</li>
            {character.archetype ? (
                <li>Archetype: {character.archetype}</li>
            ) : null}
            {character.warband ? <li>Band: {character.warband}</li> : null}
            {character.sect ? <li>Sect: {character.sect}</li> : null}
            {character.grace ? <p>Grace: {character.grace}</p> : null}
            <CharSectionTitle>
                <RiSwordFill />
                Skills
            </CharSectionTitle>
            {skills?.length > 0 ? (
                skills.map((s) => {
                    return <li>{s}</li>;
                })
            ) : (
                <i>No skills</i>
            )}
            <CharSectionTitle>
                <GiSpellBook />
                Options
            </CharSectionTitle>
            {character.spells ||
            character.crafts ||
            character.potions ||
            character.ceremonies ? (
                <>
                    {character.spells ? (
                        <li>Spells: {character.spells}</li>
                    ) : null}
                    {character.crafts ? (
                        <li>Crafts: {character.crafts}</li>
                    ) : null}
                    {character.potions ? (
                        <li>Potions: {character.potions}</li>
                    ) : null}
                    {character.ceremonies ? (
                        <li>Ceremonies: {character.ceremonies}</li>
                    ) : null}
                </>
            ) : (
                <i>No options selected</i>
            )}
            <CharSectionTitle>
                <ImQuill />
                Backstory
            </CharSectionTitle>
            <p>{character.backstory ?? <i>No backstory given</i>}</p>
            <CharSectionTitle>
                <BiSolidCastle />
                Investment
            </CharSectionTitle>
            <i>
                {character.invOption ? character.invOption + " " : null}
                {character.investment} in {character.invTerritory},{" "}
                {character.invRegion}
            </i>
            <p>{character.invDetails ?? <i>No description given</i>}</p>
            <CharSectionTitle>
                <GiScrollUnfurled />
                In Character Goals
            </CharSectionTitle>
            <p>{character.icGoals ?? <i>No in character goals given</i>}</p>
            <CharSectionTitle>
                <RiTodoFill />
                Out of Character Goals
            </CharSectionTitle>
            <p>
                {character.oocGoals ?? <i>No out of character goals given</i>}
            </p>
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
    padding-bottom: 34px;
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const CharTitle = styled.h1`
    font-size: 1.5em;
    line-height: 1.2em;
    font-style: bold;
    font-family: Georgia, "Times New Roman", Times, serif;
`;

export const CharSectionTitle = styled.h2`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    font-size: 1.1em;
    margin-top: 1.1em;
`;

export const NameAndEmail = styled.div`
    font-size: 1.05em;
    display: flex;
    flex-direction: row;
    gap: 6px;
`;

export const EmailLink = styled.div`
    cursor: pointer;
    font-style: italic;
`;

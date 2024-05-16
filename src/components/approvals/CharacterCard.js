import { BiSolidCastle } from "react-icons/bi";
import { FaIdBadge } from "react-icons/fa";
import { RiSwordFill, RiTodoFill } from "react-icons/ri";

import { ImQuill } from "react-icons/im";
import styled from "styled-components";
import { GiScrollUnfurled, GiSpellBook } from "react-icons/gi";
import toast from "react-hot-toast";

function CharacterCard({ character }) {
	const skills = character?.skills?.split(", ");
	const changes = character?.changes?.split(", ");
	const hasReview = !!character?.approval?.date;

	function copyText(text) {
		navigator.clipboard.writeText(text);
		toast.success(`Copied '${text}' to clipboard`);
	}

	function changed(fieldName) {
		return hasReview && changes && changes?.includes(fieldName);
	}

	return character ? (
		<CharacterCardWrapper>
			<ChangeWrapper changed={changed("heroName")}>
				<CharTitle>{character.heroName}</CharTitle>
			</ChangeWrapper>
			<NameAndEmail>
				<p>Played by {character.player} </p>
				<EmailLink onClick={() => copyText(character.email)}>
					<u>({character.email})</u>
				</EmailLink>
			</NameAndEmail>
			{/*  */}
			<CharSectionTitle>
				<FaIdBadge />
				Identifiers
			</CharSectionTitle>
			<ChangeWrapper changed={changed("gamesPlayed")} key={"gamesPlayed"}>
				<li key="games">Summits Attended: {character.gamesPlayed}</li>
			</ChangeWrapper>
			<ChangeWrapper changed={changed("realm")} key={"realm"}>
				<li key="realm">Realm: {character.realm}</li>
			</ChangeWrapper>
			<ChangeWrapper changed={changed("archetype")} key={"archetype"}>
				{character.archetype ? <li>Archetype: {character.archetype}</li> : null}
			</ChangeWrapper>
			<ChangeWrapper changed={changed("warband")} key={"warband"}>
				{character.warband ? <li>Band: {character.warband}</li> : null}
			</ChangeWrapper>
			<ChangeWrapper changed={changed("sect")} key={"sect"}>
				{character.sect ? <li>Sect: {character.sect}</li> : null}
			</ChangeWrapper>
			<ChangeWrapper changed={changed("grace")} key={"grace"}>
				{character.grace ? <p>Grace: {character.grace}</p> : null}
			</ChangeWrapper>
			{/*  */}
			<ChangeWrapper changed={changed("skills")} key={"skills"}>
				<CharSectionTitle>
					<RiSwordFill />
					Skills
				</CharSectionTitle>
			</ChangeWrapper>
			{skills?.length > 0 ? (
				skills.map((s) => {
					return <li key={s}>{s}</li>;
				})
			) : (
				<i>No skills</i>
			)}
			{/*  */}
			<CharSectionTitle>
				<GiSpellBook />
				Options
			</CharSectionTitle>
			{character.spells || character.crafts || character.potions || character.ceremonies ? (
				<>
					<ChangeWrapper changed={changed("spells")} key={"spells"}>
						{character.spells ? <li>Spells: {character.spells}</li> : null}
					</ChangeWrapper>
					<ChangeWrapper changed={changed("crafts")} key={"crafts"}>
						{character.crafts ? <li>Crafts: {character.crafts}</li> : null}
					</ChangeWrapper>
					<ChangeWrapper changed={changed("potions")} key={"potions"}>
						{character.potions ? <li>Potions: {character.potions}</li> : null}
					</ChangeWrapper>
					<ChangeWrapper changed={changed("ceremonies")} key={"ceremonies"}>
						{character.ceremonies ? <li>Ceremonies: {character.ceremonies}</li> : null}
					</ChangeWrapper>
				</>
			) : (
				<i>No options selected</i>
			)}
			{/*  */}
			<ChangeWrapper changed={changed("backstory")} key={"backstory"}>
				<CharSectionTitle>
					<ImQuill />
					Backstory
				</CharSectionTitle>
			</ChangeWrapper>
			<p>{character.backstory ?? <i>No backstory given</i>}</p>

			<ChangeWrapper
				changed={
					changed("invTier") ||
					changed("invOption") ||
					changed("investment") ||
					changed("invTerritory") ||
					changed("invRegion") ||
					changed("invDetails")
				}
				key={"investment"}
			>
				<CharSectionTitle>
					<BiSolidCastle />
					Investment
				</CharSectionTitle>
			</ChangeWrapper>
			<i>
				{character.invTier ? "Tier " + character.invTier + " " : null}
				{character.invOption ? character.invOption + " " : null}
				{character.investment} in {character.invTerritory}, {character.invRegion}
			</i>
			<p>{character.invDetails ?? <i>No description given</i>}</p>

			<ChangeWrapper changed={changed("icGoals")} key={"icGoals"}>
				<CharSectionTitle>
					<GiScrollUnfurled />
					In Character Goals
				</CharSectionTitle>
			</ChangeWrapper>
			<p>{character.icGoals ?? <i>No in character goals given</i>}</p>

			<ChangeWrapper changed={changed("oocGoals")} key={"oocGoals"}>
				<CharSectionTitle>
					<RiTodoFill />
					Out of Character Goals
				</CharSectionTitle>
			</ChangeWrapper>
			<p>{character.oocGoals ?? <i>No out of character goals given</i>}</p>
		</CharacterCardWrapper>
	) : (
		<BlankWrapper>Select a submission on the side to get started</BlankWrapper>
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

const ChangeWrapper = styled.div`
	background: ${(props) =>
		props.changed
			? `linear-gradient(90deg, ${props.theme.special}35 0%, rgba(0,0,0,0) 90%)`
			: "none"};
	border-radius: 5px;
	padding-left: ${(props) => (props.changed ? "4px" : 0)};
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

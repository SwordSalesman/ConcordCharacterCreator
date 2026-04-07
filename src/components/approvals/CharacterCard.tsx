import { BiSolidCastle } from "react-icons/bi";
import { FaIdBadge } from "react-icons/fa";
import { RiMessage2Fill, RiSwordFill, RiTodoFill } from "react-icons/ri";
import { ImQuill } from "react-icons/im";
import { GiScrollUnfurled, GiSpellBook } from "react-icons/gi";
import toast from "react-hot-toast";
import { prettifyDate } from "../../utils/date-helper";
import { getArrayFromSummary, getSkillData, stringToNode } from "../../utils/data-helper";
import { Character } from "./types";
import { cn } from "@/lib/utils";

function CharacterCard({ character }: { character: Character | null }) {
	const skills = character?.skills?.split(", ");
	const changes = character?.changes?.split(", ");
	const hasReview = !!character?.approval?.date;

	const skillsFull = getArrayFromSummary(character?.skills ?? "").map((s) => getSkillData(s));
	const totalXp = 8 + parseInt(String(character?.gamesPlayed ?? 0));
	const spentXp = skillsFull ? skillsFull.map((s) => s?.cost ?? 0).reduce((a, b) => a + b, 0) : 0;

	function copyText(text: string) {
		navigator.clipboard.writeText(text);
		toast.success(`Copied '${text}' to clipboard`);
	}

	function changed(fieldName: keyof Character): boolean {
		return !!(hasReview && changes && changes.includes(fieldName));
	}

	function changeWrapperClass(isChanged: boolean) {
		return cn(
			"rounded-[5px]",
			isChanged ? "bg-gradient-to-r from-special/25 from-50% to-transparent" : "",
		);
	}

	if (!character) {
		return (
			<i className="italic opacity-70 mx-auto mt-[100px]">
				Select a submission on the side to get started
			</i>
		);
	}

	return (
		<div className="text-sm p-2 overflow-y-scroll pb-16 h-[100%] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
			<div className={changeWrapperClass(changed("heroName"))}>
				<h1 className="text-2xl leading-[1.2em] font-[Georgia,'Times_New_Roman',Times,serif]">
					{character.heroName}
				</h1>
			</div>
			<div className="text-[1.05em] flex flex-row gap-1.5">
				<p>Played by {character.player} </p>
				<div className="cursor-pointer italic" onClick={() => copyText(character.email)}>
					<u>({character.email})</u>
				</div>
			</div>
			<i className="opacity-75">
				Submitted on {prettifyDate(character.date)}
				<br />
				Database ID {character.id}
			</i>
			{/*  */}
			<div className={changeWrapperClass(changed("comments"))}>
				<CharSectionTitle>
					<RiMessage2Fill />
					Message to Approver
				</CharSectionTitle>
			</div>
			<i>
				{character.comments ? character.comments : <i className="opacity-75">No message</i>}
			</i>
			{/*  */}
			<CharSectionTitle>
				<FaIdBadge />
				Identifiers
			</CharSectionTitle>
			<div className={changeWrapperClass(changed("gamesPlayed"))}>
				<li key="games">Summits Attended: {character.gamesPlayed}</li>
			</div>
			<div className={changeWrapperClass(changed("realm"))}>
				<li key="realm">Realm: {character.realm}</li>
			</div>
			<div className={changeWrapperClass(changed("archetype"))}>
				{character.archetype || changed("archetype") ? (
					<li>Archetype: {character.archetype !== "" ? character.archetype : "None"}</li>
				) : null}
			</div>
			<div className={changeWrapperClass(changed("warband"))}>
				{character.warband || changed("warband") ? (
					<li>Band: {character.warband !== "" ? character.warband : "None"}</li>
				) : null}
			</div>
			<div className={changeWrapperClass(changed("sect"))}>
				{character.sect || changed("sect") ? (
					<li>Sect: {character.sect !== "" ? character.sect : "None"}</li>
				) : null}
			</div>
			<div className={changeWrapperClass(changed("grace"))}>
				{character.grace || changed("grace") ? (
					<li>Grace: {character.grace !== "" ? character.grace : "None"}</li>
				) : null}
			</div>
			{/*  */}
			<div className={changeWrapperClass(changed("skills"))}>
				<CharSectionTitle>
					<RiSwordFill />
					Skills
					<i
						className={cn(
							"text-[0.8em] font-light",
							spentXp > totalXp ? "text-destructive" : "",
						)}
					>
						(Spent {spentXp} of {totalXp} XP)
					</i>
				</CharSectionTitle>
			</div>
			{skills && skills.length > 0 ? (
				skills.map((s) => <li key={s}>{s}</li>)
			) : (
				<i className="opacity-75">No skills</i>
			)}
			{/*  */}
			<CharSectionTitle>
				<GiSpellBook />
				Options
			</CharSectionTitle>
			{character.spells || character.crafts || character.potions || character.ceremonies ? (
				<>
					<div className={changeWrapperClass(changed("spells"))}>
						{character.spells ? <li>Spells: {character.spells}</li> : null}
					</div>
					<div className={changeWrapperClass(changed("crafts"))}>
						{character.crafts ? <li>Crafts: {character.crafts}</li> : null}
					</div>
					<div className={changeWrapperClass(changed("startingItem"))}>
						{character.startingItem ? (
							<li>Starting Item: {character.startingItem}</li>
						) : null}
					</div>
					<div className={changeWrapperClass(changed("potions"))}>
						{character.potions ? <li>Potions: {character.potions}</li> : null}
					</div>
					<div className={changeWrapperClass(changed("ceremonies"))}>
						{character.ceremonies ? <li>Ceremonies: {character.ceremonies}</li> : null}
					</div>
				</>
			) : (
				<i className="opacity-75">No options selected</i>
			)}
			{/*  */}
			<div className={changeWrapperClass(changed("backstory"))}>
				<CharSectionTitle>
					<ImQuill />
					Backstory
				</CharSectionTitle>
			</div>
			<p>
				{character.backstory ? (
					stringToNode(character.backstory)
				) : (
					<i className="opacity-75">No backstory given</i>
				)}
			</p>
			{/*  */}
			<CharSectionTitle>
				<BiSolidCastle />
				Investment
			</CharSectionTitle>
			<div>
				<i className={changeWrapperClass(changed("invTier"))}>
					{character.invTier ? `Tier ${character.invTier} ` : " "}
				</i>
				<i className={changeWrapperClass(changed("invOption"))}>
					{character.invOption ? `${character.invOption} ` : ""}
				</i>
				<i
					className={changeWrapperClass(changed("investment"))}
				>{`${character.investment} `}</i>
				in{" "}
				<i className={changeWrapperClass(changed("invTerritory"))}>
					{`${character.invTerritory}, `}
				</i>
				<i
					className={changeWrapperClass(changed("invRegion"))}
				>{`${character.invRegion} `}</i>
				<i className={changeWrapperClass(changed("invDiversify"))}>
					{character.invDiversify ? (
						<>
							<br />
							{`Diversified in ${character.invDiversify} `}
						</>
					) : (
						" "
					)}
				</i>
			</div>
			<div className={changeWrapperClass(changed("invDetails"))}>
				<p>
					{character.invDetails ? (
						stringToNode(character.invDetails)
					) : (
						<i className="opacity-75">No description given</i>
					)}
				</p>
			</div>

			<div className={changeWrapperClass(changed("icGoals"))}>
				<CharSectionTitle>
					<GiScrollUnfurled />
					In Character Goals
				</CharSectionTitle>
			</div>
			<p>
				{character.icGoals ? (
					stringToNode(character.icGoals)
				) : (
					<i className="opacity-75">No in character goals given</i>
				)}
			</p>

			<div className={changeWrapperClass(changed("oocGoals"))}>
				<CharSectionTitle>
					<RiTodoFill />
					Out of Character Goals
				</CharSectionTitle>
			</div>
			<p>
				{character.oocGoals ? (
					stringToNode(character.oocGoals)
				) : (
					<i className="opacity-75">No out of character goals given</i>
				)}
			</p>
		</div>
	);
}

export default CharacterCard;

export function CharSectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="flex flex-row items-center gap-1.5 font-semibold text-[1.1em] mt-[1.1em]">
			{children}
		</h2>
	);
}

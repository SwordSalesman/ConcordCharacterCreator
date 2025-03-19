import { useEffect, useState } from "react";
import { getCharacterList, getApprovalList } from "../../hooks/use-firebase";
import {
	ApprovalListWrapper,
	ApprovalSelectWrapper,
	ApprovalsWrapper,
	ExportContents,
	LeftColumn,
} from "./Approvals.style";
import useUserContext from "../../hooks/use-user-context";
import { Navigate } from "react-router-dom";
import { APPROVED, DENIED, PATH_HOME, PENDING } from "../../helpers/constants";
import CharacterList from "./characterList/CharacterList";
import ListFilter from "./ListFilter";
import CharacterCard from "./CharacterCard";
import ApprovalPanel from "./ApprovalPanel";
import Button from "../common/Button/Button";
import { BiExport } from "react-icons/bi";
import { CSVLink } from "react-csv";
import { getCurrentDate } from "../../helpers/date-helper";
import { handleMigrateInvestments } from "../../helpers/migration-helper";

function removeAllNewlines(input) {
	if (!input) return "";
	// also replace all forms of double quotes with single quotes
	return input.replace(/(?:\r\n|\r|\n)/g, ". ").replace(/"/g, "'");
}

function Approvals() {
	const [characters, setCharacters] = useState([]);
	const [selectedChar, setSelectedChar] = useState(null);
	const [filter, setFilter] = useState(PENDING);
	const [dateOrder, setDateOrder] = useState(true);
	const { isAdmin } = useUserContext();
	const [counts, setCounts] = useState({
		pending: 0,
		approved: 0,
		denied: 0,
		total: 0,
	});
	const isDev = process.env.REACT_APP_DEBUG_TEXT === "DevMode";

	useEffect(() => {
		async function fetchCharacters() {
			const chars = await getCharacterList();
			const apprs = await getApprovalList();

			if (chars && apprs) {
				let newChars = chars.map((c) => {
					const approval = apprs.find((a) => a.id === c.id);
					return {
						...c,
						backstory: removeAllNewlines(c.backstory),
						oocGoals: removeAllNewlines(c.oocGoals),
						icGoals: removeAllNewlines(c.icGoals),
						invDetails: removeAllNewlines(c.invDetails),
						comments: removeAllNewlines(c.comments),
						heroName: removeAllNewlines(c.heroName),
						player: removeAllNewlines(c.player),
						approval: approval
							? {
									...approval,
									comment: removeAllNewlines(approval?.comment),
							  }
							: undefined,
					};
				});
				setCharacters(newChars);
				calcCounts(newChars);
			}
		}
		if (isAdmin) {
			fetchCharacters();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAdmin]);

	function handleSelectFilter(f) {
		if (f === filter) {
			setFilter(null);
		} else {
			setFilter(f);
		}
	}

	function calcCounts(chars) {
		const pendingCount = chars.filter((c) => {
			return !c.approval?.status || c.date.localeCompare(c.approval?.date) > 0;
		}).length;
		const approvedCount = chars.filter((c) => {
			return c.approval?.status === APPROVED;
		}).length;
		const deniedCount = chars.filter((c) => {
			return c.approval?.status === DENIED;
		}).length;
		setCounts({
			pending: pendingCount,
			approved: approvedCount,
			denied: deniedCount,
			total: chars.length,
		});
	}

	function handleApproval(approval) {
		const newChars = characters.map((c) => {
			if (c.id !== approval.id) return c;
			return { ...c, approval: approval, changes: "" };
		});
		setCharacters(newChars);
		setSelectedChar({ ...selectedChar, approval: approval, changes: "" });
		calcCounts(newChars);
	}

	function toggleDateOrder() {
		setDateOrder(!dateOrder);
	}

	const now = getCurrentDate().slice(0, 19);

	const sortedFilteredCharacters = characters
		.filter((c) => {
			if (!filter) return true;
			if (
				filter === PENDING &&
				(!c.approval?.status || c.date.localeCompare(c.approval?.date) > 0)
			) {
				return true;
			}
			return c.approval?.status === filter;
		})
		.sort((a, b) => a.date.localeCompare(b.date) * (dateOrder ? 1 : -1));

	const csvHeaders = [
		{ label: "Database ID", key: "id" },
		{ label: "Player Name", key: "player" },
		{ label: "Email", key: "email" },
		{ label: "Submission Date", key: "date" },
		{ label: "Comments", key: "comments" },
		{ label: "Approval Status", key: "approval.status" },
		{ label: "Approval Date", key: "approval.date" },
		{ label: "Approval Author", key: "approval.author" },
		{ label: "Approval Comment", key: "approval.comment" },
		{ label: "Hero Name", key: "heroName" },
		{ label: "Realm", key: "realm" },
		{ label: "Archetype", key: "archetype" },
		{ label: "Grace", key: "grace" },
		{ label: "Games Played", key: "gamesPlayed" },
		{ label: "Skills", key: "skills" },
		{ label: "Spells", key: "spells" },
		{ label: "Crafts", key: "crafts" },
		{ label: "Starting Item", key: "startingItem" },
		{ label: "Potions", key: "potions" },
		{ label: "Ceremonies", key: "ceremonies" },
		{ label: "Investment", key: "investment" },
		{ label: "Inv. Tier", key: "invTier" },
		{ label: "Inv. Option", key: "invOption" },
		{ label: "Inv. Region", key: "invRegion" },
		{ label: "Inv. Territory", key: "invTerritory" },
		{ label: "Warband", key: "warband" },
		{ label: "Sect", key: "sect" },
		{ label: "Backstory", key: "backstory" },
		{ label: "Inv. Story", key: "invDetails" },
		{ label: "IC Goals", key: "icGoals" },
		{ label: "OOC Goals", key: "oocGoals" },
	];

	async function handleMigrateInvestmentsButton() {
		const confirmMigration = window.confirm("Are you sure you want to migrate investments?");
		if (confirmMigration) {
			const chars = await getCharacterList();
			handleMigrateInvestments(chars);
		}
	}

	return isAdmin ? (
		<ApprovalsWrapper>
			<LeftColumn>
				<CSVLink
					data={characters}
					filename={`character-export-${now}.csv`}
					headers={csvHeaders}
				>
					<Button outline small>
						<ExportContents>
							<p>Export All</p>
							<BiExport />
						</ExportContents>
					</Button>
				</CSVLink>
				{isDev && false ? (
					<Button onClick={handleMigrateInvestmentsButton}>
						<p>🥾 Migrate Investments</p>
					</Button>
				) : null}
				<ApprovalListWrapper>
					<ListFilter
						filter={filter}
						selectFilter={handleSelectFilter}
						dateOrder={dateOrder}
						toggleDateOrder={toggleDateOrder}
						counts={counts}
					/>
					<CharacterList
						characters={sortedFilteredCharacters}
						handleSelect={setSelectedChar}
						activeCharacter={selectedChar}
					/>
				</ApprovalListWrapper>
			</LeftColumn>
			<ApprovalSelectWrapper>
				<CharacterCard character={selectedChar} />
				<ApprovalPanel character={selectedChar} handleApproval={handleApproval} />
			</ApprovalSelectWrapper>
		</ApprovalsWrapper>
	) : (
		<Navigate to={PATH_HOME} />
	);
}

export default Approvals;

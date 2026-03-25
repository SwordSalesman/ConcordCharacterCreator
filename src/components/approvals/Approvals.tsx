import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCharacterList, getApprovalList } from "../../hooks/use-firebase";
import useUserContext from "../../hooks/use-user-context";
import { APPROVED, DENIED, PATH_HOME, PENDING } from "../../utils/constants";
import CharacterList from "./CharacterList";
import ListFilter from "./ListFilter";
import CharacterCard from "./CharacterCard";
import ApprovalPanel from "./ApprovalPanel";
import { Button } from "../common/Button/Button";
import { BiExport } from "react-icons/bi";
import { CSVLink } from "react-csv";
import { getCurrentDate } from "../../utils/date-helper";
import { handleMigrateInvestments } from "../../utils/migration-helper";
import { ApprovalRecord, Character } from "./types";

interface Counts {
	pending: number;
	approved: number;
	denied: number;
	total: number;
}

function removeAllNewlines(input?: string): string {
	if (!input) return "";
	return input.replace(/(?:\r\n|\r|\n)/g, ". ").replace(/"/g, "'");
}

export function ApprovalsPage() {
	const router = useRouter();
	const [characters, setCharacters] = useState<Character[]>([]);
	const [selectedChar, setSelectedChar] = useState<Character | null>(null);
	const [filter, setFilter] = useState<string | null>(PENDING);
	const [dateOrder, setDateOrder] = useState(true);
	const { isAdmin } = useUserContext();
	const [counts, setCounts] = useState<Counts>({
		pending: 0,
		approved: 0,
		denied: 0,
		total: 0,
	});
	const isDev = process.env.NEXT_PUBLIC_DEBUG_TEXT === "DevMode";

	useEffect(() => {
		if (!isAdmin) router.replace(PATH_HOME);
	}, [isAdmin, router]);

	useEffect(() => {
		async function fetchCharacters() {
			const chars = await getCharacterList();
			const apprs = await getApprovalList();

			if (chars && apprs) {
				const newChars: Character[] = chars.map((c: any) => {
					const approval = apprs.find((a: any) => a.id === c.id);
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

	function handleSelectFilter(f: string) {
		setFilter(filter === f ? null : f);
	}

	function calcCounts(chars: Character[]) {
		const pendingCount = chars.filter((c) => {
			return !c.approval?.status || c.date.localeCompare(c.approval?.date) > 0;
		}).length;
		const approvedCount = chars.filter((c) => c.approval?.status === APPROVED).length;
		const deniedCount = chars.filter((c) => c.approval?.status === DENIED).length;
		setCounts({
			pending: pendingCount,
			approved: approvedCount,
			denied: deniedCount,
			total: chars.length,
		});
	}

	function handleApproval(approval: ApprovalRecord) {
		const newChars = characters.map((c) => {
			if (c.id !== approval.id) return c;
			return { ...c, approval, changes: "" };
		});
		setCharacters(newChars);
		if (selectedChar) setSelectedChar({ ...selectedChar, approval, changes: "" });
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

	if (!isAdmin) return null;

	return (
		<div className="mx-auto mt-2.5 flex flex-row h-[90vh] min-h-[600px] max-w-[1500px] w-[95%] font-[Arial,Helvetica,sans-serif]">
			<div className="flex-1 flex flex-col items-center justify-center gap-1.5 h-full">
				<CSVLink
					data={characters}
					filename={`character-export-${now}.csv`}
					headers={csvHeaders}
				>
					<Button variant="outline" size="sm">
						<div className="flex gap-1 mx-1">
							<p>Export All</p>
							<BiExport />
						</div>
					</Button>
				</CSVLink>
				<div className="border border-border mr-2.5 rounded-tl-[10px] rounded-tr-[10px] flex-1 w-full relative overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
				</div>
			</div>
			<div className="flex-[2] flex flex-col justify-between">
				<CharacterCard character={selectedChar} />
				<ApprovalPanel character={selectedChar} handleApproval={handleApproval} />
			</div>
		</div>
	);
}

export default ApprovalsPage;

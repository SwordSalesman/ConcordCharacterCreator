import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { getCharacterList, getApprovalList } from "../../hooks/use-firebase";
import useUserContext from "../../hooks/use-user-context";
import { APPROVED, ARCHIVED, DENIED, PATH_HOME, PENDING } from "../../utils/constants";
import CharacterList from "./CharacterList";
import ListFilter from "./ListFilter";
import CharacterCard from "./CharacterCard";
import ApprovalPanel from "./ApprovalPanel";
import { Button } from "../common/Button/Button";
import { BiExport } from "react-icons/bi";
import { CSVLink } from "react-csv";
import { getCurrentDate } from "../../utils/date-helper";
import { ApprovalRecord, Character } from "./types";
import { getSiteSettings } from "@/utils/settings";
import { Realm } from "@/data/tables/realms";

export interface Counts {
	pending: number;
	approved: number;
	denied: number;
	total: number;
	archived: number;
}

function removeAllNewlines(input?: string): string {
	if (!input) return "";
	return input.replace(/(?:\r\n|\r|\n)/g, ". ").replace(/"/g, "'");
}

export function Approvals() {
	const router = useRouter();
	const [characters, setCharacters] = useState<Character[]>([]);
	const [selectedChar, setSelectedChar] = useState<Character | null>(null);
	const [filter, setFilter] = useState<string | null>(PENDING);
	const [realmFilter, setRealmFilter] = useState<Realm | null>(null);
	const [search, setSearch] = useState("");
	const [dateOrder, setDateOrder] = useState(false);
	const { isAdmin } = useUserContext();
	const [counts, setCounts] = useState<Counts>({
		pending: 0,
		approved: 0,
		denied: 0,
		total: 0,
		archived: 0,
	});
	const isDev = process.env.NEXT_PUBLIC_DEBUG_TEXT === "DevMode";
	const [csvData, setCsvData] = useState<any[]>([]);

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
						approval: approval,
					};
				});
				setCharacters(newChars);
				calcCounts(newChars);

				const newCsvData = newChars
					.filter((c) => c.approval?.status !== ARCHIVED)
					.map((c) => ({
						...c,
						backstory: removeAllNewlines(c.backstory),
						invDetails: removeAllNewlines(c.invDetails),
						icGoals: removeAllNewlines(c.icGoals),
						oocGoals: removeAllNewlines(c.oocGoals),
						approval: {
							...c.approval,
							comment: removeAllNewlines(c.approval?.comment),
						},
					}));
				setCsvData(newCsvData);

				console.debug("Fetched characters and approvals:", newChars);
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
		const archivedCount = chars.filter((c) => c.approval?.status === ARCHIVED).length;
		const newCounts: Counts = {
			pending: pendingCount,
			approved: approvedCount,
			denied: deniedCount,
			archived: archivedCount,
			total: chars.length - archivedCount,
		};
		console.debug("Character counts:", newCounts);
		setCounts(newCounts);
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
			if (!filter && c.approval?.status !== ARCHIVED) return true;
			if (
				filter === PENDING &&
				(!c.approval?.status || c.date.localeCompare(c.approval?.date) > 0)
			) {
				return true;
			}
			return c.approval?.status === filter;
		})
		.filter((c) => {
			if (!search) return true;
			const lowerSearch = search.toLowerCase();
			return (
				c.heroName.toLowerCase().includes(lowerSearch) ||
				c.player.toLowerCase().includes(lowerSearch) ||
				c.email.toLowerCase().includes(lowerSearch)
			);
		})
		.filter((c) => {
			if (!realmFilter) return true;
			return c.realm === realmFilter;
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

	if (!isAdmin) return null;

	return (
		<div className="mx-auto mt-2 flex flex-col sm:flex-row gap-2 sm:h-[90vh] min-h-[600px] max-w-[1400px] w-[100%] font-[Arial,sans-serif]">
			<div className="flex flex-col items-center justify-center gap-1.5 h-[400px] sm:flex-1 flex-none sm:h-full">
				<CSVLink
					data={csvData}
					filename={`character-export-${now}.csv`}
					headers={csvHeaders}
				>
					<Button variant="outline" size="sm">
						<div className="flex items-center gap-2 mx-1">
							<p>Export All</p>
							<BiExport />
						</div>
					</Button>
				</CSVLink>
				{/* <UploadGroupList /> */}
				<div className="border border-border rounded-tl-lg rounded-tr-lg flex-1 w-full relative overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
					{getSiteSettings().features.groupSubmissions && (
						<div className="flex justify-around">
							<Button
								className="flex-1 border-none rounded-[0px] bg-background-raised"
								variant="ghost"
							>
								Heroes
							</Button>
							<Button
								className="flex-1 border-none rounded-[0px] bg-background-raised"
								variant="ghost"
							>
								Bands
							</Button>
						</div>
					)}
					<ListFilter
						filter={filter}
						selectFilter={handleSelectFilter}
						dateOrder={dateOrder}
						toggleDateOrder={toggleDateOrder}
						search={search}
						setSearch={setSearch}
						realmFilter={realmFilter}
						setRealmFilter={setRealmFilter}
						counts={counts}
					/>
					<CharacterList
						characters={sortedFilteredCharacters}
						handleSelect={setSelectedChar}
						activeCharacter={selectedChar}
					/>
				</div>
			</div>
			<div className="flex-2 flex flex-col justify-between max-h-[100%]">
				<CharacterCard character={selectedChar} />
				<ApprovalPanel character={selectedChar} handleApproval={handleApproval} />
			</div>
		</div>
	);
}

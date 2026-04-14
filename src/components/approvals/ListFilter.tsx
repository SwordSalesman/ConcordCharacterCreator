import { BiChevronDown } from "react-icons/bi";
import { Button } from "../common/Button/Button";
import { APPROVED, ARCHIVED, DENIED, PENDING } from "../../utils/constants";
import { cn } from "@/lib/utils";
import { Counts, DateType } from "./Approvals";
import { Input } from "../common/Input/Input";
import { useRef, useState } from "react";
import { Realm, realms } from "@/data/tables/realms";
import Image from "next/image";
import { FaArchive, FaEye, FaThumbsDown, FaThumbsUp } from "react-icons/fa";

interface Props {
	dateOrder: boolean;
	toggleDateOrder: () => void;
	dateType: DateType;
	toggleDateType: () => void;
	filter: string | null;
	selectFilter: (filter: string) => void;
	search: string;
	setSearch: (search: string) => void;
	realmFilter: Realm | null;
	setRealmFilter: (realm: Realm | null) => void;
	counts: Counts;
}

function ListFilter({
	dateOrder,
	toggleDateOrder,
	dateType,
	toggleDateType,
	filter,
	selectFilter,
	search,
	setSearch,
	realmFilter,
	setRealmFilter,
	counts,
}: Props) {
	const [localSearch, setLocalSearch] = useState(search);
	const timeout = useRef<NodeJS.Timeout | null>(null);

	const showRealmFilter = false;

	// Debounced search input. Only calls setSearch after user stops typing for 250ms
	function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		setLocalSearch(e.target.value);
		if (timeout.current) clearTimeout(timeout.current);
		timeout.current = setTimeout(() => {
			setSearch(e.target.value);
		}, 250);
	}

	return (
		<div className="p-1.5 border-b border-border sticky top-0 z-6 bg-background-raised flex flex-col gap-1.5">
			<div className="flex justify-between items-center">
				<div className="grid grid-cols-4 items-center gap-1">
					<Button
						variant={filter === PENDING ? "primary" : "secondary"}
						onClick={() => selectFilter(PENDING)}
						size="sm"
					>
						<FaEye /> {counts.pending}
					</Button>
					<Button
						variant={filter === APPROVED ? "primary" : "secondary"}
						onClick={() => selectFilter(APPROVED)}
						size="sm"
					>
						<FaThumbsUp /> {counts.approved}
					</Button>
					<Button
						variant={filter === DENIED ? "primary" : "secondary"}
						onClick={() => selectFilter(DENIED)}
						size="sm"
					>
						<FaThumbsDown /> {counts.denied}
					</Button>
				</div>
				<Button
					variant={filter === ARCHIVED ? "primary" : "secondary"}
					onClick={() => selectFilter(ARCHIVED)}
					size="sm"
				>
					<FaArchive />
				</Button>
			</div>
			{showRealmFilter && (
				<div className="flex flex-row justify-left gap-1 ">
					{realms.map((realm) => {
						return (
							<Button
								variant={realm.name === realmFilter ? "primary" : "secondary"}
								onClick={() =>
									setRealmFilter(realm.name === realmFilter ? null : realm.name)
								}
								size="icon"
								key={realm.name}
							>
								<Image
									src={realm.image}
									alt={realm.name}
									className="size-8 brightness-10 dark:invert"
								/>
							</Button>
						);
					})}
				</div>
			)}
			<div className="flex justify-left gap-1">
				<Button variant={"secondary"} onClick={toggleDateType} size="sm">
					{dateType === "submission" ? "Submission" : "Approval"} Date
				</Button>
				<Button variant={"secondary"} onClick={toggleDateOrder} size="sm">
					{dateOrder ? "Oldest to Newest" : "Newest to Oldest"}
					{/* <div
						className={cn(
							"transition-transform duration-300",
							!dateOrder ? "rotate-180" : "rotate-0",
						)}
					>
						<BiChevronDown size={20} />
					</div> */}
				</Button>
			</div>
			<div>
				<Input
					placeholder="Search by hero name, player name, or email"
					value={localSearch}
					onChange={handleSearchChange}
					type="text"
				/>
			</div>
		</div>
	);
}

export default ListFilter;
